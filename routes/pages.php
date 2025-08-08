<?php

use App\Http\Controllers\Pages\DashboardPageController;
use App\Http\Controllers\Pages\LoginPageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// pages routes
// home
Route::get('/', function () {
    return redirect()->route(Auth::check() ? 'dashboard' : 'login');
})->name('home');

// login
Route::get('/login', LoginPageController::class)
    ->middleware('guest')
    ->name('login');

// dashboard
Route::get('/dashboard/{section?}', DashboardPageController::class)
    ->middleware('auth')
    ->name('dashboard');

// reset password request
Route::get('/reset-password-request', fn () => Inertia::render("ResetPasswordRequestPage"))
    ->middleware("guest")->name("reset-password-request");

// test
Route::get('/test', fn () => Inertia::render('TestPage'))->name('test');

//
Route::fallback(fn() => "Page doesn't exist!");