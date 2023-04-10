<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\AuthenticationException;

class UserService
{
  public function createUser(array $request): array
  {
    $userData = [
      'email' => $request['email'],
      'name' => $request['name'],
      'password' => $request['password'],
      'verification_token' => Str::random(100)
    ];

    $addressData = [
      'country' => $request['country'],
      'state' => isset($request['state']) ? $request['state'] : null,
      'city' => isset($request['city']) ? $request['city'] : null,
      'address' => $request['address'],
      'default' => true
    ];

    $user = User::create($userData);
    $user->addresses()->create($addressData);
    $verificationUrl = route('account-activate', ['user' => $user->verification_token,]);

    return [$user, $verificationUrl];
  }

  public function loginUser(array $request)
  {
    $credentials = [
      'email' => $request['email'],
      'password' => $request['password'],
    ];

    if(!Auth::attempt($credentials))
      throw new AuthenticationException('Sign in failed!');
  }

  public function updateUser(User $user, array $request)
  {
    if($request['name'] !== $user->name) {
      $user->name = $request['name'];
      $user->save();
    }

    if($request['email'] !== $user->email) {
      $user->email = $request['email'];
      $user->save();
    }
  }

  public function requestNewPassword(array $request)
  {
    $status = Password::sendResetLink([
      'email' => $request['email'],
    ]);

    if($status !== Password::RESET_LINK_SENT)
      throw new AuthenticationException('Update failed!');
  }

  public function setNewPassword(array $request)
  {
    $status = Password::reset(
      $request,
      function ($user, $password) {
        $user->forceFill([
        'password' => $password
        ]);

        $user->save();

        event(new PasswordReset($user));
      }
    );

    if($status !== Password::PASSWORD_RESET)
      throw new AuthenticationException('Update failed!');
  }
}