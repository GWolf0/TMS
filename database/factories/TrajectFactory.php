<?php

namespace Database\Factories;

use App\Models\Traject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Traject>
 */
class TrajectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(Traject::SAMPLE_TRAJECTS),
            'stop_areas' => null,
        ];
    }
}
