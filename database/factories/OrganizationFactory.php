<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(Organization::SAMPLE_NAMES),
            'email' => fake()->unique()->companyEmail(),
            'phonenumber' => fake()->phoneNumber(),
            'contract_end_date' => now()->addYears(fake()->numberBetween(1, 3)),
        ];
    }
}
