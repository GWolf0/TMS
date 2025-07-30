<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_login(){
        $user = User::factory()->create();

        $response = $this->post('/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        
        $response->assertJson(['message' => 'Login successful.']);
        $this->assertAuthenticated();
    }

    public function test_users_cannot_authenticate_with_invalid_password(){
        $user = User::factory()->create();

        $this->post('/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_register(){
        $response = $this->post('/auth/register', [
            'email' => "userx@email.com",
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => User::$ROLES[1],
        ]);
        
        $response->assertJson(['message' => 'Registration successful.']);
        $this->assertAuthenticated();
    }

    public function test_users_cannot_register_with_invalid_data(){
        $response = $this->post('/auth/register', [
            'email' => "invalidemail.com",
            'password' => 'password',
        ]);

        $response->assertJson(['message' => 'Validation failed.']);
        $this->assertGuest();
    }

    public function test_users_can_logout(){
        $user = User::factory()->create();

        Auth::login($user);

        $this->post('/auth/logout');

        $this->assertGuest();
    }

}
