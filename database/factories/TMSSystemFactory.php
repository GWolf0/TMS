<?php

namespace Database\Factories;

use App\Models\TMSSystem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TMSSystem>
 */
class TMSSystemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organization_name' => fake()->company(),
            'organization_email' => fake()->companyEmail(),
            'organization_phonenumber' => fake()->phoneNumber(),
            'automatic_dropoff_processing_time' => TMSSystem::AUTOMATIC_DROPOFF_PROCESSING_TIME,
            'automatic_pickup_processing_time' => TMSSystem::AUTOMATIC_PICKUP_PROCESSING_TIME,
            'reservation_span' => TMSSystem::RESERVATION_SPAN,
            'allowed_dropoff_times' => TMSSystem::ALLOWED_DROPOFF_TIMES,
            'allowed_pickup_times' => TMSSystem::ALLOWED_PICKUP_TIMES,
            'is_processing_shifts' => false,
        ];
    }
}
