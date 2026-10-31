<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        $guru = User::where('role', 'guru')
            ->with('kelasDiampu:id,nama_kelas,jurusan,tipe_kelas')
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'email']);

        $kelas = Kelas::orderBy('nama_kelas')
            ->orderBy('jurusan')
            ->orderBy('tipe_kelas')
            ->get(['id', 'nama_kelas', 'jurusan', 'tipe_kelas']);

        return Inertia::render('Admin/Guru/Index', [
            'guru' => $guru,
            'kelas' => $kelas,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required', 'string', 'max:255', 'unique:users,username',
            ],
            'email' => [
                'required', 'email', 'max:255', 'unique:users,email',
            ],
            'password' => [
                'required', 'confirmed', Password::min(8),
            ],
            'kelas_ids' => ['required', 'array', 'min:1'],
            'kelas_ids.*' => ['required', 'integer', 'distinct', 'exists:kelas,id'],
        ]);

        DB::transaction(function () use ($data) {
            $user = new User();
            $user->name = $data['name'];
            $user->username = $data['username'];
            $user->email = $data['email'];
            $user->password = $data['password'];
            $user->role = 'guru';
            $user->save();

            $user->kelasDiampu()->sync($data['kelas_ids']);
        });

        return back()->with('success', 'Akun guru berhasil dibuat.');
    }

    public function update(Request $request, User $user)
    {
        abort_unless($user->role === 'guru', 404);

        $data = $request->validate([
            'kelas_ids' => ['required', 'array', 'min:1'],
            'kelas_ids.*' => [
                'required', 'integer', 'distinct', 'exists:kelas,id',
            ],
        ]);

        $user->kelasDiampu()->sync($data['kelas_ids']);

        return back()->with('success', 'Penugasan kelas berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        abort_unless($user->role === 'guru', 404);

        $user->delete();

        return back()->with('success', 'Akun guru berhasil dihapus.');
    }
}
