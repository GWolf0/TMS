<?php

use App\Http\Controllers\PerRole\AdminController;
use App\Http\Controllers\PerRole\DriverController;
use App\Http\Controllers\PerRole\EmployeeController;
use Illuminate\Support\Facades\Route;

// routes per roles
Route::group(["middleware" => ["auth"], "prefix" => "roles"], function (){
    // admin
    Route::group(["prefix" => "admin"], function (){
        Route::get("show-profile", [AdminController::class, "showProfile"]);
        Route::post("start-reservations-processing/{type}", [AdminController::class, "startReservationsProcessing"]);
    });

    // employee
    Route::group(["prefix" => "employee"], function (){
        Route::get("show-profile", [EmployeeController::class, "showProfile"]);
        Route::post("reserve/{type}", [EmployeeController::class, "reserve"]);
        Route::post("cancel-reservation/{type}", [EmployeeController::class, "cancelReservation"]);
        Route::get("show-reservations", [EmployeeController::class, "showReservations"]);
        Route::get("show-reservation/{id}", [EmployeeController::class, "showReservation"]);
        Route::get("show-todays-reservations", [EmployeeController::class, "showTodaysReservations"]);
    });

    // driver
    Route::group(["prefix" => "driver"], function (){
        Route::get("show-profile", [DriverController::class, "showProfile"]);
        Route::get("show-current-shifts", [DriverController::class, "showCurrentShifts"]);
        Route::post("update-availability", [DriverController::class, "updateAvailability"]);
    });
});