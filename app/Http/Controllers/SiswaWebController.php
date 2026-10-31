<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SiswaWebController extends Controller
{
    public function index(Request $request)
{
    $user = $request->user();

    abort_unless($user, 401);

    return Inertia::render('DataSiswa', [
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
     * Query siswa sesuai hak akses pengguna.
     */
    private function querySiswaUntuk(User $user)
    {
        $query = Siswa::with('kelas');

        if ($user->role !== 'super_admin') {
            $query->whereIn(
                'kelas_id',
                $user->kelasDiampu()->select('kelas.id')
            );
        }

        return $query;
    }

    /**
     * Mengambil daftar siswa.
     */
    public function getSiswaList(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $query = $this->querySiswaUntuk($user);

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('nama_siswa', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('rfid_uid', 'like', "%{$search}%");
            });
        }

        if (
            $request->filled('jurusan') &&
            $request->jurusan !== 'Semua Jurusan'
        ) {
            $query->whereHas('kelas', function ($q) use ($request) {
                $q->where('jurusan', $request->jurusan);
            });
        }

        if (
            $request->filled('status') &&
            $request->status !== 'Semua Status'
        ) {
            $query->where('status', $request->status);
        }

        $data = $query->latest()->get();

        return response()->json([
            'data' => $data,
            'total' => $data->count(),
        ]);
    }

    /**
     * Mengambil UID RFID terakhir.
     */
    public function getLastRfid(Request $request)
    {
        abort_unless($request->user(), 401);

        return response()->json([
            'rfid_uid' => Cache::get('last_scanned_rfid', ''),
        ]);
    }

    /**
     * Memastikan guru hanya mengelola kelas yang ditugaskan.
     */
    private function pastikanAksesKelas(User $user, Kelas $kelas): void
    {
        if ($user->role === 'super_admin') {
            return;
        }

        abort_unless(
            $user->kelasDiampu()
                ->where('kelas.id', $kelas->id)
                ->exists(),
            403,
            'Anda tidak memiliki akses ke kelas ini.'
        );
    }

    /**
     * Mencari kelas berdasarkan jurusan dan tingkat.
     */
    private function cariKelas(Request $request): Kelas
    {
        $request->validate([
            'jurusan' => 'required|string|max:100',
            'kelas' => 'required|string|max:100',
        ]);

        $tingkat = trim((string) $request->kelas);
        $jurusan = trim((string) $request->jurusan);

        $kelasObj = Kelas::where('jurusan', $jurusan)
            ->where(function ($q) use ($tingkat, $jurusan) {
                $q->where('nama_kelas', $tingkat)
                    ->orWhere('nama_kelas', $tingkat . ' ' . $jurusan);
            })
            ->first();

        abort_if(
            !$kelasObj,
            422,
            'Kelas yang dipilih tidak ditemukan di database.'
        );

        return $kelasObj;
    }

    /**
     * Menambahkan siswa.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $request->validate([
            'nisn' => 'required|string|max:50',
            'nama_siswa' => 'required|string|max:255',
            'rfid_uid' => 'required|string|max:100',
            'jurusan' => 'required|string|max:100',
            'kelas' => 'required|string|max:100',
            'status' => 'nullable|in:Aktif,Nonaktif',
        ]);

        $kelasObj = $this->cariKelas($request);
        $this->pastikanAksesKelas($user, $kelasObj);

        $cleanUid = strtoupper(
            str_replace([':', ' '], '', $request->rfid_uid)
        );

        if (Siswa::where('rfid_uid', $cleanUid)->exists()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID ini sudah terdaftar atas nama siswa lain!',
            ], 422);
        }

        $siswa = Siswa::create([
            'nisn' => $request->nisn,
            'nama_siswa' => $request->nama_siswa,
            'rfid_uid' => $cleanUid,
            'kelas_id' => $kelasObj->id,
            'status' => $request->input('status', 'Aktif'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil ditambahkan!',
            'data' => $siswa->load('kelas'),
        ]);
    }

    /**
     * Memperbarui data siswa.
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $siswa = $this->querySiswaUntuk($user)
            ->whereKey($id)
            ->firstOrFail();

        $request->validate([
            'nisn' => 'required|string|max:50',
            'nama_siswa' => 'required|string|max:255',
            'rfid_uid' => 'required|string|max:100',
            'jurusan' => 'required|string|max:100',
            'kelas' => 'required|string|max:100',
            'status' => 'nullable|in:Aktif,Nonaktif',
        ]);

        $kelasObj = $this->cariKelas($request);
        $this->pastikanAksesKelas($user, $kelasObj);

        $cleanUid = strtoupper(
            str_replace([':', ' '], '', $request->rfid_uid)
        );

        if (
            Siswa::where('rfid_uid', $cleanUid)
                ->where('id', '!=', $siswa->id)
                ->exists()
        ) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID ini sudah terdaftar atas nama siswa lain!',
            ], 422);
        }

        $siswa->update([
            'nisn' => $request->nisn,
            'nama_siswa' => $request->nama_siswa,
            'rfid_uid' => $cleanUid,
            'kelas_id' => $kelasObj->id,
            'status' => $request->input('status', $siswa->status),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil diperbarui!',
            'data' => $siswa->fresh()->load('kelas'),
        ]);
    }

    /**
     * Menghapus siswa.
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $siswa = $this->querySiswaUntuk($user)
            ->whereKey($id)
            ->firstOrFail();

        $siswa->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data siswa berhasil dihapus!',
        ]);
    }
}
