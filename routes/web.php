<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiWebController;
use App\Http\Controllers\SiswaWebController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\Api\PresensiController; 
use Illuminate\Support\Facades\Route;
use Inertia\Inertia; 

Route::get('/', function () {
    return redirect()->route('login');
});

// API Public untuk Alat Hardware / RFID
Route::post('/api/presensi', [PresensiController::class, 'store']);
Route::post('/api/scan', [PresensiController::class, 'scanHandler']); 

// Halaman Web & API Internal (Harus Login)
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. Menu Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/dashboard-data', [DashboardController::class, 'getLatestData']);

    // 2. Menu Presensi (Tampilan Web + API)
    Route::get('/presensi', [PresensiWebController::class, 'index'])->name('presensi.index');
    Route::get('/api/presensi-list', [PresensiWebController::class, 'getPresensiList']);

    // 3. Menu Data Siswa (Tampilan Web + API)
    Route::get('/data-siswa', [SiswaWebController::class, 'index'])->name('data-siswa.index');
    Route::get('/api/siswa-list', [SiswaWebController::class, 'getSiswaList']);
    Route::get('/api/get-last-rfid', [SiswaWebController::class, 'getLastRfid']);
    Route::post('/api/siswa-store', [SiswaWebController::class, 'store']);
    Route::put('/api/siswa-update/{id}', [SiswaWebController::class, 'update']);
    Route::delete('/api/siswa-delete/{id}', [SiswaWebController::class, 'destroy']);

    // 4. Menu Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'export'])->name('laporan.export');

    // 5. Menu Pengaturan & Profil
    // ✅ Diubah agar memanggil file wrapper Pengaturan.tsx milikmu
    Route::get('/pengaturan', function () {
        return Inertia::render('Pengaturan');
    })->name('pengaturan.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';