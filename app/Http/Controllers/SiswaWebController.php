<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SiswaWebController extends Controller
{
    public function getSiswaList(Request $request)
    {
        $query = Siswa::with('kelas');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nama_siswa', 'like', '%' . $request->search . '%')
                  ->orWhere('nisn', 'like', '%' . $request->search . '%')
                  ->orWhere('rfid_uid', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->jurusan && $request->jurusan !== 'Semua Jurusan') {
            $query->whereHas('kelas', function ($q) use ($request) {
                $q->where('jurusan', $request->jurusan);
            });
        }

        if ($request->status && $request->status !== 'Semua Status') {
            $query->where('status', $request->status);
        }

        $data = $query->latest()->get();

        return response()->json([
            'data' => $data,
            'total' => $data->count()
        ]);
    }

    public function getLastRfid()
    {
        $uid = Cache::get('last_scanned_rfid', '');
        return response()->json([
            'rfid_uid' => $uid
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nisn' => 'required',
            'nama_siswa' => 'required',
            'rfid_uid' => 'required',
            'jurusan' => 'required',
            'kelas' => 'required',
        ]);

        $cleanUid = strtoupper(str_replace([':', ' '], '', $request->rfid_uid));

        if (Siswa::where('rfid_uid', $cleanUid)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID ini sudah terdaftar atas nama siswa lain!'
            ], 422);
        }

        $namaKelasLengkap = $request->kelas . ' ' . $request->jurusan;
        $kelasObj = Kelas::firstOrCreate(
            ['nama_kelas' => $namaKelasLengkap, 'jurusan' => $request->jurusan]
        );

        $siswa = Siswa::create([
            'nisn' => $request->nisn,
            'nama_siswa' => $request->nama_siswa,
            'rfid_uid' => $cleanUid,
            'kelas_id' => $kelasObj->id,
            'status' => $request->status ?? 'Aktif',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil ditambahkan!',
            'data' => $siswa
        ]);
    }

    public function update(Request $request, $id)
    {
        $siswa = Siswa::findOrFail($id);

        $request->validate([
            'nisn' => 'required',
            'nama_siswa' => 'required',
            'rfid_uid' => 'required',
            'jurusan' => 'required',
            'kelas' => 'required',
        ]);

        $cleanUid = strtoupper(str_replace([':', ' '], '', $request->rfid_uid));

        $namaKelasLengkap = $request->kelas . ' ' . $request->jurusan;
        $kelasObj = Kelas::firstOrCreate(
            ['nama_kelas' => $namaKelasLengkap, 'jurusan' => $request->jurusan]
        );

        $siswa->update([
            'nisn' => $request->nisn,
            'nama_siswa' => $request->nama_siswa,
            'rfid_uid' => $cleanUid,
            'kelas_id' => $kelasObj->id,
            'status' => $request->status ?? 'Aktif',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil diperbarui!'
        ]);
    }

   
    public function destroy($id)
    {
        $siswa = Siswa::findOrFail($id);
        $siswa->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil dihapus!'
        ]);
    }
}