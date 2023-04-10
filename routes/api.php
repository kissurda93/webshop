<?php

use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SimplePayController;
use App\Models\Order;

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

// Location endpoints to forms:
Route::get('/countries', [AddressController::class, 'getCountries']);
Route::get('/states/{id}', [AddressController::class, 'getStates']);
Route::get('/cities/{id}', [AddressController::class, 'getCities']);

// Product and category:
Route::get('/products/{category?}', [ProductController::class, 'index']);
Route::get('/product/{product}', [ProductController::class, 'show']);
Route::post('/search-products', [ProductController::class, 'search']);

Route::get('/categories', [CategoryController::class, 'index']);

// User related:
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::get('/account_activate/{user:verification_token}', [UserController::class, 'activate'])->name('account-activate');
Route::post('/user_new_password', [UserController::class, 'newPassword']);
Route::get('/reset-password/{token}', [UserController::class, 'toNewPasswordForm'])->name('password.reset');
Route::post('/reset-password', [UserController::class, 'setNewPassword']);

Route::middleware(['auth:sanctum'])->group(function() {
  Route::get('/user', [UserController::class, 'getUserData']);
  Route::get('/logout', [UserController::class, 'logout']);
  Route::patch('/user_update', [UserController::class, 'update']);
  Route::delete('/user_delete', [UserController::class, 'destroy']);
  Route::patch('/password_update', [UserController::class, 'updatePassword']);
  Route::post('/new-address/{user}', [AddressController::class, 'newAddress']);
  Route::patch('/setDefaultAddress/{user}/{address}', [AddressController::class, 'setDefault']);
  Route::delete('/delete-address/{address}', [AddressController::class, 'deleteAddress']);
  Route::post('/simplePay-request/{user}', [SimplePayController::class, 'start']);
});

// IPN receiver endpoint to SimplePay:
Route::post('/ipn-receiver', [SimplePayController::class, 'ipn']);

// Admin related:
Route::post('/>>>login-admin<<<', [AdminController::class, 'login']);
Route::middleware(['admin'])->group(function() {
  Route::get('/>>>admin-data<<<', [AdminController::class, 'getData']);
  Route::patch('/>>>update-order<<</{order}', [AdminController::class, 'updateOrder']);
  Route::patch('/>>>update-product<<</{product}', [ProductController::class, 'updateProduct']);
  Route::delete('/>>>delete-product<<</{product}', [ProductController::class, 'deleteProduct']);
  Route::post('/>>>new-product<<<', [ProductController::class, 'createProduct']);
});