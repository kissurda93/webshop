<?php

use App\Http\Controllers\CategoryController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/products/{category?}', [ProductController::class, 'index']);
Route::get('/product/{id}', [ProductController::class, 'show']);
Route::post('/search-products', [ProductController::class, 'search']);

Route::get('/categories', [CategoryController::class, 'index']);


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/account_activate/{user:verification_token}', [UserController::class, 'activate']);
Route::post('/user_new_password', [UserController::class, 'newPassword']);
Route::get('/reset-password/{token}', [UserController::class, 'toNewPasswordForm'])->name('password.reset');
Route::post('/reset-password', [UserController::class, 'setNewPassword']);

Route::middleware(['auth:sanctum'])->group(function() {
  Route::get('/logout', [UserController::class, 'logout']);
  Route::put('/user_update', [UserController::class, 'update']);
  Route::delete('/user_delete/{id}', [UserController::class, 'destroy']);
  Route::put('/password_update', [UserController::class, 'updatePassword']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/restoreaccount', function() {
  User::withTrashed()->where('email', 'jg19930610@gmail.com')->restore();
  return response([]);
});