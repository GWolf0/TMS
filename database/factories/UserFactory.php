<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $rndRole = fake()->randomElement(User::$ROLES);

        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => $rndRole,
            'meta' => User::getDefaultMeta($rndRole),
            'organization_id' => $rndRole !== User::$ROLES[0] ? fake()->randomElement(Organization::all('id')->pluck('id')->toArray()) : null,
        ];
    }

    // admin user
    public function admin(): static { return $this->state(fn (array $attributes) => [
        'role' => User::$ROLES[0],
        // 'password' => "adminadmin",
        'meta' => User::getDefaultMeta(User::$ROLES[0]),
        'organization_id' => null,
    ]); }    
    // employee user
    public function employee(): static { return $this->state(fn (array $attributes) => [
        'role' => User::$ROLES[1],
        'meta' => User::getDefaultMeta(User::$ROLES[1]),
        'organization_id' => fake()->randomElement(Organization::all('id')->pluck('id')->toArray()),
    ]); }    
    // driver user
    public function driver(): static { return $this->state(fn (array $attributes) => [
        'role' => User::$ROLES[2],
        'meta' => User::getDefaultMeta(User::$ROLES[2]),
        'organization_id' => fake()->randomElement(Organization::all('id')->pluck('id')->toArray()),
    ]); }    
    
    // Indicate that the model's email address should be unverified.
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
