<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Mengarahkan halaman utama langsung ke Dashboard
Route::get('/', function () {
    return Inertia::render('Dashboard');
});

// Jika Anda ingin rute /dashboard tetap bisa diakses juga
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// Manajemen Profil (opsional, jika fitur akun digunakan)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';