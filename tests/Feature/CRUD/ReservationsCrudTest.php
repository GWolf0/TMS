<?php

namespace Tests\Feature\CRUD;

use App\Models\Organization;
use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ReservationsCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_reservations_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->employee()->create();
        $traject = Traject::factory()->create();

        $resr = Reservation::factory()->create(["user_id" => $user->id, "traject_id" => $traject->id]);

        $res = $this->get("/crud/reservations/$resr->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $resr->id]);
    }

    public function test_reservations_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $user = User::factory()->employee()->create();
        $traject = Traject::factory()->create();

        $resr1 = Reservation::factory()->create(["user_id" => $user->id, "traject_id" => $traject->id, "type" => Reservation::$TYPES[0]]);
        $resr2 = Reservation::factory()->create(["user_id" => $user->id, "traject_id" => $traject->id, "type" => Reservation::$TYPES[0]]);
        $resr3 = Reservation::factory()->create(["user_id" => $user->id, "traject_id" => $traject->id, "type" => Reservation::$TYPES[1]]);

        $res = $this->get("/crud/reservations?type=".Reservation::$TYPES[0]);

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_reservations_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->employee()->create();
        $traject = Traject::factory()->create();

        $res = $this->post("/crud/reservations", [
            'type' => Reservation::$TYPES[0],
            'status' => Reservation::$STATUSES[0],
            'date' => now(),
            'time' => "15:30",
            'traject_id' => $traject->id,
            'shift_id' => null,
            'user_id' => $user->id,
        ]);

        $res->assertSuccessful();
    }

    public function test_reservations_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->employee()->create();
        $traject = Traject::factory()->create();

        $resr = Reservation::factory()->create(["traject_id" => $traject->id, "user_id" => $user->id, "date" => now()]);

        $newValue = now()->addDay()->toDateString();

        $res = $this->patch("/crud/reservations/$resr->id", ["date" => $newValue]);

        $res->assertSuccessful();
        $res->assertJson(["date" => $newValue]);
    }

    public function test_reservations_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->employee()->create();
        $traject = Traject::factory()->create();

        $resr = Reservation::factory()->create(["traject_id" => $traject->id, "user_id" => $user->id]);

        $res = $this->delete("/crud/reservations/$resr->id");

        $res->assertSuccessful();
    }

}