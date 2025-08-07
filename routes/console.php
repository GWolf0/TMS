<?php

use App\Jobs\ReservationsProcessingJob;
use App\Models\Reservation;
use App\Models\TMSSystem;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// TMS Instance
$tms = TMSSystem::getInstance();

// dropoff reservations
Schedule::job(new ReservationsProcessingJob(Reservation::$TYPES[0]))
->dailyAt($tms->automatic_dropoff_processing_time);

// pickup reservations
Schedule::job(new ReservationsProcessingJob(Reservation::$TYPES[1]))
    ->dailyAt($tms->automatic_pickup_processing_time);


// Artisan::command('inspire', function () {
//     $this->comment(Inspiring::quote());
// })->purpose('Display an inspiring quote');
