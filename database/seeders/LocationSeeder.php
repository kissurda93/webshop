<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('countries')->insert([
            'name' => "USA",
            'created_at' => now(), 
            'updated_at' => now()
        ]);

        $states = [];
        for ($i=0; $i < 20; $i++) { 
            array_push($states, [
                'name' => fake()->state(),
                'country_id' => 1,
                'created_at' => now(), 
                'updated_at' => now()
            ]);
        }
        DB::table('states')->insert($states);

        $cities = [];
        foreach ($states as $state) {
            for ($i=0; $i < 5; $i++) { 
                array_push($cities, [
                    'name' => fake()->city(),
                    'state_id' => rand(1, 20),
                    'created_at' => now(), 
                    'updated_at' => now()
                ]);
            }
        }
        DB::table('cities')->insert($cities);
    }
}
