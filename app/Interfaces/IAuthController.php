<?php
namespace App\Interfaces;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;

// Defines common auth methods
interface IAuthController{

    public function login(Request $req): JsonResponse | RedirectResponse;
    public function register(Request $req): JsonResponse | RedirectResponse;
    public function logout(Request $req): JsonResponse | RedirectResponse;
    
    public function me(Request $request): JsonResponse;

}