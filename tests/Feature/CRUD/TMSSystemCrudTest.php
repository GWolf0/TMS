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

class TMSSystemCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_tmssystem_find(){
        $this->actingAs(User::factory()->admin()->create());

        $sys = TMSSystem::factory()->create(["organization_name" => "org1"]);
        TMSSystem::invalidateInstance();

        $res = $this->get("/crud/tms_system/1");

        $res->assertSuccessful();
    }

    public function test_tmssystem_update(){
        $this->actingAs(User::factory()->admin()->create());

        $sys = TMSSystem::factory()->create(["organization_name" => "org1"]);
        TMSSystem::invalidateInstance();

        $res = $this->patch("/crud/tms_system/$sys->id", ["organization_name" => "org2"]);

        $res->assertSuccessful();
        $res->assertJson(["organization_name" => "org2"]);
    }

}