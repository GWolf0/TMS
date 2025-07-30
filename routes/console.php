<?php

use App\Jobs\ReservationsProcessingJob;
use App\Models\Reservation;
use App\Models\TMSSystem;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// TMS Instance
$tms = TMSSystem::getInstance();

// Automatic dropoff reservations processing schedule
Schedule::call(fn () => ReservationsProcessingJob::dispatch(Reservation::$TYPES[0]))
    ->dailyAt($tms->automatic_dropoff_processing_time);

// Automatic pickup reservations processing schedule
Schedule::call(fn () => ReservationsProcessingJob::dispatch(Reservation::$TYPES[1]))
    ->dailyAt($tms->automatic_pickup_processing_time);


// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote');
