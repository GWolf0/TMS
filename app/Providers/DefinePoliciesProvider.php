<?php

namespace App\Providers;

use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\User;
use App\Services\ReservationsProcessingService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class DefinePoliciesProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // admin policies
        Gate::define("show_admin_profile", function(?User $user, User $model){
            return !empty($user) && $user->isAdmin() && $user->id === $model->id;
        });
        Gate::define("start_reservations_processing", function(User $user){
            return $user?->isAdmin() && !ReservationsProcessingService::isOpenForReservations() && !TMSSystem::getInstance()->is_processing_shifts;
        });

        // employee policies
        Gate::define("show_employee_profile", function(?User $user, User $model){
            return !empty($user) && $user->isEmployee() && $user->id === $model->id;
        });
        Gate::define("reserve_dropoff", function(?User $user){
            if(empty($user) || !$user->isEmployee() || !ReservationsProcessingService::isOpenForReservations()) return false;

            $todaysReservations = User::getEmployeeTodaysReservations($user->id);

            return empty($todaysReservations[0]);
        });
        Gate::define("reserve_pickup", function(?User $user){
            if(empty($user) || !$user->isEmployee() || !ReservationsProcessingService::isOpenForReservations()) return false;

            $todaysReservations = User::getEmployeeTodaysReservations($user->id);

            return empty($todaysReservations[1]);
        });
        Gate::define("cancel_dropoff", function(?User $user, ?Reservation $reservation){
            return !empty($user) && $user->isEmployee() && !empty($reservation) && $user->id === $reservation->user_id && 
            ReservationsProcessingService::isOpenForReservations();
        });
        Gate::define("cancel_pickup", function(?User $user, ?Reservation $reservation){
            return !empty($user) && $user->isEmployee() && !empty($reservation) && $user->id === $reservation->user_id && 
            ReservationsProcessingService::isOpenForReservations();
        });
        Gate::define("show_reservations", function(?User $user){
            return !empty($user) && $user->isEmployee();
        });
        Gate::define("show_reservation", function(?User $user, Reservation $reservation){
            return !empty($user) && $user->isEmployee() && $user->id === $reservation->user_id;
        });
        Gate::define("show_todays_reservations", function(?User $user){
            return !empty($user) && $user->isEmployee();
        });

        // drivers policies
        Gate::define("show_driver_profile", function(?User $user, User $model){
            return !empty($user) && $user->isDriver() && $user->id === $model->id;
        });
        Gate::define("show_current_shifts", function(?User $user){
            return !empty($user) && $user->isDriver();
        });
        Gate::define("update_availability", function(?User $user){
            return !empty($user) && $user->isDriver() && ReservationsProcessingService::isOpenForReservations();
        });

    }
}
