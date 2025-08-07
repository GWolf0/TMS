<?php

namespace App\Http\Controllers\PerRole;

use App\Http\Controllers\Controller;
use App\Http\Controllers\CRUD\ReservationController;
use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    // show employee profile
    public function showProfile(Request $req): JsonResponse{
        $model = User::findOrFail($req->user()?->id);
        
        if(!Gate::allows('show_employee_profile', [$model])) abort(401, "Unauthorized action");

        return response()->json($model->only(["id", "name", "email", "role", "created_at"]));
    }

    // reserve
    public function reserve(Request $req, string $type): JsonResponse{
        if(!in_array($type, Reservation::$TYPES)) abort(403, "Unauthorized action");

        if($type === Reservation::$TYPES[0] && !Gate::allows('reserve_dropoff')) abort(401, "Unauthorized action");
        else if($type === Reservation::$TYPES[1] && !Gate::allows('reserve_pickup')) abort(401, "Unauthorized action");

        $allowedDropoffTimes = $type === Reservation::$TYPES[0] ? 
            TMSSystem::getInstance()->getAvailableDropoffTimes() :
            TMSSystem::getInstance()->getAvailablePickupTimes();

        $req->validate([
            "traject_id" => "required",
            "time" => ["required", Rule::in($allowedDropoffTimes)],
        ]);

        $req->merge([
            'type' => $type,
            'status' => Reservation::$STATUSES[0],
            'date' => $type === Reservation::$TYPES[0] ? now() : now()->addDay(),
            'shift_id' => null,
            'user_id' => $req->user()->id,
        ]);

        $model = Reservation::create($req->only(( new Reservation() )->getFillable()));
        
        return response()->json(["message" => "Reservation ($type) created successfully", "data" => $model]);
    }

    // cancel reservation
    public function cancelReservation(Request $req, string $type): JsonResponse{
        if(!in_array($type, Reservation::$TYPES)) abort(401, "Unauthorized action");

        $model = Reservation::whereDate('created_at', now())->where("type", $type)->first();
        
        if($type === Reservation::$TYPES[0] && !Gate::allows('cancel_dropoff', [$model])) abort(401, "Unauthorized action");
        else if(!Gate::allows('cancel_pickup', [$model])) abort(401, "Unauthorized action");

        $model->delete();

        return response()->json(["message" => "Reservation ($type) canceled successufully"]);
    }

    // show reservations history
    public function showReservations(Request $req): JsonResponse{
        if(!Gate::allows('show_reservations')) abort(401, "Unauthorized action");

        $models = Reservation::where("user_id", $req->user()->id)->paginate();

        return response()->json($models);
    }

    // show individual reservation details
    public function showReservation(Request $req, string $id): JsonResponse{
        $model = Reservation::findOrFail($id);
        
        if(!Gate::allows('show_reservation', [$model])) abort(401, "Unauthorized action");

        return response()->json($model);
    }
    
    // show todays reservations
    public function showTodaysReservations(Request $req): JsonResponse{
        if(!Gate::allows('show_todays_reservations')) abort(401, "Unauthorized action");

        $models = User::getEmployeeTodaysReservations($req->user()->id);

        return response()->json(["dropoff_reservation" => $models[0], "pickup_reservation" => $models[1]]);
    }

}
