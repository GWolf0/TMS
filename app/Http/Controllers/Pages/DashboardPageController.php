<?php

namespace App\Http\Controllers\Pages;

use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConflictResource;
use App\Http\Resources\OrganizationResource;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\ShiftResource;
use App\Http\Resources\TMSSystemResource;
use App\Http\Resources\TrajectResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VehicleResource;
use App\Models\Conflict;
use App\Models\Organization;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;


class DashboardPageController extends Controller{
    
    // default
    public function __invoke(Request $req): InertiaResponse{
        $user = $req->user();
        
        if($user->isAdmin()) return $this->adminDB($req);
        if($user->isEmployee()) return $this->employeeDB($req);
        if($user->isDriver()) return $this->driverDB($req);

        return Inertia::render("LoginPage");
    }

    // admin dashboard
    private function adminDB(Request $req): InertiaResponse{
        $section = $this->getSection($req, "users");
        $query = $req->query();

        // get query builder based on section
        $queryBuilder = match($section) {
            "users" => User::query(),
            "organizations" => Organization::query(),
            "vehicles" => Vehicle::query(),
            "trajects" => Traject::query(),
            "reservations" => Reservation::query(),
            "shifts" => Shift::query(),
            "conflicts" => Conflict::query(),
            default => null
        };

        // slightly different data based on section
        if($section === "tms_system"){ // single record data
            $data = [
                "data" => new TMSSystemResource(TMSSystem::getInstance()),
            ];
        }else if(!empty($queryBuilder)){ // paginated/filtered data
            $data = [
                "paginatedData" => $this->resourceWrapped($section, QueryHelper::searchFiltered($queryBuilder, $query)),
            ];
        }else if($section === "profile"){ // send profile info
            $data = [
                "profile" => User::getUserProfile($req->user()->id),
            ];
        }else if($section === "actions"){
            $data = [
                "authorizations" => [
                    "start_reservations_processing" => Gate::allows('start_reservations_processing'),
                ],
                "is_processing_shifts" => TMSSystem::getInstance()->is_processing_shifts,
            ];
        }else{
            abort(404, "Invalid dashboard section.");
        }

        return Inertia::render("DashboardPage", ["data" => $data]);
    }

    // employee dashboard
    private function employeeDB(Request $req): InertiaResponse{
        $section = $this->getSection($req, "reserve");
        $query = $req->query();

        if($section === "reserve"){ // send today's dropoff and pickup reservations, and some authorizations
            $todaysReservations = User::getEmployeeTodaysReservations($req->user()->id);
            $data = [
                "todaysReservations" => $todaysReservations,
                "authorizations" => [
                    "reserve_dropoff" => Gate::allows("reserve_dropoff", [$req->user()]),
                    "reserve_pickup" => Gate::allows("reserve_pickup", [$req->user()]),
                    "cancel_dropoff" => Gate::allows("cancel_dropoff", [$todaysReservations[0]?->resource]),
                    "cancel_pickup" => Gate::allows("cancel_pickup", [$todaysReservations[1]?->resource]),
                ],
                "allowedTimes" => [
                    "dropoff" => TMSSystem::getInstance()->getAvailableDropoffTimes(),
                    "pickup" => TMSSystem::getInstance()->getAvailablePickupTimes(),
                ],
                "trajects" => new TrajectResource(Traject::select(["id", "name as label"])->get()),
            ];
        }else if($section === "reservations"){ // send paginated reservations
            $data = [
                "paginatedReservations" => ReservationResource::collection(Reservation::with(Reservation::$WITH)->where("user_id", $req->user()->id)->orderBy("updated_at", "desc")->paginate()),
            ];
        }else if($section === "profile"){ // send profile info
            $data = [
                "profile" => User::getUserProfile($req->user()->id),
            ];
        }else{
            abort(404, "Invalid dashboard section.");
        }

        return Inertia::render("DashboardPage", ["data" => $data]);
    }

    // driver dashboard
    private function driverDB(Request $req): InertiaResponse{
        $section = $this->getSection($req, "shifts");
        $query = $req->query();

        if($section === "shifts"){ // send today's assigned shifts if any, also availability, and authorizations
            $data = [
                "assignedShifts" => User::getDriverTodaysAssignedShifts($req->user()->id),
                "availability" => User::getDriverAvailabilityStatus($req->user()->id),
                "authorizations" => [
                    "update_availability" => Gate::allows("update_availability", [$req->user()])
                ]
            ];
        }else if($section === "profile"){ // send profile info
            $data = [
                "profile" => User::getUserProfile($req->user()->id),
            ];
        }else{
            abort(404, "Invalid dashboard section.");
        }

        return Inertia::render("DashboardPage", ["data" => $data]);
    }

    // Get section helper
    private function getSection(Request $req, string $default){
        return $req->segment(2, $default);
    }

    // Resource wrapped (wrap paginated data with resource collcection)
    private function resourceWrapped(string $tableName, $data) {
        return match($tableName) {
            "users" => UserResource::collection($data),
            "organizations" => OrganizationResource::collection($data),
            "vehicles" => VehicleResource::collection($data),
            "trajects" => TrajectResource::collection($data),
            "reservations" => ReservationResource::collection($data),
            "shifts" => ShiftResource::collection($data),
            "conflicts" => ConflictResource::collection($data),
            default => null
        };
    }

}
