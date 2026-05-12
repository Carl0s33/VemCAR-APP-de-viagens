<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller {
    // Método para criar um novo usuário
    public function create(RegisterRequest $request) {

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'type'     => $request->type,
            'phone'    => $request->phone,
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso!',
            'user'    => $user
        ], 201);
    }
}
