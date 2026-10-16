<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PresensiController extends Controller
{
    
    public function store(Request $request)
    {
        $request->validate([
            'rfid_uid' => 'required'
        ]);

        $result = $this->prosesPresensi($request->rfid_uid);

        return response()->json($result['data'], $result['http_code']);
    }

    
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
        $today = $now->toDateString();
        $currentTime = $now->toTimeString();

        $presensi = Presensi::where('siswa_id', $siswa->id)
            ->whereDate('tanggal', $today)
            ->first();

        if (!$presensi) {
            $jamBatas = '07:00:00';
            $status = ($currentTime <= $jamBatas) ? 'Hadir' : 'Terlambat';

            Presensi::create([
                'siswa_id' => $siswa->id,
                'tanggal' => $today,
                'waktu' => $currentTime,
                'status' => $status,
            ]);

            return [
                'http_code' => 200,
                'data' => [
                    'status' => 'success',
                    'message' => 'Presensi Masuk Berhasil!',
                    'siswa' => $siswa->nama_siswa,
                    'tipe' => 'Masuk',
                    'waktu_masuk' => $currentTime,
                    'status_presensi' => $status
                ]
            ];
        }

        // TAP 2: PRESENSI PULANG
        if (empty($presensi->waktu_pulang)) {
            $presensi->update([
                'waktu_pulang' => $currentTime
            ]);

            return [
                'http_code' => 200,
                'data' => [
                    'status' => 'success',
                    'message' => 'Presensi Pulang Berhasil!',
                    'siswa' => $siswa->nama_siswa,
                    'tipe' => 'Pulang',
                    'waktu_pulang' => $currentTime,
                    'status_presensi' => $presensi->status
                ]
            ];
        }

        return [
            'http_code' => 200,
            'data' => [
                'status' => 'error',
                'message' => 'Sudah Absen Masuk & Pulang'
            ]
        ];
    }
}