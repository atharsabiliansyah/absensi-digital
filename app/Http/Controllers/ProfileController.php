<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
   
    public function edit(Request $request): Response
    {
        $resetRequest = DB::table('password_reset_requests')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return Inertia::render('Pengaturan', [
            'auth' => [
                'user' => [
                    'id'       => $request->user()->id,
                    'name'     => $request->user()->name,
                    'username' => $request->user()->username,
                    'email'    => $request->user()->email,
                    'nip'      => $request->user()->nip ?? '-',
                    'role'     => $request->user()->role ?? 'User',
                ],
            ],
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => session('status'),
            'resetStatus'     => $resetRequest ? $resetRequest->status : 'none',
        ]);

    }

        public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username,'.$user->id],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $validated['username'] = ltrim($validated['username'], '@');

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->update($validated);

        return Redirect::route('pengaturan.index')->with('status', 'Profil berhasil diperbarui!');
    }

   public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    
    public function requestReset(Request $request): RedirectResponse
    {
        $user = $request->user();

        $existing = DB::table('password_reset_requests')
            ->where('user_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$existing) {
            DB::table('password_reset_requests')->insert([
                'user_id'    => $user->id,
                'user_name'  => $user->name,
                'ip_address' => $request->ip(),
                'status'     => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return back()->with('status', 'Permintaan reset kata sandi telah diajukan.');
    }

   
        public function requestResetPublic(Request $request)
    {
            $request->validate([
                'email' => ['required'],
            ]);

            $search = trim($request->email);
            $searchClean = ltrim($search, '@');

            $user = DB::table('users')
                ->where('email', $search)
                ->orWhere('username', $search)
                ->orWhere('username', '@' . $searchClean)
                ->orWhere('email', 'LIKE', '%' . $searchClean . '%')
                ->orWhere('name', 'LIKE', '%' . $searchClean . '%')
                ->first();

            if (!$user) {
                return back()->withErrors(['email' => 'Akun tidak ditemukan dalam sistem presensi.']);
            }

            
            $approvedRequest = DB::table('password_reset_requests')
                ->where('user_id', $user->id)
                ->where('status', 'approved')
                ->latest()
                ->first();

            if ($approvedRequest) {
            return Inertia::render('Auth/ResetPassword', [
                'resetUserId' => $user->id,
                'status'      => 'Permintaan disetujui Admin! Silakan buat password baru Anda.',
            ]);
}

            
            $pendingRequest = DB::table('password_reset_requests')
                ->where('user_id', $user->id)
                ->where('status', 'pending')
                ->latest()
                ->first();

            if ($pendingRequest) {
                return back()->with([
                    'status'      => 'Permintaan reset password Anda masih menunggu persetujuan Admin.',
                    'resetStatus' => 'pending',
                    'resetUserId' => $user->id,
                ]);
            }

            DB::table('password_reset_requests')->insert([
                'user_id'    => $user->id,
                'user_name'  => $user->name,
                'ip_address' => $request->ip(),
                'status'     => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return back()->with([
                'status'      => 'Permintaan reset password berhasil terkirim ke Super Admin!',
                'resetStatus' => 'pending',
                'resetUserId' => $user->id,
            ]);
        }
    public function saveNewPasswordPublic(Request $request): RedirectResponse
{
    $request->validate([
        'user_id'  => ['required'],
        'password' => ['required', 'min:8', 'confirmed'],
    ]);

    DB::table('users')
        ->where('id', $request->user_id)
        ->update([
            'password' => Hash::make($request->password),
        ]);

    DB::table('password_reset_requests')
        ->where('user_id', $request->user_id)
        ->where('status', 'approved')
        ->update([
            'status'     => 'completed',
            'updated_at' => now(),
        ]);

    return redirect('/login')->with('status', 'Password baru berhasil disimpan! Silahkan login.');
}

    /**
     * Menyetujui permintaan reset kata sandi oleh Admin dari Dashboard.
     */
    public function approveReset($id): RedirectResponse
    {
        DB::table('password_reset_requests')
            ->where('id', $id)
            ->update([
                'status'     => 'approved',
                'updated_at' => now(),
            ]);

        return back()->with('status', 'Permintaan reset kata sandi disetujui.');
    }

    /**
     * Menolak permintaan reset kata sandi oleh Admin dari Dashboard.
     */
    public function rejectReset($id): RedirectResponse
    {
        DB::table('password_reset_requests')
            ->where('id', $id)
            ->update([
                'status'     => 'rejected',
                'updated_at' => now(),
            ]);

        return back()->with('status', 'Permintaan reset kata sandi ditolak.');
    }

    /**
     * Menyimpan kata sandi baru dari user di dalam dashboard/pengaturan.
     */
    public function saveNewPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        DB::table('password_reset_requests')
            ->where('user_id', $request->user()->id)
            ->where('status', 'approved')
            ->update([
                'status'     => 'completed',
                'updated_at' => now(),
            ]);

        return back()->with('status', 'Kata sandi baru berhasil disimpan dan diaktifkan!');
    }
}