<?php

use App\Http\Controllers\MiscController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "misc"], function() {
    Route::get("fk-labels/{table_name}", [MiscController::class, "getFKLabels"]);
    Route::get("consts", [MiscController::class, "getConsts"]);
});
