<?php

namespace App\Http\Controllers\PerRole;

use App\Http\Controllers\Controller;
use App\Jobs\ReservationsProcessingJob;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Symfony\Component\ErrorHandler\Debug;

class AdminController extends Controller
{
    // show admin profile
    public function showProfile(Request $req): JsonResponse{
        $model = User::findOrFail($req->user()?->id);
        
        if(!Gate::allows('show_admin_profile', [$model])) abort(401, "Unauthorized action");

        return response()->json($model->only(["id", "name", "email", "role", "created_at"]));
    }

    // start reservations processing
    public function startReservationsProcessing(Request $req, string $type): JsonResponse{
        if(!Gate::allows('start_reservations_processing')) abort(401, "Unauthorized action");

        $req->validate(["type" => [Rule::in(Reservation::$TYPES)]]);

        dispatch(new ReservationsProcessingJob($type));

        return response()->json(["message" => "Reservations ($type) processing started"]);
    }

}
