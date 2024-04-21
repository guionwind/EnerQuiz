<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class FriendFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $users = DB::table('users')->inRandomOrder()->limit(2)->pluck('id');
        $found = DB::table('friends')->where('user_id_1', $users[0])->where('user_id_2', $users[1])->first();

        while ($found) {
            $users = DB::table('users')->inRandomOrder()->limit(2)->pluck('id');
            $found = DB::table('friends')->where('user_id_1', $users[0])->where('user_id_2', $users[1])->first();
        }

        return [
            'user_id_1' => $users[0],
            'user_id_2' => $users[1],
        ];
    }
}
