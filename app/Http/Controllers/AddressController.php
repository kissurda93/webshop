<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewAddressRequest;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function getCountries() {
        $countries = DB::table('countries')->select('id', 'name')->get();
        return response($countries);
    }

    public function getStates($id) {
        $states = DB::table('states')->where('country_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($states);
    }

    public function getCities($id) {
        $cities = DB::table('cities')->where('state_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($cities);
    }

    public function newAddress(NewAddressRequest $request) {
        $validated = $request->validated();

        $address = [
            'address' => $validated['address'],
            'country' => $validated['country'],
            'state' => isset($validated['state']) ? $validated['state'] : null,
            'city' => isset($validated['city']) ? $validated['city'] : null,
            'default' => false,
        ];

        $user = User::find($validated['id']);
        $addressInDB = $user->addresses()->create($address);

        return response([$addressInDB]);
    }

    public function setDefault(Request $request) {
        $validated = $request->validate([
            'user_id' => 'required',
            'id' => 'required',
        ]);

        $user = User::find($validated['user_id']);

        $defaultAddress = $user->addresses()->where('default', 1)->first();
        $defaultAddress->default = 0;
        $defaultAddress->save();

        $newDefaultAddress = $user->addresses()->find($validated['id']);
        $newDefaultAddress->default = 1;
        $newDefaultAddress->save();

        return response([$newDefaultAddress]);
    }

    public function deleteAddress($id) {
        $address = Address::find($id);
        if(!$address) return response(['message' => 'Address is not found!'], 404);
        if($address->default == 1) return response(['message' => 'You cannot delete a default address!'], 405);

        if($address->delete())
            return response([]);
    }
}
