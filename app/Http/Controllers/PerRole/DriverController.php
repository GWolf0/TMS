<?php

namespace App\Http\Controllers\PerRole;

use App\Http\Controllers\Controller;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class DriverController extends Controller
{
    // show driver profile
    public function showProfile(Request $req): JsonResponse{
        $model = User::findOrFail($req->user()?->id);

        if(!Gate::allows('show_driver_profile', [$model])) abort(401, "Unauthorized action");

        return response()->json($model->only(["id", "name", "email", "role", "created_at"]));
    }

    // show currently assigned shifts
    public function showCurrentShifts(Request $req): JsonResponse{
        if(!Gate::allows('show_current_shifts')) abort(401, "Unauthorized action");

        $models = User::getDriverTodaysAssignedShifts($req->user()->id);

        return response()->json($models);
    }

    // edit availability
    public function updateAvailability(Request $req): JsonResponse{
        if(!Gate::allows('update_availability')) abort(401, "Unauthorized action");
        
        $req->validate([
            "is_available" => "sometimes|boolean"
        ]);

        $req->mergeIfMissing(["is_available" => false]);

        $req->user()->update(["meta" => [
            "is_available" => $req->boolean("is_available")
        ]]);
        
        return response()->json(["message" => "Availability updated successfully"]);
    }

}
