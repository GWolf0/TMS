<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
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
            'type' => $type,
            'status' => Reservation::$STATUSES[0],
            'date' => $type === Reservation::$TYPES[0] ? now() : now()->addDay(),
            'time' => fake()->randomElement($type === Reservation::$TYPES[0] ? TMSSystem::getAvailableDropoffTimes() : TMSSystem::getAvailablePickupTimes()),
            'traject_id' => fake()->randomElement(Traject::all(["id"])->pluck("id")->toArray()),
            'shift_id' => null,
            'user_id' => fake()->unique()->randomElement(User::select(["id"])->where('role', User::$ROLES[1])->get()->pluck("id")->toArray()),
        ];
    }

    // dropoff reservation
    public function dropoff(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Reservation::$TYPES[0],
            'date' => now(),
            'time' => fake()->randomElement(TMSSystem::getAvailableDropoffTimes()),
        ]);
    }

    // pickup reservation
    public function pickup(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => Reservation::$TYPES[1],
            'date' => now()->addDay(),
            'time' => fake()->randomElement(TMSSystem::getAvailablePickupTimes()),
        ]);
    }

}
