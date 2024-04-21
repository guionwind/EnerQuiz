<?php

use Illuminate\Support\Facades\Hash;

it('can login with correct credentials', function () {
    $user =\App\Models\User::factory()->create([
       'email' => 'test@example.com',
       'password' => $pass = bcrypt('password')
    ]);

    $response = $this->postJson('api/login', [
       'email' => 'test@example.com',
       'password' => 'password'
    ]);

    $response->assertStatus(200)->assertJsonStructure(['token']);
});

it('cannot login with incorrect credentials', function () {
    $response = $this->postJson('api/login', [
        'email' => 'test@example.com',
        'password' => 'incorrectPassword'
    ]);

    $response->assertStatus(401)->assertJson(['error' => 'Unauthorized']);
});