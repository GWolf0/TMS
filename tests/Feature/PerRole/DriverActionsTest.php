<?php

namespace Tests\Feature\CRUD;

use App\Models\Conflict;
use App\Models\Organization;
use App\Models\Shift;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class DriverActionsTest extends TestCase{
    use RefreshDatabase;

    public function test_driver_show_profile(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->driver()->create());

        $res = $this->get("/roles/driver/show-profile");

        $res->assertSuccessful();
    }

    public function test_driver_show_current_shifts(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $authUser = User::factory()->driver()->create();
        $this->actingAs($authUser);

        // shifts for testing
        Vehicle::factory()->create();
        Traject::factory()->create();
        Shift::factory(2)->create(["driver_id" => $authUser]);

        $res = $this->get("/roles/driver/show-current-shifts");

        $res->assertSuccessful();
        $res->assertJsonCount(2);
    }

    public function test_driver_can_update_availability_when_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->driver()->create());

        $res = $this->post("/roles/driver/update-availability", [
            "is_available" => true,
        ]);

        $res->assertSuccessful();
        $res->assertJson(fn(AssertableJson $json) => $json->has("message"));
    }

    public function test_driver_cannot_update_availability_when_not_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "22:00, 03:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->driver()->create());

        $res = $this->post("/roles/driver/update-availability", [
            "is_available" => true,
        ]);

        $res->assertUnauthorized();
    }

}