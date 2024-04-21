<?php

use Illuminate\Support\Facades\Hash;

it('can return profile info of the logged user', function () {
    $user =\App\Models\User::factory()->create([
        'email' => 'test@example.com',
        'password' => $pass = bcrypt('password')
    ]);

    $response = $this->postJson('api/login', [
        'email' => 'test@example.com',
        'password' => 'password'
    ]);
    $response->assertStatus(200)->assertJsonStructure(['token']);


    $result = $this->getJson('api/myProfile');
    $result->assertStatus(200);
});