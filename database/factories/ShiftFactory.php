<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shift>
 */
class ShiftFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(Reservation::$TYPES);

        return [
            'number' => fake()->unique()->numberBetween(1, 1000),
            'type' => $type,
            'date' => $type === Reservation::$TYPES[0] ? now() : now()->addDay(),
            'time' => fake()->randomElement($type === Reservation::$TYPES[0] ? TMSSystem::getAvailableDropoffTimes() : TMSSystem::getAvailablePickupTimes()),
            'driver_id' => fake()->randomElement(User::where('role', User::$ROLES[2])->get()->pluck("id")->toArray()),
            'traject_id' => fake()->randomElement(Traject::all()->pluck("id")->toArray()),
            'vehicle_id' => fake()->randomElement(Vehicle::all()->pluck("id")->toArray()),
        ];
    }
}
