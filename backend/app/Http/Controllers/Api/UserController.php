<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller {
    // Método para criar um novo usuário
    public function create(RegisterRequest $request) {

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'cpf'      => $request->cpf,
            'password' => bcrypt($request->password),
            'type'     => $request->type,
            'phone'    => $request->phone,
        ]);

        return response()->json([
            'message' => 'Usuário criado com sucesso!',
            'user'    => $user
        ], 201);
    }

    public function login(LoginRequest $request) {

       $user = User::where('email', $request->login)->first();

       if (!$user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais fornecidas estão incorretas.'],
            ]);
       }

       $token = $user->createToken($request->device_name)->plainTextToken;
       return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'type' => $user->type->value,
                'status' => $user->status
            ]
        ], 200);
    }
}
