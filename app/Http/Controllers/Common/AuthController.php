<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Interfaces\IAuthController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class AuthController extends Controller implements IAuthController{

    // login
    public function login(Request $request): JsonResponse | RedirectResponse{
        $credentials = $request->only('email', 'password');

        $validator = Validator::make($credentials, [
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Invalid input.',
                'errors' => $validator->errors()
            ], 422);
        }

        if(!Auth::attempt($credentials, $request->has("remember_me"))) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        $request->session()->regenerate();

        return redirect()->route("dashboard");

        // return response()->json([
        //     'message' => 'Login successful.',
        //     'user' => Auth::user()
        // ]);
    }

    // register
    public function register(Request $request): JsonResponse | RedirectResponse{
        $data = $request->only('email', 'password', 'password_confirmation', 'role');

        $validator = Validator::make($data, [
            // 'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:6'],
            'role' => ['required', Rule::in(User::$ROLES)],
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => "New User",
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'organization_id' => null,
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user
        ], 201);
    }

    // logout
    public function logout(Request $request): JsonResponse | RedirectResponse{
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route("login");

        // return response()->json([
        //     'message' => 'Logged out successfully.'
        // ]);
    }

    // auth user
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->only(User::$PROFILE_SHOWABLE_FIELDS));
    }

}
