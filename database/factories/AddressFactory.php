<?php

namespace Database\Factories;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $randomStateNumber = rand(1, 20);
        $state = DB::table('states')->find($randomStateNumber);
        $city = DB::table('cities')->where('state_id', $randomStateNumber)->first();

        return [
            'country' => 'USA',
            'state' => $state->name,
            'city' => $city->name,
            'address' => fake()->streetAddress(),
            'default' => 1,
        ];
    }
}
