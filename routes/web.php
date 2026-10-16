<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PresensiWebController;
use App\Http\Controllers\SiswaWebController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Api\PresensiController; 
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::post('/api/presensi', [PresensiController::class, 'store']);
Route::post('/api/scan', [PresensiController::class, 'scanHandler']); 

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/api/dashboard-data', [DashboardController::class, 'getLatestData']);
    Route::get('/api/presensi-list', [PresensiWebController::class, 'getPresensiList']);

    Route::get('/api/siswa-list', [SiswaWebController::class, 'getSiswaList']);
    Route::get('/api/get-last-rfid', [SiswaWebController::class, 'getLastRfid']);
    Route::post('/api/siswa-store', [SiswaWebController::class, 'store']);
    Route::put('/api/siswa-update/{id}', [SiswaWebController::class, 'update']);
    Route::delete('/api/siswa-delete/{id}', [SiswaWebController::class, 'destroy']);

    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';