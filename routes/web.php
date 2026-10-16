<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiWebController;
use App\Http\Controllers\SiswaWebController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\PresensiController; // Controller API untuk ESP8266 / Tap RFID
use Illuminate\Support\Facades\Route;

// 1. Mengarahkan halaman utama (/) langsung ke halaman Login
Route::get('/', function () {
    return redirect()->route('login');
});

// 2. Route Public API (Dapat diakses oleh Alat ESP8266 / PowerShell tanpa login)
Route::post('/api/presensi', [PresensiController::class, 'store']);

// 3. Route Web yang Wajib Login
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Hubungkan ke DashboardController
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Route API Dashboard & Presensi List
    Route::get('/api/dashboard-data', [DashboardController::class, 'getLatestData']);
    Route::get('/api/presensi-list', [PresensiWebController::class, 'getPresensiList']);

    // Route API Data Siswa & RFID Management
    Route::get('/api/siswa-list', [SiswaWebController::class, 'getSiswaList']);
    Route::get('/api/get-last-rfid', [SiswaWebController::class, 'getLastRfid']);
    Route::post('/api/siswa-store', [SiswaWebController::class, 'store']);
    Route::put('/api/siswa-update/{id}', [SiswaWebController::class, 'update']);
    Route::delete('/api/siswa-delete/{id}', [SiswaWebController::class, 'destroy']);

    // Manajemen Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';