<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class TestUserAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'name' => 'Teszt Elek',
            'email' => 'test@email.com',
            'password' => 'testuser',
        ]);

        $address = [
            'country' => 'USA',
            'state' => 'testState',
            'city' => 'testCity',
            'address' => 'testAddress',
            'default' => 1,
        ];

        $user->addresses()->create($address);

        Admin::create([
            'name' => 'Teszt Elek',
            'email' => 'test@email.com',
            'password' => 'testadmin',
        ]);
    }
}
