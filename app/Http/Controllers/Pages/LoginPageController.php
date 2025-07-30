<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoginPageController extends Controller{
    
    // default
    public function __invoke(Request $req){
        return Inertia::render("LoginPage");
    }

}
