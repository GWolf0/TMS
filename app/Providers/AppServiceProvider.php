<?php

namespace App\Providers;

use App\Models\TMSSystem;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // make sure there at least one TMSSystem instance, and one admin user
        try {
            // Check if the database is accessible
            DB::connection()->getPdo();
    
            // Prevent running code below, if tms_system is not present
            if (!Schema::hasTable('tms_system')) return;
    
            // Ensure the TMSSystem has the initial required record
            if (!TMSSystem::exists()) TMSSystem::factory()->create();
    
            // Ensure the default admin user exists
            if (!User::where("role", User::$ROLES[0])->exists()) User::factory(1)->admin()->create();
        } catch (Exception $e) {
            // Database connection issue, prevent crash
            Log::warning("Database is not ready yet: " . $e->getMessage());
        }
    }
}
