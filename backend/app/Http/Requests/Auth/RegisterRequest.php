<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use App\Enums\UserType;
use App\Rules\Cpf;
use Illuminate\Validation\Rule;
use Override;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
       return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'cpf'      => ['required', 'string', 'min:11', 'max:14', 'unique:users', new Cpf],
            'phone'    => ['required', 'string', 'min:10'],
            'type'     => ['required', Rule::enum(UserType::class)], // Valida usando seu Enum!
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Este e-mail já está cadastrado no VEM CAR.',
            'type.Illuminate\Validation\Rules\Enum' => 'O tipo de usuário selecionado é inválido.',
            'password.confirmed' => 'A confirmação da senha não corresponde.',
            'cpf.unique' => 'Este CPF já está cadastrado no VEM CAR.',
            'phone.min' => 'O número de telefone deve conter pelo menos 10 dígitos.',
        ];
    }


    protected function prepareForValidation()
    {
        $this->merge([
            'cpf' => preg_replace('/[^0-9]/', '', $this->cpf),
        ]);
    }
}
