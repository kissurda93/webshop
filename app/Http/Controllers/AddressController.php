<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    public function getCountries() {
        $countries = DB::table('countries')->select('id', 'name')->get();
        return response($countries);
    }

    public function getStates($id) {
        $states = DB::table('states')->where('country_id', $id)->select('id', 'name')->get();
        return response($states);
    }

    public function getCities($id) {
        $cities = DB::table('cities')->where('state_id', $id)->select('id', 'name')->get();
        return response($cities);
    }
}
