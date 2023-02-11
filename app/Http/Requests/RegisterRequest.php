<?php

namespace App\Http\Requests;

use App\Rules\CityCheckRule;
use App\Rules\CountryCheckRule;
use App\Rules\StateCheckRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:60|min:4',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed|min:4',
            'country' => ['required', 'string', new CountryCheckRule],
            'state' => ['required', 'string', new StateCheckRule],
            'city' => ['string', new CityCheckRule],
            'address' => 'required|string'
        ];
    }
}
