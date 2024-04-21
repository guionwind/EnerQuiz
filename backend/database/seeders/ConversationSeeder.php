<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Conversation::factory(2)->create()->each(function ($conversation) {
            Message::factory(5)->create([
                'user_id' => $conversation->user1_id,
                'conversation_id' => $conversation,
            ]);

            Message::factory(5)->create([
                'user_id' => $conversation->user2_id,
                'conversation_id' => $conversation,
            ]);
        });
    }
}
