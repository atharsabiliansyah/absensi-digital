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

        $uidClean = strtoupper(str_replace([':', ' '], '', $request->rfid_uid));

        
        Cache::put('last_scanned_rfid', $uidClean, 120);

        
        $siswa = Siswa::where('rfid_uid', $uidClean)->first();

       if (!$siswa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID belum terdaftar!'
            ], 200); 
        }

        
        if ($siswa->status === 'Nonaktif') {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID atas nama ' . $siswa->nama_siswa . ' telah dinonaktifkan!'
            ], 200); 
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

            return response()->json([
                'status' => 'success',
                'message' => 'Presensi Masuk Berhasil!',
                'siswa' => $siswa->nama_siswa,
                'tipe' => 'Masuk',
                'waktu_masuk' => $currentTime,
                'status_presensi' => $status
            ], 200);
        }

        
        if (empty($presensi->waktu_pulang)) {
            $presensi->update([
                'waktu_pulang' => $currentTime
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Presensi Pulang Berhasil!',
                'siswa' => $siswa->nama_siswa,
                'tipe' => 'Pulang',
                'waktu_pulang' => $currentTime,
                'status_presensi' => $presensi->status
            ], 200);
        }

        
        return response()->json([
            'status' => 'error',
            'message' => 'Siswa sudah melakukan presensi masuk dan pulang hari ini!'
        ], 200);
    }
}