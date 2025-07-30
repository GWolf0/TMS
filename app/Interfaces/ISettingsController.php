<?php
namespace App\interfaces;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Response as InertiaResponse;


// Defines common settings methods
interface ISettingsController{

    public function sendEmailVerificationNotification(Request $req): JsonResponse;
    public function verifyEmail(Request $req): JsonResponse;
    
    public function sendPasswordResetNotification(Request $req): JsonResponse;
    public function resetPassword(Request $req): JsonResponse;
    public function passwordResetPage(Request $req): InertiaResponse;

    public function updateProfile(Request $request): JsonResponse;
    public function deleteUser(Request $request): JsonResponse;

}