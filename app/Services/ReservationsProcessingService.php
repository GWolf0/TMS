<?php

namespace App\Services;

use App\Helpers\TimingHelper;
use App\Models\Reservation;
use App\Models\TMSSystem;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReservationsProcessingService{

    // start reservations processing by type
    public static function processReservations(string $type){
        if(!in_array($type, Reservation::$TYPES)) return;


    }

    // is open for reservations (can reserve)
    public static function isOpenForReservations(): bool{
        $reservationSpanString = TMSSystem::getReservationSpanString();
        
        if(empty($reservationSpanString)) return false;
        
        return TimingHelper::timeIsBetweenStringSpan(now(), $reservationSpanString);
    }

}
