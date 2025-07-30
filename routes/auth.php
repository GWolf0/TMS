<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Common\AuthController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "auth"], function (){
    Route::middleware('guest')->group(function () {
        // register
        Route::post('register', [AuthController::class, 'register'])->name('auth.register');
        // login
        Route::post('login', [AuthController::class, 'login'])->name('auth.login');
    });
    
    Route::middleware('auth')->group(function () {
        // logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('logout');
    });
});
