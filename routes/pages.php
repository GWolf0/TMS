<?php

use App\Http\Controllers\Pages\DashboardPageController;
use App\Http\Controllers\Pages\LoginPageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// pages routes
Route::get('/', function () {
    return redirect()->route(Auth::check() ? 'dashboard' : 'login');
})->name('home');

Route::get('/login', LoginPageController::class)
    ->middleware('guest')
    ->name('login');

Route::get('/dashboard/{section?}', DashboardPageController::class)
    ->middleware('auth')
    ->name('dashboard');

Route::get('/test', fn () => Inertia::render('TestPage'))->name('test');