<?php

namespace App\Services;

use App\Helpers\TimingHelper;
use App\Models\Conflict;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\TMSSystem;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\ErrorHandler\Debug;

class ReservationsProcessingService{

    // start reservations processing by type
    // processing grouping priority: type => traject => time
    // required factors: available vehicles, available drivers
    public static function processReservations(string $type){
        if(!in_array($type, Reservation::$TYPES)) {
            Log::debug("RPS: invalid type!");
            return;
        }

        DB::transaction(function () use ($type) {
            // Get available vehicles and drivers
            $vehicles = Vehicle::where("status", Vehicle::$STATUS[0])->get();
            $drivers = User::where("role", User::$ROLES[2])->where("meta->is_available", "true")->get();

            // Get today's reservations of given type
            // $reservations = Reservation::whereDate("created_at", Carbon::today())->where("type", $type)->get();
            $reservations = Reservation::where("type", $type)->get();
            $reservationsCount = $reservations->count();

            // Group by traject and time using custom key
            $grouped = $reservations->groupBy(function ($res) {
                return $res->time . '|' . $res->traject_id;
            });

            Log::debug("Found $reservationsCount reservations");
            Log::debug(json_encode($grouped));

            // Initialize shift number
            $shiftNumber = 1;

            // Vehicle and driver pool (copy for reuse)
            $vehicleQueue = $vehicles->values();
            $driverQueue = $drivers->values();
            $vehicleIndex = 0;
            $driverIndex = 0;

            // Start assigning
            foreach($grouped as $key => $groupReservations) {
                [$time, $trajectId] = explode('|', $key);
                $groupReservations = $groupReservations->values(); // reset keys
                $date = $groupReservations[0]->date;
                $remaining = $groupReservations->count();
                $assignedCount = 0;

                while($remaining > 0) {
                    // Get vehicle with enough capacity
                    if(!isset($vehicleQueue[$vehicleIndex])) {
                        Conflict::create([
                            "type" => Conflict::$TYPES[0], // no vehicle
                            "data" => "traject_id: $trajectId, date: $date, time: $time"
                        ]);
                        Log::error("no more vehicles");
                        break;
                    }

                    if (!isset($driverQueue[$driverIndex])) {
                        Conflict::create([
                            "type" => Conflict::$TYPES[1], // no driver
                            "data" => "traject_id: $trajectId, date: $date, time: $time"
                        ]);
                        Log::error("no more drivers");
                        break;
                    }

                    $vehicle = $vehicleQueue[$vehicleIndex];
                    $driver = $driverQueue[$driverIndex];
                    Log::debug("vehicle $vehicle->id, driver $driver->id");

                    // Create shift
                    $shift = Shift::create([
                        'number' => $shiftNumber++,
                        'type' => $type,
                        'date' => $date,
                        'time' => $time,
                        'driver_id' => $driver->id,
                        'traject_id' => $trajectId,
                        'vehicle_id' => $vehicle->id,
                    ]);

                    $capacity = $vehicle->capacity;
                    $toAssign = min($capacity, $remaining);

                    for($i = 0; $i < $toAssign; $i++) {
                        $resIndex = $assignedCount + $i;
                        $reservation = $groupReservations[$resIndex];
                        $reservation->shift_id = $shift->id;
                        $reservation->save();
                    }

                    $assignedCount += $toAssign;
                    $remaining -= $toAssign;

                    // Move to next vehicle and driver
                    $vehicleIndex++;
                    $driverIndex++;
                    Log::debug("Shift $shift->id created, vehicleIndex $vehicleIndex, driverIndex $driverIndex, assigned $assignedCount, remaining $remaining");
                }
            }

            Log::info("RPS: Completed processing reservations of type: $type");
        });
    }


    // is open for reservations (can reserve)
    public static function isOpenForReservations(): bool{
        // if in debug mode allow always
        if(config("app.debug")) return true;

        $reservationSpanString = TMSSystem::getReservationSpanString();
        
        if(empty($reservationSpanString)) return false;
        
        return TimingHelper::timeIsBetweenStringSpan(now(), $reservationSpanString);
    }

}
