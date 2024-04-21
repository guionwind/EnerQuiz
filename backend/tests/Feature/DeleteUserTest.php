<?php

use App\Models\User;

it('can delete an user give the proper id', function () {
    $user = User::factory()->create([
        'name' => 'kuu02',
        'username' => 'asd',
        'email' => 'kuu02falso@outlook.ru',
        'password' => 'dmc'
    ]);

    $response = $this->delete('api/users/delete/' . $user->id);
    $response->assertStatus(200);

    $response->assertJsonFragment([
        'message'=>'User deleted'
    ]);

    $this->assertDatabaseCount('users', 0);

});

it('cannot delete an user if the id is incorrect', function () {
    $user = User::factory()->create([
        'name' => 'kuu02',
        'username' => 'asd',
        'email' => 'kuu02falso@outlook.ru',
        'password' => 'dmc'
    ]);

    $response = $this->delete('api/users/delete/' . $user->id + 1);
    $response->assertStatus(404);

    $response->assertJsonFragment([
        'message'=>'User not found'
    ]);

    $this->assertDatabaseCount('users', 1);
});