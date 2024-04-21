<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $conversation = Conversation::factory()->create();

        $userId = rand(0, 1) == 0 ? $conversation->user1_id : $conversation->user2_id;

        return [
            'user_id' => $userId,
            'conversation_id' => $conversation->id,
            'content' => fake()->sentence,
        ];
    }
}
