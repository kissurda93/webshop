<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Address;
use Illuminate\Http\Response;
use App\Services\AddressService;
use Illuminate\Support\Facades\DB;
use App\Exceptions\AddressException;
use App\Http\Requests\NewAddressRequest;
use Illuminate\Validation\ValidationException;

class AddressController extends Controller
{
    public function getCountries(): Response
    {
        $countries = DB::table('countries')->select('id', 'name')->get();
        return response($countries);
    }

    public function getStates($id): Response
    {
        $states = DB::table('states')->where('country_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($states);
    }

    public function getCities($id): Response
    {
        $cities = DB::table('cities')->where('state_id', $id)->select('id', 'name')->orderBy('name')->get();
        return response($cities);
    }

    public function newAddress(NewAddressRequest $request, User $user, AddressService $addressService): Response
    {
        try {
            $validated = $request->validated();
        } catch(ValidationException $e) {
            return response($e->errors(), 422);
        }

        $address = $addressService->newAddress($validated, $user);

        return response($address, 201);
    }

    public function setDefault(User $user, Address $address, AddressService $addressService): Response
    {
        $address = $addressService->changeDefault($user, $address);
        
        return response($address);
    }

    public function deleteAddress(Address $address, AddressService $addressService): Response
    {
        try{
            $message = $addressService->deleteAddress($address);
        } catch(AddressException $e) {
            return response($e->getMessage(), $e->getCode());
        }

        return response($message);
    }
}
