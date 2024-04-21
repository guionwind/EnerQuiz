<?php

use App\Models\Duel;
use App\Models\User;

it('allows a user to rate a duel', function () {
    // Crear un usuari autenticat
    $user = User::factory()->create();
    $this->actingAs($user);

    // Crear un duel
    $duel = Duel::factory()->create([
        'user1_id' => $user->id,
        'user2_id' => $user->id,
    ]);

    // Peticions de valoració amb nota 5
    $response = $this->postJson("/api/duels/{$duel->id}/rate", ['rate' => 5]);

    // Assegurar-se que la resposta és 200 OK
    $response->assertStatus(200);

    // Refrescar l'instància del duel des de la base de dades
    $duel->refresh();

    // Assegurar-se que la nota del duel és 5
    expect($duel->rating)->toBe(5);
});

it('prevents a user from rating a duel they do not belong to', function () {
    // Crear dos usuaris diferents
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    // Autenticar com a user1
    $this->actingAs($user1);

    // Crear un duel amb user2 com a un dels participants
    $duel = Duel::factory()->create(['user2_id' => $user2->id]);

    // Intentar valorar el duel com a user1
    $response = $this->postJson("/api/duels/{$duel->id}/rate", ['rate' => 5]);

    // Assegurar-se que la resposta és 403 Forbidden
    $response->assertStatus(403);

    // Refrescar l'instància del duel des de la base de dades
    $duel->refresh();

    // Assegurar-se que la nota del duel no ha canviat
    expect($duel->rating)->toBeNull();
});

it('prevents a user from rating a duel when not logged in', function () {
    // No autenticar cap usuari

    // Crear un duel
    $duel = Duel::factory()->create();

    // Intentar valorar el duel sense estar autenticat
    $response = $this->postJson("/api/duels/{$duel->id}/rate", ['rate' => 5]);

    // Assegurar-se que la resposta és 403 Forbidden
    $response->assertStatus(403);

    // Refrescar l'instància del duel des de la base de dades
    $duel->refresh();

    // Assegurar-se que la nota del duel no ha canviat
    expect($duel->rating)->toBeNull();
});