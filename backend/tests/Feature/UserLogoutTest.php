<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

it('logout successfully', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->post('/api/logout');

    $response->assertStatus(200);

    $response->assertJson(['message' => 'Has tancat la sessió correctament']);

    $this->assertCount(0, $user->tokens);
});