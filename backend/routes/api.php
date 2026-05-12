<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Rota para criar um novo usuário
Route::post('/user/create', [UserController::class, 'create']);

// Rota para autenticar um usuário
Route::post('/user/login', [UserController::class, 'login']);
