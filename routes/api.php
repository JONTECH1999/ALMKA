<?php

use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\DataLoggerController;
use App\Http\Controllers\AlmkaDeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Location API routes
Route::post('/location', [LocationController::class, 'store']);
Route::post('/location/save', [DataLoggerController::class, 'saveLocationData']);

// ALMKA Device proxy routes
Route::get('/almka-device/gps', [AlmkaDeviceController::class, 'gps']);
Route::get('/almka-device/camera', [AlmkaDeviceController::class, 'camera']);
Route::get('/almka-device/stream', [AlmkaDeviceController::class, 'stream']);
Route::post('/almka-device/sensor-settings', [AlmkaDeviceController::class, 'saveSensorSettings']);
Route::get('/almka-device/ip', [DataLoggerController::class, 'getDeviceIp']);

// Data logging routes for ALMKA Device
Route::prefix('logger')->group(function () {
    Route::post('/session/start', [DataLoggerController::class, 'startSession']);
    Route::post('/session/end', [DataLoggerController::class, 'endSession']);
    Route::post('/data', [DataLoggerController::class, 'logSensorData']);
    Route::get('/history', [DataLoggerController::class, 'getHistoricalData']);
    Route::get('/location-history', [DataLoggerController::class, 'getLocationHistory']);
    Route::post('/video/record', [DataLoggerController::class, 'recordVideo']);
    Route::get('/video-history', [DataLoggerController::class, 'getVideoHistory']);
    Route::put('/video/{id}', [DataLoggerController::class, 'updateVideo']);
    Route::delete('/video/{id}', [DataLoggerController::class, 'deleteVideo']);
    Route::get('/stats', [DataLoggerController::class, 'getDeviceStats']);
});

// Geocoding proxy to avoid CORS issues
Route::get('/geocode/reverse', [LocationController::class, 'reverseGeocode']);