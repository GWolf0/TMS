<?php

namespace Tests\Feature\CRUD;

use App\Models\Organization;
use App\Models\Reservation;
use App\Models\Shift;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ShiftsCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_shifts_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $shift = Shift::factory()->create();

        $res = $this->get("/crud/shifts/$shift->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $shift->id]);
    }

    public function test_shifts_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $shift1 = Shift::factory()->create(["number" => 1]);
        $shift2 = Shift::factory()->create(["number" => 2]);
        $shift3 = Shift::factory()->create(["number" => 3]);

        $res = $this->get("/crud/shifts?number=gte_2");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_shifts_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/shifts", [
            'number' => 1,
            'type' => Reservation::$TYPES[0],
            'date' => now()->toDateString(),
            'time' => now()->toTimeString(),
            'driver_id' => null,
            'traject_id' => null,
            'vehicle_id' => null,
        ]);

        $res->assertSuccessful();
    }

    public function test_shifts_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $shift = Shift::factory()->create(["number" => 1]);

        $res = $this->patch("/crud/shifts/$shift->id", ["number" => 2]);

        $res->assertSuccessful();
        $res->assertJson(["number" => 2]);
    }

    public function test_shifts_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $shift = Shift::factory()->create();

        $res = $this->delete("/crud/shifts/$shift->id");

        $res->assertSuccessful();
    }

}