<?php

namespace Tests\Feature\CRUD;

use App\Models\Conflict;
use App\Models\Organization;
use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class EmployeeActionsTest extends TestCase{
    use RefreshDatabase;

    public function test_employee_show_profile(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->employee()->create());

        $res = $this->get("/roles/employee/show-profile");

        $res->assertSuccessful();
    }

    public function test_employee_can_reserve_when_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->employee()->create());

        $traject = Traject::factory()->create();
        $allowedDropoffTimes = TMSSystem::getInstance()->getAvailableDropoffTimes();

        $res = $this->post("/roles/employee/reserve/".Reservation::$TYPES[0], [
            "traject_id" => $traject->id,
            "time" => $allowedDropoffTimes[0],
        ]);

        $res->assertSuccessful();
    }

    public function test_employee_cannot_reserve_when_not_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "22:00, 03:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->employee()->create());

        $traject = Traject::factory()->create();
        $allowedDropoffTimes = TMSSystem::getInstance()->getAvailableDropoffTimes();

        $res = $this->post("/roles/employee/reserve/".Reservation::$TYPES[0], [
            "traject_id" => $traject->id,
            "time" => $allowedDropoffTimes[0],
        ]);

        $res->assertUnauthorized();
    }

    public function test_employee_can_cancel_reservation_when_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->employee()->create());

        $traject = Traject::factory()->create();

        Reservation::factory()->dropoff()->create(["traject_id" => $traject->id]);

        $res = $this->post("/roles/employee/cancel-reservation/".Reservation::$TYPES[0]);

        $res->assertSuccessful();
    }

    public function test_employee_cannot_cancel_reservation_when_not_allowed(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "22:00, 03:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->employee()->create());

        $traject = Traject::factory()->create();

        Reservation::factory()->dropoff()->create(["traject_id" => $traject->id]);

        $res = $this->post("/roles/employee/cancel-reservation/".Reservation::$TYPES[0]);

        $res->assertUnauthorized();
    }

    public function test_employee_show_reservations(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $authUser = User::factory()->employee()->create();
        $this->actingAs($authUser);

        $traject = Traject::factory()->create();
        Reservation::factory(3)->create(["user_id" => $authUser->id, "traject_id" => $traject->id]);

        $res = $this->get("/roles/employee/show-reservations");

        $res->assertSuccessful();
        $res->assertJson(["current_page" => 1]);
    }

    public function test_emloyee_show_reservation(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $authUser = User::factory()->employee()->create();
        $this->actingAs($authUser);

        $traject = Traject::factory()->create();
        Reservation::factory()->create(["user_id" => $authUser->id, "traject_id" => $traject->id]);

        $res = $this->get("/roles/employee/show-reservation/1");

        $res->assertSuccessful();
        $res->assertJson(["user_id" => $authUser->id]);
    }

    public function test_emloyee_show_todays_reservations(){
        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $authUser = User::factory()->employee()->create();
        $this->actingAs($authUser);

        $traject = Traject::factory()->create();

        $dropoffReservation = Reservation::factory()->dropoff()->create(["user_id" => $authUser->id,"traject_id" => $traject->id]);
        
        $pickupReservation = Reservation::factory()->pickup()->create(["user_id" => $authUser->id,"traject_id" => $traject->id]);

        $res = $this->get("/roles/employee/show-todays-reservations");

        $res->assertSuccessful();
        $res->assertJson(fn(AssertableJson $json) => $json->has("dropoff_reservation")->has("pickup_reservation"));
    }

}