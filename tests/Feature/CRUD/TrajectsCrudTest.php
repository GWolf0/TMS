<?php

namespace Tests\Feature\CRUD;

use App\Models\Organization;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class TrajectsCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_trajects_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $traj = Traject::factory()->create();

        $res = $this->get("/crud/trajects/$traj->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $traj->id]);
    }

    public function test_trajects_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $traj1 = Traject::factory()->create(["name" => "name1"]);
        $traj2 = Traject::factory()->create(["name" => "name2"]);
        $traj3 = Traject::factory()->create(["name" => "undefined"]);

        $res = $this->get("/crud/trajects?name=l_na");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_trajects_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/trajects", [
            "name" => "traj1",
            "stop_areas" => null,
        ]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "traj1"]);
    }

    public function test_trajects_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $traj = Traject::factory()->create(["name" => "oldname"]);

        $res = $this->patch("/crud/trajects/$traj->id", ["name" => "newname"]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "newname"]);
    }

    public function test_trajects_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $traj = Traject::factory()->create();

        $res = $this->delete("/crud/trajects/$traj->id");

        $res->assertSuccessful();
    }

}