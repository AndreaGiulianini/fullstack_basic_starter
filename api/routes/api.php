<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HealthcheckController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Health / test
Route::get('/healthcheck/ping', [HealthcheckController::class, 'ping']);
Route::post('/identity-count', [HealthcheckController::class, 'identityCount']);

// Auth (better-auth-compatible paths, backed by Sanctum tokens)
Route::prefix('auth')->group(function () {
    Route::post('/sign-up/email', [AuthController::class, 'signUpEmail']);
    Route::post('/sign-in/email', [AuthController::class, 'signInEmail']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/get-session', [AuthController::class, 'getSession']);
        Route::post('/sign-out', [AuthController::class, 'signOut']);
    });
});

// Users
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');
