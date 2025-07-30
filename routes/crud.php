<?php

use App\Http\Controllers\CRUD\ConflictController;
use App\Http\Controllers\CRUD\OrganizationController;
use App\Http\Controllers\CRUD\ReservationController;
use App\Http\Controllers\CRUD\ShiftController;
use App\Http\Controllers\CRUD\TMSSystemController;
use App\Http\Controllers\CRUD\TrajectController;
use App\Http\Controllers\CRUD\UserController;
use App\Http\Controllers\CRUD\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

// routes for models crud ops
Route::group(["middleware" => ["auth"], "prefix" => "crud"], function (){
    Route::apiResource("users", UserController::class);
    Route::apiResource("organizations", OrganizationController::class);
    Route::apiResource("vehicles", VehicleController::class);
    Route::apiResource("trajects", TrajectController::class);
    Route::apiResource("reservations", ReservationController::class);
    Route::apiResource("shifts", ShiftController::class);
    Route::apiResource("conflicts", ConflictController::class);
    Route::apiResource("tms_system", TMSSystemController::class);
});
