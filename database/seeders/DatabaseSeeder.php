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
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'sakh96@gmail.com',
        // ]);
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
