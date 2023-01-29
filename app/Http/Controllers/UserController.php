<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\PasswordMail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\VerificationMail;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\PasswordUpdateRequest;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\ForgottenPasswordRequest;
use App\Http\Requests\PasswordResetRequest;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class UserController extends Controller
{

    public function register(RegisterRequest $request) {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        $validated['verification_token'] = Str::random(100);

        $user = User::create($validated);
        $url = route('account_activate', ['user' => $user->verification_token,]);

        Mail::to($user->email)->send(new VerificationMail($url, $user));

        if(!Auth::attempt($validated)) 
            return response(['message' => 'Sign Up Failed!', 'type' => 'failed'], 422);

        $user = auth()->user();
        $token = $request->user()->createToken('my_token')->plainTextToken;
        return response(
            ['message' => 'Verification Link Has Been Sent To Your Email Adress!',
            'token' => $token,
            'user' => $user]);
    }

    public function activate(User $user) {
        User::find($user['id'])->tokens()->delete();

        if ($user->email_verified_at != null)
            return redirect()->away(env("APP_FRONTEND_URL").'/activated');
        
        $user->email_verified_at = now();
        $user->save();
            
        return redirect()->away(env("APP_FRONTEND_URL").'/activated');
    }

    public function login(LoginRequest $request) {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        if(!Auth::attempt($validated)) 
            return response(['message' => 'Sign In Failed!', 'type' => 'failed'], 422);
        
        $user = auth()->user();
        $token = $request->user()->createToken('my_token')->plainTextToken;
        return response(compact('user', 'token'));
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response([]);
    }

    public function update(UserUpdateRequest $request) {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }
        
        $user = User::find($validated['id'])->first();

        if(!$user)
            return response(['message' => 'Update Failed!', 'type' => 'failed'], 422);

        if(isset($validated['name']) && $validated['name'] != "")
            $user['name'] = $validated['name'];

        if(isset($validated['email']) && $validated['email'] != "")
            $user['email'] = $validated['email'];

        $user->save();

        return response([]);
    }

    public function destroy($id) {
        if(!User::find($id)->delete())
            return response(['message' => 'Delete Failed!', 'type' => 'failed'], 422);

        return response([]);
    }

    public function updatePassword(PasswordUpdateRequest $request) {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        if(!User::find($validated['id'])->update(['password' => $validated['password']]))
            return response(['message' => 'Update Failed!', 'type' => 'failed'], 422);
        
        return response(['message' => 'Password Changed Successfully!']);
    }

    public function newPassword(ForgottenPasswordRequest $request) {
        try {
            $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if($status !== Password::RESET_LINK_SENT)
            return response(['message' => 'Password Update Failed!', 'type' => 'failed'], 422);

        return response(['message' => 'Link Has Been Sent To Your Email Address!']);
    }

    public function toNewPasswordForm($token) {
        return redirect()->away(env("APP_FRONTEND_URL")."/reset-password/".$token);
    }

    public function setNewPassword(PasswordResetRequest $request) {
        try {
            $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                'password' => $password
            ]);
 
            $user->save();

            event(new PasswordReset($user));
            }
        );

        if($status !== Password::PASSWORD_RESET)
            return response(['message' => 'Password Update Failed!', 'type' => 'failed'], 422);

        return response(['message' => 'Password Updated Successfully!']);
    }
}
