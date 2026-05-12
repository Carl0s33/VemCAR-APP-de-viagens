<?php

use App\Models\User;
use App\Enums\UserType;

it('deve cadastrar um passageiro com sucesso', function () {
    $response = $this->postJson('/api/user/create', [
        'name' => 'João Pedro',
        'email' => 'joao@teste.com',
        'phone' => '84999999999',
        'type' => UserType::PASSENGER->value,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201);
});

it('falha ao cadastrar com e-mail duplicado', function () {
    // Cria um usuário primeiro
    User::factory()->create(['email' => 'duplicado@teste.com']);

    // Tenta cadastrar com o mesmo e-mail
    $response = $this->postJson('/api/user/create', [
        'name' => 'Outro João',
        'email' => 'duplicado@teste.com',
        'phone' => '84988888888',
        'type' => UserType::PASSENGER->value,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422);
});

it('falha ao cadastrar com telefone duplicado', function () {
    // Cria um usuário primeiro
    User::factory()->create(['phone' => '84988888888']);

    // Tenta cadastrar com o mesmo telefone
    $response = $this->postJson('/api/user/create', [
        'name' => 'Outro João',
        'email' => 'duplicado@teste.com',
        'phone' => '84988888888',
        'type' => UserType::PASSENGER->value,
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422);
});
