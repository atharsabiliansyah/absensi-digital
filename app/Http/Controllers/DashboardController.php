<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use App\Models\Siswa;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today('Asia/Jakarta')->toDateString();

        // Ambil data presensi khusus HARI INI, diurutkan berdasarkan aktivitas terbaru (updated_at)
        $presensiHariIni = Presensi::with(['siswa.kelas'])
            ->whereDate('tanggal', $today)
            ->latest('updated_at')
            ->get();

        // Hitung statistik hari ini
        $totalHadir = $presensiHariIni->where('status', 'Hadir')->count();
        $totalTerlambat = $presensiHariIni->where('status', 'Terlambat')->count();
        $totalTidakHadir = $presensiHariIni->where('status', 'Tidak Hadir')->count();
        $totalSiswa = Siswa::count();

        // Kirim data ke komponen  Dashboard
        return Inertia::render('Dashboard', [
            'presensi' => $presensiHariIni,
            'stats' => [
                'hadir' => $totalHadir,
                'terlambat' => $totalTerlambat,
                'tidak_hadir' => $totalTidakHadir,
                'total_siswa' => $totalSiswa,
            ]
        ]);
    }

    public function getLatestData()
    {
        $today = Carbon::today('Asia/Jakarta')->toDateString();

        
        $presensiHariIni = Presensi::with(['siswa.kelas'])
            ->whereDate('tanggal', $today)
            ->latest('updated_at')
            ->get();

        return response()->json([
            'presensi' => $presensiHariIni,
            'presensi_terbaru' => $presensiHariIni, 
            'stats' => [
                'hadir' => $presensiHariIni->where('status', 'Hadir')->count(),
                'terlambat' => $presensiHariIni->where('status', 'Terlambat')->count(),
                'tidak_hadir' => $presensiHariIni->where('status', 'Tidak Hadir')->count(),
                'total_siswa' => Siswa::count(),
            ]
        ]);
    }
}