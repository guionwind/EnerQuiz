<?php

use App\Models\Municipi;

it('can return the data of a Municipi', function () {

    $municipi = Municipi::factory()->create([
        'name' => 'Espolla',
        'latitude' => 123.4,
        'longitude' => 567.8,
        'comarca_id' => 1
    ]);

    $response = $this->getJson('api/municipis');
    $response->assertStatus(200);

    $response->assertJsonFragment([$municipi->name]);
    $response->assertJsonFragment([
        'longitude' => $municipi->longitude,
        'latitude' => $municipi->latitude
    ]);
});
