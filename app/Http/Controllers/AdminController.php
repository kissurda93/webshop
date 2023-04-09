<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Admin;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Services\AdminService;
use App\Exceptions\LoginException;
use App\Http\Requests\LoginRequest;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function login(LoginRequest $request, AdminService $adminService): Response
    {
        try {
            $validated = $request->validated();
            $token = $adminService->login($validated);
        }
        catch (ValidationException $e) {
            return response($e->errors());
        } catch (LoginException $e) {
            return response($e->getMessage(), $e->getCode());
        }

        return response($token);
    }

    public function getData(Request $request): Response
    {
        $products = Product::with(['categories', 'images'])->get();
        $orders = Order::all();
        $users = User::with(['addresses', 'orders:id,user_id,order_ref'])->get();

        return response(compact('products', 'orders', 'users'));
    }

    public function updateOrder(Order $order): Response
    {   
        $order->update([
            'delivery_status' => "Completed",
        ]);

        return response('Order updated!');
    }
}
