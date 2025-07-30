<?php

namespace Tests\Feature;

use App\Models\TMSSystem;
use App\Models\Traject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PagesTest extends TestCase{
    use RefreshDatabase;

    public function test_login_page_when_not_auth_when_hitting_home(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->get("/")->assertRedirect("/login");
    }

    public function test_dashboard_page_when_auth_when_hitting_home(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->create());

        $this->get("/")->assertRedirect("/dashboard");
    }

    public function test_successfull_login_page_when_not_auth(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->withoutVite();
        $this->get("/login")->assertInertia(fn (AssertableInertia $page) => $page->component("LoginPage"));
    }

    public function test_failed_login_page_when_auth(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->admin()->create());

        $this->withoutVite();
        $this->get("/login")->assertRedirect("/dashboard");
    }

    public function test_successfull_dashboard_page_when_auth(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->actingAs(User::factory()->admin()->create());

        $this->withoutVite();
        $this->get("/dashboard")->assertInertia(fn (AssertableInertia $page) => $page->component("DashboardPage"));
    }

    public function test_failed_dashboard_page_when_not_auth(){
        $sys = TMSSystem::factory()->create();
        TMSSystem::invalidateInstance();

        $this->withoutVite();
        $this->get("/dashboard")->assertRedirect("/login");
    }

}