<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SuperAdminMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (!$request->user() ||
            $request->user()->role !== 'super_admin') {
            abort(403, 'Akses hanya untuk Super Admin.');
        }

        return $next($request);
    }
}
