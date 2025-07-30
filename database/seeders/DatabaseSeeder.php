<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use App\Models\Vehicle;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // tms system
        TMSSystem::factory(1)->create();

        // trajects
        Traject::factory(8)->create();

        // organizations
        Organization::factory(2)->create();

        // users
        // one admin
        User::factory(1)->admin()->create();
        // employees
        User::factory(70)->employee()->create();
        // drivers
        User::factory(12)->driver()->create();

        // vehicles
        Vehicle::factory(10)->create();
        
        // reservations
        Reservation::factory(50)->pickup()->create();
        Reservation::factory(50)->dropoff()->create();
    }
}
