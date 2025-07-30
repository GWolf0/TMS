<?php

namespace Tests\Feature\CRUD;

use App\Models\Conflict;
use App\Models\Organization;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ConflictCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_conflicts_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $conf = Conflict::factory()->create();

        $res = $this->get("/crud/conflicts/$conf->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $conf->id]);
    }

    public function test_conflicts_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $conf1 = Conflict::factory()->create(["data" => "some data"]);
        $conf2 = Conflict::factory()->create(["data" => null]);
        $conf3 = Conflict::factory()->create(["data" => null]);

        $res = $this->get("/crud/conflicts?data=l_so");

        $res->assertSuccessful();
        $res->assertJsonCount(1);
    }

    public function test_conflicts_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/conflicts", [
            "type" => Conflict::$TYPES[0],
            "data" => null,
        ]);

        $res->assertSuccessful();
        $res->assertJson(["type" => Conflict::$TYPES[0]]);
    }

    public function test_conflicts_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $conf = Conflict::factory()->create(["data" => "some data"]);

        $res = $this->patch("/crud/conflicts/$conf->id", ["data" => "new data"]);

        $res->assertSuccessful();
        $res->assertJson(["data" => "new data"]);
    }

    public function test_conflicts_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $conf = Conflict::factory()->create();

        $res = $this->delete("/crud/conflicts/$conf->id");

        $res->assertSuccessful();
    }

}