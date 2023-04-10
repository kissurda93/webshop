<?php

namespace App\Http\Controllers;

use App\Models\User;
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
use App\Services\UserService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;

class UserController extends Controller
{

    public function getUserData(Request $request): Response
    {
        $user = $request->user();
        $addresses = $user->addresses()->get();
        $orders =$user->orders()->get();

        return response(compact('user', 'addresses', 'orders'));
    }

    public function register(RegisterRequest $request, UserService $userService): Response
    {
        try {
            $validated = $request->validated();

            list($user, $url) = $userService->createUser($validated);
            $userService->loginUser($validated);
        } catch (ValidationException $e) {
            return response($e->errors());
        } catch (AuthenticationException $e) {
            return response($e->getMessage(), 401);
        }
        
        Mail::to($user->email)->send(new VerificationMail($url, $user));
        
        $token = $request->user()->createToken('my_token')->plainTextToken;
        $message = 'Verification Link Has Been Sent To Your Email Adress!';

        return response(compact('token', 'message'), 201);
    }

    public function activate(User $user): RedirectResponse
    {
        $user->tokens()->delete();

        if ($user->email_verified_at != null)
            return redirect()->away(config('app.front_url').'/activated');
        
        $user->email_verified_at = now();
        $user->save();
            
        return redirect()->away(config('app.front_url').'/activated');
    }

    public function login(LoginRequest $request): Response
    {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        if(!Auth::attempt($validated)) 
            return response(['message' => 'Sign In Failed!', 'type' => 'failed'], 422);
        
        $token = $request->user()->createToken('my_token')->plainTextToken;
        
        return response($token);
    }

    public function logout(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();
        return response([]);
    }

    public function update(UserUpdateRequest $request, UserService $userService): Response
    {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }
        
        $user = Auth::user();

        if(!$user)
            return response(['message' => 'Update Failed!', 'type' => 'failed'], 404);

        $userService->updateUser($user, $validated);
       
        return response("Update was successful!");
    }

    public function destroy(User $user): Response
    {
        $user->delete();

        return response("Account deleted!");
    }

    public function updatePassword(PasswordUpdateRequest $request): Response
    {
        try {
            $validated = $request->validated();
        }
        catch (ValidationException $e) {
            return response($e->errors());
        }

        $user = auth()->user();

        if(!$user)
            return response(['message' => 'Update Failed!', 'type' => 'failed'], 404);

        $user->update([
            'password' => $validated['password'],
        ]);
        
        return response('Password Changed Successfully!');
    }

    public function newPassword(ForgottenPasswordRequest $request, UserService  $userService): Response
    {
        try {
            $validated = $request->validated();
            $userService->requestNewPassword($validated);
        } catch(ValidationException $e) {
            return response($e->errors());
        } catch(AuthenticationException $e) {
            return response(['message' => $e->getMessage(), 'type' => 'failed'], 404);
        }
 
        return response('Link Has Been Sent To Your Email Address!');
    }

    public function toNewPasswordForm($token): RedirectResponse
    {
        return redirect()->away(env("APP_FRONTEND_URL")."/reset-password/".$token);
    }

    public function setNewPassword(PasswordResetRequest $request, UserService $userService): Response
    {
        try {
            $validated = $request->validated();
            $userService->setNewPassword($validated);
        } catch(ValidationException $e) {
            return response($e->errors());
        } catch(AuthenticationException $e) {
            return response(['message' => $e->getMessage(), 'type' => 'failed'], 404);
        }

        return response(['message' => 'Password Updated Successfully!']);
    }
}
