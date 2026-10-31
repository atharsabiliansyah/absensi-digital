<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Kelas;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiWebController extends Controller
{
    private function autoGeneratePresensi(string $today): void
    {
        $exists = Presensi::whereDate('tanggal', $today)->exists();

        if (!$exists) {
            $sekarang = now('Asia/Jakarta');

            $dataPresensiBaru = Siswa::query()
                ->select('id')
                ->get()
                ->map(function ($siswa) use ($today, $sekarang) {
                    return [
                        'siswa_id' => $siswa->id,
                        'tanggal' => $today,
                        'waktu' => null,
                        'status' => 'Tidak Hadir',
                        'created_at' => $sekarang,
                        'updated_at' => $sekarang,
                    ];
                })
                ->all();

            if (!empty($dataPresensiBaru)) {
                Presensi::insert($dataPresensiBaru);
            }
        }
    }

    public function index(Request $request)
{
    $user = $request->user();

    abort_unless($user, 401);

    return Inertia::render('Presensi', [
        'auth' => [
            'user' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'username' => $user->username,
                'email'    => $user->email,
                'nip'      => $user->nip ?? '-',
                'role'     => $user->role ?? 'User',
            ],
        ],
    ]);
}

    /**
     * Query presensi sesuai hak akses pengguna.
     */
    private function queryPresensiUntuk(User $user)
    {
        $query = Presensi::with(['siswa.kelas']);

        if ($user->role !== 'super_admin') {
            $query->whereHas('siswa', function ($q) use ($user) {
                $q->whereIn(
                    'kelas_id',
                    $user->kelasDiampu()->select('kelas.id')
                );
            });
        }

        return $query;
    }

    /**
     * Mengambil tipe kelas dari database.
     */
    private function daftarTipeKelas(User $user)
    {
        $query = Kelas::query()
            ->whereNotNull('tipe_kelas')
            ->where('tipe_kelas', '!=', '');

        if ($user->role !== 'super_admin') {
            $query->whereIn(
                'id',
                $user->kelasDiampu()->select('kelas.id')
            );
        }

        return $query
            ->select('tipe_kelas')
            ->distinct()
            ->orderBy('tipe_kelas')
            ->pluck('tipe_kelas')
            ->values();
    }

    public function getPresensiList(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $today = Carbon::today('Asia/Jakarta')->toDateString();

        $tanggal = $request->get('tanggal', $today);
        $jurusan = $request->get('jurusan');
        $kelas = $request->get('kelas');
        $tipeKelas = $request->get('tipe_kelas', 'Semua');

        if ($tanggal === $today) {
            $this->autoGeneratePresensi($today);
        }

        $query = $this->queryPresensiUntuk($user)
            ->whereDate('tanggal', $tanggal);

        if ($jurusan && $jurusan !== 'Semua Jurusan') {
            $query->whereHas('siswa.kelas', function ($q) use ($jurusan) {
                $q->where('jurusan', $jurusan);
            });
        }

        if ($kelas && $kelas !== 'Semua Kelas') {
            $query->whereHas('siswa.kelas', function ($q) use ($kelas) {
                $q->where('nama_kelas', $kelas);
            });
        }

        if ($tipeKelas !== '' && $tipeKelas !== 'Semua') {
            $query->whereHas('siswa.kelas', function ($q) use ($tipeKelas) {
                $q->where('tipe_kelas', $tipeKelas);
            });
        }

        $data = $query
            ->orderBy('siswa_id', 'asc')
            ->get();

        return response()->json([
            'data' => $data,
            'total' => $data->count(),
            'tipeKelases' => $this->daftarTipeKelas($user),
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $request->validate([
            'status' => [
                'required',
                'in:Hadir,Terlambat,Izin,Sakit,Tidak Hadir',
            ],
        ]);

        $presensi = $this->queryPresensiUntuk($user)
            ->whereKey($id)
            ->firstOrFail();

        $updateData = [
            'status' => $request->status,
        ];

        if (
            in_array($request->status, ['Hadir', 'Terlambat']) &&
            !$presensi->waktu
        ) {
            $updateData['waktu'] = Carbon::now('Asia/Jakarta')
                ->format('H:i:s');
        }

        if (in_array($request->status, ['Izin', 'Sakit', 'Tidak Hadir'])) {
            $updateData['waktu'] = null;
        }

        $presensi->update($updateData);

        return response()->json([
            'message' => 'Status presensi berhasil diperbarui!',
            'data' => $presensi->fresh()->load(['siswa.kelas']),
        ]);
    }
}
