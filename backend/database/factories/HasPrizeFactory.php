<?php

namespace Database\Factories;

use App\Models\Prize;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HasPrize>
 */
class HasPrizeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $users = User::pluck('id');
        $prizes = Prize::pluck('id');

        return [
            'code' => fake()->bothify('???###??'),
            'remaining_amount' => fake()->randomFloat(2, 5, 15),
            'user_id' => fake()->randomElement($users),
            'prize_id' => fake()->randomElement($prizes),
        ];
    }
}
