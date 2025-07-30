<?php

namespace Tests\Feature\CRUD;

use App\Models\Organization;
use App\Models\TMSSystem;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class VehiclesCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_vehicles_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $veh = Vehicle::factory()->create();

        $res = $this->get("/crud/vehicles/$veh->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $veh->id]);
    }

    public function test_vehicles_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $veh1 = Vehicle::factory()->create(["model_name" => "name1"]);
        $veh2 = Vehicle::factory()->create(["model_name" => "name2"]);
        $veh3 = Vehicle::factory()->create(["model_name" => "undefined"]);

        $res = $this->get("/crud/vehicles?model_name=l_na");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_vehicles_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/vehicles", [
            "model_name" => "veh1",
            "capacity" => 30,
            "status" => Vehicle::$STATUS[0],
        ]);

        $res->assertSuccessful();
        $res->assertJson(["model_name" => "veh1"]);
    }

    public function test_vehicles_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $veh = Vehicle::factory()->create(["model_name" => "oldname"]);

        $res = $this->patch("/crud/vehicles/$veh->id", ["model_name" => "newname"]);

        $res->assertSuccessful();
        $res->assertJson(["model_name" => "newname"]);
    }

    public function test_vehicles_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $veh = Vehicle::factory()->create();

        $res = $this->delete("/crud/vehicles/$veh->id");

        $res->assertSuccessful();
    }

}