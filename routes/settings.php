<?php

use App\Http\Controllers\Common\SettingsController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::group(["prefix" => "settings"], function () {
    // Guest routes
    Route::group(["middleware" => ["guest"]], function (){
        // send password reset notification
        Route::post('forgot-password', [SettingsController::class, 'sendPasswordResetNotification'])
            ->name('password.email');

        // reset password ui interface
        Route::get('reset-password/{token}', [SettingsController::class, 'passwordResetPage'])
            ->name('password.reset');

        // confirm reset password
        Route::post('reset-password', [SettingsController::class, 'resetPassword'])
            ->name('password.store');
    });

    // Auth routes
    Route::group(["middleware" => ["auth"]], function (){
        // Route::get('verify-email', EmailVerificationPromptController::class)
        //     ->name('verification.notice');
        // verify email
        Route::get('verify-email/{id}/{hash}', [SettingsController::class, "verifyEmail"])
            ->middleware(['signed', 'throttle:6,1'])
            ->name('verification.verify');

        // send email verification notificaton
        Route::post('email/verification-notification', [SettingsController::class, 'sendEmailVerificationNotification'])
            ->middleware('throttle:6,1')
            ->name('verification.send');

        // update profile
        Route::post('update-profile', [SettingsController::class, 'updateProfile'])->name('profile.update');
    });
    
});

