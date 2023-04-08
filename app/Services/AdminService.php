<?php

namespace App\Services;

use App\Models\Admin;
use App\Exceptions\LoginException;
use Illuminate\Support\Facades\Hash;

class AdminService
{
  public function login(array $request): string
  {
    $admin = Admin::where('email', $request['email'])->first();

    if(!$admin)
      throw new LoginException('Sign in Failed!', 401);

    if(!Hash::check($request['password'], $admin->password))
      throw new LoginException('Sign in Failed!', 401);

    return bcrypt(config('auth.admin-token'));
  }
}