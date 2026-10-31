<?php

use App\Http\Controllers\Api\PresensiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route untuk menerima kiriman data tap dari ESP8266
Route::post('/presensi', [PresensiController::class, 'store']);
Route::get('/presensi-list', [PresensiController::class, 'getPresensiList']);
Route::patch('/presensi/{id}/status', [PresensiController::class, 'updateStatus']);
Route::post('/presensi/scan', [PresensiController::class, 'scanHandler']);
