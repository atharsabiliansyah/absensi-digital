<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiWebController;
use App\Http\Controllers\SiswaWebController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\Api\PresensiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\GuruController;
use App\Http\Middleware\SuperAdminMiddleware;

Route::get('/', function () {
    return redirect()->route('login');
});

// API Public untuk Alat Hardware / RFID
Route::post('/api/presensi', [PresensiController::class, 'store']);
Route::post('/api/scan', [PresensiController::class, 'scanHandler']);

Route::post('/password-reset/save-public', [ProfileController::class, 'saveNewPasswordPublic'])->name('password.save.public');
Route::post('/password-reset/request-public', [ProfileController::class, 'requestResetPublic'])->name('password.request.public');
// Halaman Web & API Internal (Harus Login)
Route::middleware(['auth', 'verified'])->group(function () {

    //  Menu Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/dashboard-data', [DashboardController::class, 'getLatestData']);

    //  Menu Presensi (Tampilan Web + API)
    Route::get('/presensi', [PresensiWebController::class, 'index'])->name('presensi.index');
    Route::get('/api/presensi-list', [PresensiWebController::class, 'getPresensiList']);
    Route::patch('/api/presensi/{id}/status', [PresensiWebController::class, 'updateStatus']);

    //  Menu Data Siswa (Tampilan Web + API)
    Route::get('/data-siswa', [SiswaWebController::class, 'index'])->name('data-siswa.index');
    Route::get('/api/siswa-list', [SiswaWebController::class, 'getSiswaList']);
    Route::get('/api/get-last-rfid', [SiswaWebController::class, 'getLastRfid']);
    Route::post('/api/siswa-store', [SiswaWebController::class, 'store']);
    Route::put('/api/siswa-update/{id}', [SiswaWebController::class, 'update']);
    Route::delete('/api/siswa-delete/{id}', [SiswaWebController::class, 'destroy']);

    //  Menu Laporan
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'export'])->name('laporan.export');


    // Menu Pengaturan & Profil
    Route::get('/pengaturan', [ProfileController::class, 'edit'])->name('pengaturan.index');
    Route::patch('/pengaturan', [ProfileController::class, 'update'])->name('profile.update');

    Route::post('/password-reset/request', [ProfileController::class, 'requestReset'])->name('password.request.internal');
    Route::post('/password-reset/approve/{id}', [ProfileController::class, 'approveReset'])->name('password.approve');
    Route::post('/password-reset/reject/{id}', [ProfileController::class, 'rejectReset'])->name('password.reject');
    Route::post('/password-reset/save', [ProfileController::class, 'saveNewPassword'])->name('password.save');
});

Route::middleware(['auth', SuperAdminMiddleware::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/guru', [GuruController::class, 'index'])
            ->name('guru.index');

        Route::post('/guru', [GuruController::class, 'store'])
            ->name('guru.store');

        Route::put('/guru/{user}', [GuruController::class, 'update'])
            ->name('guru.update');

        Route::delete('/guru/{user}', [GuruController::class, 'destroy'])
            ->name('guru.destroy');
    });
require __DIR__.'/auth.php';
