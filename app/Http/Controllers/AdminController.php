<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
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
        
        $products = Product::with(['categories', 'images'])->get();
        $orders = Order::all();
        $users = User::with(['addresses', 'orders:id,user_id,order_ref'])->get();

        return response(compact('products', 'orders', 'users'));
    }

    public function updateOrder(Request $request) {
        $validated = $request->validate([
            'id' => 'required',
            'delivery_status' => 'required',
        ]);

        $order = Order::find($validated['id']);
        $order->update([
            'delivery_status' => $validated['delivery_status']
        ]);

        return response([]);
    }
}
