<?php

use App\Models\User;

it('register a user', function () {
    $userData = [
      'name' => 'test',
      'email' => 'test@enerquiz.com',
        'password' => 'password',
        'username' => 'shengYe'
    ];

    $response = $this->postJson('api/register', $userData);

    $response->assertStatus(201);

    $this->assertDatabaseHas('users', [
        'name' => 'test',
        'email' => 'test@enerquiz.com',
    ]);
});