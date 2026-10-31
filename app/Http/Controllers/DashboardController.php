<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
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
                        'siswa_id'   => $siswa->id,
                        'tanggal'    => $today,
                        'waktu'      => null,
                        'status'     => 'Tidak Hadir',
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

    
    private function queryPresensiUntuk(User $user)
    {
        $query = Presensi::with(['siswa.kelas']);

        if ($user->role !== 'super_admin') {
            $query->whereHas('siswa', function ($siswaQuery) use ($user) {
                $siswaQuery->whereIn(
                    'kelas_id',
                    $user->kelasDiampu()->select('kelas.id')
                );
            });
        }

        return $query;
    }

   
    private function totalSiswaUntuk(User $user): int
    {
        $query = Siswa::query();

        if ($user->role !== 'super_admin') {
            $query->whereIn(
                'kelas_id',
                $user->kelasDiampu()->select('kelas.id')
            );
        }

        return $query->count();
    }

    
    private function statistik($presensi, User $user): array
    {
        return [
            'hadir'       => $presensi->where('status', 'Hadir')->count(),
            'terlambat'   => $presensi->where('status', 'Terlambat')->count(),
            'izin'        => $presensi->where('status', 'Izin')->count(),
            'sakit'       => $presensi->where('status', 'Sakit')->count(),
            'tidak_hadir' => $presensi->where('status', 'Tidak Hadir')->count(),
            'total_siswa' => $this->totalSiswaUntuk($user),
        ];
    }

    public function index(Request $request)
    {
        $user = $request->user();

        abort_unless($user, 401);

        $today = Carbon::today('Asia/Jakarta')->toDateString();

        // Tetap membuat data presensi untuk seluruh siswa.
        $this->autoGeneratePresensi($today);

        // Data yang ditampilkan mengikuti hak akses pengguna.
        $presensiHariIni = $this->queryPresensiUntuk($user)
            ->whereDate('tanggal', $today)
            ->latest('updated_at')
            ->get();

        // Informasi permintaan reset password hanya untuk super admin.
        $pendingResets = $user->role === 'super_admin'
            ? DB::table('password_reset_requests')
                ->where('status', 'pending')
                ->get()
            : collect();

        return Inertia::render('Dashboard', [
            // PERBAIKAN: Sertakan objek 'auth' lengkap agar dibaca oleh React (Header & Modal Profil)
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

            'userProfile' => [
                'name' => $user->name ?? '-',
                'nip'  => $user->nip ?? '-',
            ],

            'presensi' => $presensiHariIni,

            'pendingResets' => $pendingResets,

            'stats' => $this->statistik($presensiHariIni, $user),
        ]);
    }

    /**
     * Endpoint pembaruan data dashboard.
     */
    public function getLatestData(Request $request)
    {
        $user = $request->user();

        abort_unless($user, 401);

        $today = Carbon::today('Asia/Jakarta')->toDateString();

        $this->autoGeneratePresensi($today);

        $presensiHariIni = $this->queryPresensiUntuk($user)
            ->whereDate('tanggal', $today)
            ->latest('updated_at')
            ->get();

        return response()->json([
            'presensi'         => $presensiHariIni,
            'presensi_terbaru' => $presensiHariIni,
            'stats'            => $this->statistik($presensiHariIni, $user),
        ]);
    }
}