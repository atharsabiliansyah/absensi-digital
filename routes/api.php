<?php

use App\Http\Controllers\Api\PresensiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route untuk menerima kiriman data tap dari ESP8266
Route::post('/presensi', [PresensiController::class, 'store']);