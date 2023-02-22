<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function register(Request $request) {
        
        Admin::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'password' => $request['password'],
        ]);
    }

    public function login(LoginRequest $request) {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        $admin = Admin::where('email', $validated['email'])->first();
        if(!$admin)
            return response(['message' => 'Sign in Failed!'], 401);

        if(!Hash::check($validated['password'], $admin->password))
            return response(['message' => 'Sign in Failed!'], 401);

        $token = bcrypt(config('auth.admin-token'));
        return response(compact('token'));
    }
}
