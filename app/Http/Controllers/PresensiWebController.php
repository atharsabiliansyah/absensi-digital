<?php

namespace App\Http\Controllers;

use App\Models\Presensi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiWebController extends Controller
{
    /**
     * Menampilkan halaman utama Presensi Harian via Inertia.js
     */
    public function index()
    {
        return Inertia::render('Presensi');
    }

    public function getPresensiList(Request $request)
    {
        $tanggal = $request->get('tanggal', Carbon::today('Asia/Jakarta')->toDateString());
        $jurusan = $request->get('jurusan');
        $kelas = $request->get('kelas');

        $query = Presensi::with(['siswa.kelas'])
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

        $data = $query->latest('waktu')->get();

        return response()->json([
            'data' => $data,
            'total' => $data->count()
        ]);
    }
}