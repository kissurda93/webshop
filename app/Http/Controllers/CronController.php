<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class CronController extends Controller
{
    public function sendingEmails()
    {
        Artisan::call('queue:work --stop-when-empty');
    }

    public function fixTestAccount()
    {
        Artisan::call('fix:testaccount');
    }
}
