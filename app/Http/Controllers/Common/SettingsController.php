<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Interfaces\ISettingsController;
use Inertia\Response as InertiaResponse;

class SettingsController extends Controller implements ISettingsController{
    const RESET_PWD_PAGE_NAME = "ResetPasswordPage";

    // send email verification notification
    public function sendEmailVerificationNotification(Request $request): JsonResponse{
        if($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification email sent.']);
    }

    // verify email
    public function verifyEmail(Request $request): JsonResponse{
        $userId = $request->route('id');
        $user = User::findOrFail($userId);

        // Check if the link is valid (checked with route middleware)
        // if (! URL::hasValidSignature($request)) {
        //     return response()->json(['message' => 'Invalid or expired verification link.'], 403);
        // }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 400);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json(['message' => 'Email verified successfully.']);
    }

    // send password reset notification
    public function sendPasswordResetNotification(Request $request): JsonResponse
    {
        $validator = Validator::make($request->only('email'), [
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::sendResetLink($request->only('email'));

        return response()->json([
            'message' => __($status)
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->only('token', 'email', 'password', 'password_confirmation');

        $validator = Validator::make($data, [
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:6'],
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $status = Password::reset($data, function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->save();

            event(new PasswordReset($user));
        });

        return response()->json([
            'message' => __($status)
        ], $status === Password::PASSWORD_RESET ? 200 : 400);
    }

    // password reset page
    public function passwordResetPage(Request $req): InertiaResponse{
        return Inertia::render(static::RESET_PWD_PAGE_NAME);
    }

    // update profile
    public function updateProfile(Request $request): JsonResponse{
        $user = $request->user();

        $data = $request->only(array_keys(User::$PROFILE_UPDATEABLE_FIELDS));

        $validator = Validator::make($data, User::$PROFILE_UPDATEABLE_FIELDS);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user
        ]);
    }

    // delete user
    public function deleteUser(Request $request): JsonResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(["message" => "User deleted successfully"]);
    }

}
