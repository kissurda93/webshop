<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewProductRequest extends FormRequest
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
            'title' =>'required|string',
            'brand' => 'required|string',
            'price' => 'required|string',
            'stock' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'images' => 'required',
            'images.*' => 'file|mimes:png,jpg,jpeg|max:5242880',
        ];
    }
}
