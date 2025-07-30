<?php

namespace Tests\Feature\CRUD;

use App\Models\TMSSystem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class UsersCrudTest extends TestCase{
    use RefreshDatabase;

    public function test_users_find(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->create();

        $res = $this->get("/crud/users/$user->id");

        $res->assertSuccessful();
        $res->assertJson(["id" => $user->id]);
    }

    public function test_users_index(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());
        
        $user1 = User::factory()->create(["name" => "name1"]);
        $user2 = User::factory()->create(["name" => "name2"]);
        $user3 = User::factory()->create(["name" => "undefined"]);

        $res = $this->get("/crud/users?name=l_na");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_users_store(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/crud/users", [
            "name" => "user1",
            "email" => "user1@email.com",
            "password" => "password",
            "role" => User::$ROLES[1],
            "meta" => User::getDefaultMeta(User::$ROLES[1]),
            "organization_id" => null,
        ]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "user1", "meta" => null]);
    }

    public function test_users_update(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->create(["name" => "oldname"]);

        $res = $this->patch("/crud/users/$user->id", ["name" => "newname"]);

        $res->assertSuccessful();
        $res->assertJson(["name" => "newname"]);
    }

    public function test_users_destroy(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();
        
        $this->actingAs(User::factory()->admin()->create());

        $user = User::factory()->create();

        $res = $this->delete("/crud/users/$user->id");

        $res->assertSuccessful();
    }

}