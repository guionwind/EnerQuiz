<?php

use App\Models\Comarca;

it('returns the comarca and its info', function () {
    $comarca = Comarca::factory()->create([
        'name' => 'Alt Emporda',
        'latitude' => 12.3,
        'longitude' => 45.6,
    ]);

    $response = $this->get('api/comarques');
    $response->assertStatus(200);

    $response->assertJsonFragment([$comarca->name]);
    $response->assertJsonFragment([
        'longitude' => $comarca->longitude,
        'latitude' => $comarca->latitude,
    ]);
});