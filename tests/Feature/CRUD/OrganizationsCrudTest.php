<?php

namespace Tests\Feature\CRUD;

use App\Models\Organization;
use App\Models\TMSSystem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class OrganizationsCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_organizations_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $org = Organization::factory()->create();

        $res = $this->get("/crud/organizations/$org->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $org->id]);
    }

    public function test_organizations_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $org1 = Organization::factory()->create(["name" => "name1"]);
        $org2 = Organization::factory()->create(["name" => "name2"]);
        $org3 = Organization::factory()->create(["name" => "undefined"]);

        $res = $this->get("/crud/organizations?name=l_na");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_organizations_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/organizations", [
            "name" => "org1",
            "email" => "org1@email.com",
            "phonenumber" => "xx-xx-xx",
            "contract_end_date" => now()->addYear(),
        ]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "org1"]);
    }

    public function test_organizations_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $org = Organization::factory()->create(["name" => "oldname"]);

        $res = $this->patch("/crud/organizations/$org->id", ["name" => "newname"]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "newname"]);
    }

    public function test_organizations_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $org = Organization::factory()->create();

        $res = $this->delete("/crud/organizations/$org->id");

        $res->assertSuccessful();
    }

}