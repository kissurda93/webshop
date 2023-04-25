<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class FixTestAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:testaccount';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restoring the test account if it was deleted and fixing the properties(email, password, name)';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $user = User::withTrashed()->find(30);

        if($user->deleted_at)
            $user->restore();

        $user->name = "Teszt Elek";
        $user->email = "test@email.com";
        $user->password = "testuser";
        $user->save();
    }
}
