<?php

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('gets the auth user chats', function () {
    $user = User::factory()->create();

    $conversation1 = Conversation::factory()->create(['user1_id' => $user->id]);
    $conversation2 = Conversation::factory()->create(['user2_id' => $user->id]);

   Sanctum::actingAs($user);

    $response = $this->get('/api/conversations');
    $response->assertOk();

    $response->assertJson([
        'conversations' => [
            ['id' => $conversation1->id],
            ['id' => $conversation2->id],
        ],
    ]);
});

it('gets specific chat messages', function () {
    $user = User::factory()->create();

    $conversation = Conversation::factory()->create();

    $message1 = Message::factory()->create(['conversation_id' => $conversation->id]);
    $message2 = Message::factory()->create(['conversation_id' => $conversation->id]);

    Sanctum::actingAs($user);

    $response = $this->get("/api/conversations/{$conversation->id}");
    $response->assertOk();

    $response->assertJson([
        'messages' => [
            ['id' => $message1->id],
            ['id' => $message2->id],
        ],
    ]);
});

it('sends a message to a specific chat', function () {
    $user = User::factory()->create();

    $conversation = Conversation::factory()->create(['user1_id' => $user->id]);

    Sanctum::actingAs($user);

    $messageData = [
        'content' => 'Aquest és un missatge de prova.',
    ];

    $response = $this->post("/api/conversations/{$conversation->id}", $messageData);
    $response->assertOk();

    $response->assertJson([
        'message' => 'Missatge enviat amb èxit',
    ]);

    $this->assertDatabaseHas('messages', $messageData + ['conversation_id' => $conversation->id]);
});
