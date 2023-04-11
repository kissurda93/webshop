<?php

namespace Database\Seeders;

use App\Models\Address;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;


class UserAndAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Admin::factory(2)->create();
        User::factory(5)->has(Address::factory(1))->create();
        
        $this->call([
            TestUserAdminSeeder::class,
        ]);
    }
}
