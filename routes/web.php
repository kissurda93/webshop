<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ProductController::class, 'index'])->name('index');

Route::get('/account_activate/{user:verification_token}', [UserController::class, 'activate'])->name('account_activate');

Route::middleware(['guest'])->group(function() {

  Route::view('/loginform', 'auth.login')->name('login.view');
  Route::post('/login', [UserController::class, 'login'])->name('login');

  Route::view('/registerform', 'auth.register')->name('register.view');
  Route::post('/register', [UserController::class, 'register'])->name('register');

  Route::view('/send_password_form', 'auth.forgottenPassword')->name('send_password_form');
  Route::post('/send_password', [UserController::class, 'newPassword'])->name('send_password');
});


Route::middleware(['auth'])->group(function() {

  Route::get('/profile', [UserController::class, 'edit'])->name('profile');
  Route::post('/update_user', [UserController::class, 'update'])->name('update_user');

  Route::view('password_form', 'auth.password')->name('password_form');
  Route::post('/update_password', [UserController::class, 'updatePassword'])->name('update_password');

  Route::get('/logout', [UserController::class, 'logout'])->name('logout');

  Route::get('/delete_user', [UserController::class, 'destroy'])->name('delete_user');

});


Route::get('/restoreaccount', function() {
  User::withTrashed()->where('email', 'jg19930610@gmail.com')->restore();
  return redirect(route('login.view'));
});