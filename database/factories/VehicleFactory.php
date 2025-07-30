<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'model_name' => fake()->randomElement(Vehicle::SAMPLE_MODELS_NAME),
            'capacity' => fake()->numberBetween(20, 40),
            'status' => fake()->randomElement(Vehicle::$STATUS),
        ];
    }
}
