<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create()
    {
        return inertia('Auth/ForgotPassword');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        
        $request->validate([
            'email' => 'required|string',
        ]);

        $input = trim($request->input('email'));

        $user = User::where('email', $input)
                    ->orWhere('username', $input)
                    ->first();

        if (!$user) {
            $user = User::where('username', '@' . $input)->first();
        }

        if (!$user) {
            throw ValidationException::withMessages([
                'email' => __('Username atau email tidak ditemukan.'),
            ]);
        }

        $request->merge(['email' => $user->email]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? back()->with('status', __($status))
                    : back()->withErrors(['email' => __($status)]);
    }
}