<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ProductUpdateRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
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

    public function getData(Request $request) {
        $requestToken = $request->header('adminToken');
        if(!Hash::check(config('auth.admin-token'), $requestToken))
            return response([], 401);

        $products = Product::with(['categories', 'images'])->get();
        $orders = Order::all();
        $users = User::with('addresses')->get();

        return response(compact('products', 'orders', 'users'));
    }

    public function updateProduct(ProductUpdateRequest $request) {
        $requestToken = $request->header('adminToken');
        if(!Hash::check(config('auth.admin-token'), $requestToken))
            return response([], 401);

        $validated = $request->validated();
        $product = Product::find($validated['id']);
        if(!$product)
            return response(['message' => 'Product not find'], 404);

        if($product['stock'] != $validated['stock'])
            $product->update(['stock' => $validated['stock']]);

        if($product['discountPercentage'] != $validated['discount'])
            $product->update(['discountPercentage' => $validated['discount']]);

        return response(['message' => 'Product updated successfully!']);
    }

    public function deleteProduct(Request $request, $id) {
        $requestToken = $request->header('adminToken');
        if(!Hash::check(config('auth.admin-token'), $requestToken))
            return response([], 401);

        Product::find($id)->delete();
        return response([]);
    }
}
