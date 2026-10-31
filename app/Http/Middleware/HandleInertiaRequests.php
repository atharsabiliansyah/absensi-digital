<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
  public function share(Request $request): array
{
    $resetStatus = 'none';
    if ($user = $request->user()) {
        $latestReset = \Illuminate\Support\Facades\DB::table('password_reset_requests')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

        if ($latestReset) {
            $resetStatus = $latestReset->status; 
        }
    }

    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user() ? [
                'id'       => $request->user()->id,
                'name'     => $request->user()->name,
                'username' => $request->user()->username,
                'email'    => $request->user()->email,
                'nip'      => $request->user()->nip ?? '-',
                'role'     => $request->user()->role ?? 'User',
            ] : null,
        ],
        'resetStatus' => $resetStatus, 
    ]);
}
}

