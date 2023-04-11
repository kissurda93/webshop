<?php

namespace App\Console;

use App\Models\User;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Artisan;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function() {
            Artisan::call('queue:work --stop-when-empty');
        })->everyMinute()->name('QueueWorker')->withoutOverlapping();

        // $schedule->call(function() {
        //     $user = User::withTrashed()->find(6);
        //     $user->restore();
        //     $user->name = "Teszt Elek";
        //     $user->email = "test@email.com";
        //     $user->password = "testuser";
        //     $user->save();
        // })->everyFiveMinutes()->name('Test account fixer')->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
