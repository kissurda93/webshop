<?php

namespace App\Http\Requests;

use App\Rules\CityCheckRule;
use App\Rules\CountryCheckRule;
use App\Rules\StateCheckRule;
use Illuminate\Foundation\Http\FormRequest;

class NewAddressRequest extends FormRequest
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
            'country' => ['required', 'string', new CountryCheckRule],
            'state' => [new StateCheckRule],
            'city' => [new CityCheckRule],
            'address' => 'required|string',
        ];
    }
}
