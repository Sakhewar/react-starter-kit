<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MenuBaseSeeder::class
        ]);
    }

    public static function functionCall()
    {
        $functionCall = "updateOrCreate";
        if (config('app.env') === 'production')
        {
            $functionCall = "firstOrCreate";
        }
        return $functionCall;
    }
}
