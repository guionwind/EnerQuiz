<?php

use App\Models\User;

it('can return the id of an authenticated user', function () {

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('api/myProfile/id');

    $response->assertJson(['id' => $user->id]);

});
