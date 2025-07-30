<?php
namespace App\Helpers;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TimingHelper{

    // check if current time is between a string span
    public static function timeIsBetweenStringSpan(string|Carbon $time, string $span){
        // Split the span into start and end times
        [$startTime, $endTime] = explode(',', $span);

        // Convert to Carbon instances
        $start = Carbon::createFromTimeString(trim($startTime));
        $end = Carbon::createFromTimeString(trim($endTime));

        // Convert the input time to a Carbon instance if it's a string
        $currentTime = is_string($time) ? Carbon::createFromTimeString($time) : $time;
        
        // Handle overnight spans
        if ($end->lessThan($start)) {
            // Overnight span: e.g., "23:00, 02:00"
            return $currentTime->greaterThanOrEqualTo($start) || $currentTime->lessThanOrEqualTo($end);
        }

        // Normal span
        return $currentTime->between($start, $end);
    }

}
