<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewAddressRequest;
use App\Models\Address;
use App\Models\User;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use App\Exceptions\AddressException;

class AddressController extends Controller
{
    public function getCountries()
    {
        $countries = DB::table('countries')->select('id', 'name')->get();
        return response($countries);
    }

    public function getStates($id)
    {
        $states = DB::table('states')->where('country_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($states);
    }

    public function getCities($id)
    {
        $cities = DB::table('cities')->where('state_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($cities);
    }

    public function newAddress(NewAddressRequest $request, User $user, AddressService $addressService)
    {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors(), 422);
        }

        $address = $addressService->newAddress($validated, $user);

        return response(['newAddress' => $address], 201);
    }

    public function setDefault(User $user, Address $address, AddressService $addressService)
    {
        $address = $addressService->changeDefault($user, $address);
        
        return response(['defaultAddress' => $address]);
    }

    public function deleteAddress(Address $address, AddressService $addressService) {
        try{
            $message = $addressService->deleteAddress($address);
        } catch(AddressException $e) {
            return response($e->message(), $e->responseCode());
        }

        return response(['message' => $message]);
    }
}
