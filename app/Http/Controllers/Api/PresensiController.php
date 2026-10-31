<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PresensiController extends Controller
{
    /**
     * Endpoint untuk memuat daftar presensi beserta filter (Tanggal, Jurusan, Kelas, Tipe Kelas)
     * URL: GET /api/presensi-list
     */
    public function getPresensiList(Request $request)
    {
        $tanggal = $request->input('tanggal', Carbon::now('Asia/Jakarta')->toDateString());
        $jurusan = $request->input('jurusan');
        $kelas = $request->input('kelas');
        $tipeKelas = $request->input('tipe_kelas');

        // Query data presensi dengan eager loading siswa dan kelasnya
        $query = Presensi::with(['siswa.kelas'])
            ->whereDate('tanggal', $tanggal);

        // Filter berdasarkan Jurusan
        if (!empty($jurusan) && $jurusan !== 'Semua Jurusan') {
            $query->whereHas('siswa.kelas', function ($q) use ($jurusan) {
                $q->where('jurusan', $jurusan);
            });
        }

        // Filter berdasarkan Nama Kelas (X, XI, XII)
        if (!empty($kelas) && $kelas !== 'Semua Kelas') {
            $query->whereHas('siswa.kelas', function ($q) use ($kelas) {
                $q->where('nama_kelas', $kelas);
            });
        }

        // Filter berdasarkan Tipe Kelas (1, 2, 3)
        if (!empty($tipeKelas) && $tipeKelas !== 'Semua') {
            $query->whereHas('siswa.kelas', function ($q) use ($tipeKelas) {
                $q->where('tipe_kelas', $tipeKelas);
            });
        }

        $presensiList = $query->get();

        // Ambil daftar unik Tipe Kelas dari database untuk mengisi dropdown filter frontend
        $tipeKelases = Kelas::whereNotNull('tipe_kelas')
            ->distinct()
            ->pluck('tipe_kelas')
            ->map(fn($item) => (string) $item)
            ->sort()
            ->values()
            ->toArray();

        // Cadangan jika tabel kelas belum memiliki data tipe_kelas
        if (empty($tipeKelases)) {
            $tipeKelases = ['1', '2', '3'];
        }

        return response()->json([
            'status' => 'success',
            'data' => $presensiList,
            'total' => $presensiList->count(),
            'tipeKelases' => $tipeKelases,
        ], 200);
    }

    /**
     * Endpoint untuk mengubah status presensi siswa (Hadir, Terlambat, Izin, Sakit, Tidak Hadir)
     * URL: PATCH /api/presensi/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Hadir,Terlambat,Izin,Sakit,Tidak Hadir',
        ]);

        $presensi = Presensi::find($id);

        if (!$presensi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data presensi tidak ditemukan!'
            ], 404);
        }

        $presensi->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status presensi berhasil diperbarui!',
            'data' => $presensi
        ], 200);
    }

    /**
     * RFID Store via JSON API
     */
    public function store(Request $request)
    {
        $request->validate([
            'rfid_uid' => 'required'
        ]);

        $result = $this->prosesPresensi($request->rfid_uid);

        return response()->json($result['data'], $result['http_code']);
    }

    /**
     * RFID Scan Handler untuk Hardware / Microcontroller (ESP32/ESP8266)
     */
    public function scanHandler(Request $request)
    {
        $rawUid = $request->input('rfid_uid');

        if (empty($rawUid)) {
            $rawUid = $request->getContent();
        }

        if (str_contains($rawUid, '=')) {
            $parts = explode('=', $rawUid);
            $rawUid = end($parts);
        }

        if (empty($rawUid)) {
            return response("NO|UID Kosong", 200)->header('Content-Type', 'text/plain');
        }

        $result = $this->prosesPresensi($rawUid);

        if ($result['data']['status'] === 'success') {
            return response("OK|" . $result['data']['siswa'], 200)->header('Content-Type', 'text/plain');
        }

        return response("NO|" . $result['data']['message'], 200)->header('Content-Type', 'text/plain');
    }

    /**
     * Process RFID Tap Logic
     */
    private function prosesPresensi($rawUid)
    {
        $uidClean = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $rawUid));
        Cache::put('last_scanned_rfid', $uidClean, 120);

        $siswa = Siswa::whereRaw("TRIM(UPPER(rfid_uid)) = ?", [$uidClean])->first();

        if (!$siswa) {
            return [
                'http_code' => 200,
                'data' => [
                    'status' => 'error',
                    'message' => 'Kartu Belum Terdaftar!'
                ]
            ];
        }

        if ($siswa->status === 'Nonaktif') {
            return [
                'http_code' => 200,
                'data' => [
                    'status' => 'error',
                    'message' => 'Kartu Nonaktif!'
                ]
            ];
        }

        $now = Carbon::now('Asia/Jakarta');
        $dayOfWeek = (int) $now->format('N');

        if ($dayOfWeek === 7) {
            return [
                'http_code' => 200,
                'data' => [
                    'status' => 'error',
                    'message' => 'Sistem Libur (Hari Minggu)'
                ]
            ];
        }

        $today = $now->toDateString();
        $currentTime = $now->toTimeString();

        // Cek data presensi hari ini
        $presensi = Presensi::where('siswa_id', $siswa->id)
            ->whereDate('tanggal', $today)
            ->first();

        // Jika siswa SUDAH pernah ngetap (waktu sudah terisi), cegah tap ulang
        if ($presensi && $presensi->waktu !== null) {
            return [
                'http_code' => 200,
                'data' => [
                    'status'  => 'error',
                    'message' => 'Siswa Sudah Absen Hari Ini!'
                ]
            ];
        }

        // Hitung Sesi dan Batas Toleransi
        $cutoffSesi = '11:00:00';
        $isPagi   = $currentTime < $cutoffSesi;
        $sesi     = $isPagi ? 'Pagi' : 'Siang';
        $jamBatas = $isPagi ? $this->getBatasToleransiPagi($now) : $this->getBatasToleransiSiang($now);

        // Tentukan status (Hadir / Terlambat)
        $status = ($currentTime <= $jamBatas) ? 'Hadir' : 'Terlambat';

        // Simpan / Update Presensi
        if ($presensi) {
            $presensi->update([
                'waktu'  => $currentTime,
                'status' => $status,
            ]);
        } else {
            Presensi::create([
                'siswa_id' => $siswa->id,
                'tanggal'  => $today,
                'waktu'    => $currentTime,
                'status'   => $status,
            ]);
        }

        return [
            'http_code' => 200,
            'data' => [
                'status'          => 'success',
                'message'         => "Presensi {$status} Berhasil!",
                'siswa'           => $siswa->nama_siswa,
                'tipe'            => 'Masuk',
                'sesi'            => $sesi,
                'batas_toleransi' => date('H:i', strtotime($jamBatas)) . ' WIB',
                'waktu_masuk'     => $currentTime,
                'status_presensi' => $status
            ]
        ];
    }

    /**
     * Menentukan batas toleransi keterlambatan SESI PAGI
     */
    private function getBatasToleransiPagi(Carbon $now): string
    {
        $dayOfWeek = (int) $now->format('N');

        try {
            if (class_exists('App\Models\JamOperasional')) {
                $hariIndo = match ($dayOfWeek) {
                    1 => 'Senin',
                    2 => 'Selasa',
                    3 => 'Rabu',
                    4 => 'Kamis',
                    5 => 'Jumat',
                    6 => 'Sabtu',
                    default => 'Minggu',
                };

                $config = \App\Models\JamOperasional::where('hari', 'like', "%{$hariIndo}%")->first();
                if ($config && !empty($config->batas_toleransi)) {
                    return $config->batas_toleransi;
                }
            }
        } catch (\Throwable $e) {
            // Fail silently
        }

        return match ($dayOfWeek) {
            1 => '07:30:00',
            5 => '07:05:00',
            6 => '08:00:00',
            default => '07:15:00',
        };
    }

    /**
     * Menentukan batas toleransi keterlambatan SESI SIANG
     */
    private function getBatasToleransiSiang(Carbon $now): string
    {
        $dayOfWeek = (int) $now->format('N');

        try {
            if (class_exists('App\Models\JamOperasional')) {
                $hariIndo = match ($dayOfWeek) {
                    1 => 'Senin',
                    2 => 'Selasa',
                    3 => 'Rabu',
                    4 => 'Kamis',
                    5 => 'Jumat',
                    6 => 'Sabtu',
                    default => 'Minggu',
                };

                $config = \App\Models\JamOperasional::where('hari', 'like', "%{$hariIndo}%")->first();
                if ($config && !empty($config->jam_masuk_siang)) {
                    return $config->jam_masuk_siang;
                }
            }
        } catch (\Throwable $e) {
            // Fail silently
        }

        return '12:40:00';
    }
}
