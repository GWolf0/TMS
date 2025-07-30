<?php

namespace Tests\Feature\CRUD;

use App\Jobs\ReservationsProcessingJob;
use App\Models\Conflict;
use App\Models\Organization;
use App\Models\Reservation;
use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use App\Services\ReservationsProcessingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Queue;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AdminActionsTest extends TestCase{
    use RefreshDatabase;

    public function test_admin_show_profile(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $authUser = User::factory()->admin()->create();
        $this->actingAs($authUser);

        $res = $this->get("/roles/admin/show-profile");

        $res->assertSuccessful();
        $res->assertJson(["id" => $authUser->id, "name" => $authUser->name, "email" => $authUser->email, "role" => $authUser->role]);
    }

    public function test_admin_can_start_reservations_processing_when_allowed(){
        Queue::fake();

        $sys = TMSSystem::factory()->create(["reservation_span" => "22:00, 03:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/roles/admin/start-reservations-processing/".Reservation::$TYPES[0]);
        
        $res->assertSuccessful();
        $res->assertJson(fn(AssertableJson $json) => $json->has("message")->etc());

        // Assert the job was dispatched
        Queue::assertPushed(ReservationsProcessingJob::class, function ($job) {
            return $job->getType() === Reservation::$TYPES[0];
        });
    }

    public function test_admin_cannot_start_reservations_processing_when_not_allowed(){
        Queue::fake();

        $sys = TMSSystem::factory()->create(["reservation_span" => "08:00, 22:00"]);
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->admin()->create());

        $res = $this->post("/roles/admin/start-reservations-processing/".Reservation::$TYPES[0]);
        
        $res->assertUnauthorized();

        // Assert the job was not dispatched
        Queue::assertNotPushed(ReservationsProcessingJob::class);
    }

}