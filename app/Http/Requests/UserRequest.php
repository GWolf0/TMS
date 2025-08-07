<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    protected function prepareForValidation(): void
    {
        if($this->has('password')) $this->merge(['password' => Hash::make($this->password)]);
    }

    public function rules(): array
    {
        $requiredOrSometimes = $this->isMethod('POST') ? 'required' : 'sometimes';
        
        return [
            'name' => [$requiredOrSometimes, 'string', 'max:255'],
            'email' => array_filter([
                $requiredOrSometimes,
                'string',
                'email',
                $this->isMethod('POST')
                    ? 'unique:users,email'
                    : Rule::unique('users', 'email')->ignore($this->input('id')),
                'max:255',
            ]),
            'password' => [$requiredOrSometimes, 'string'],
            'role' => [$requiredOrSometimes, 'string', Rule::in(User::$ROLES)],
            'meta' => ["sometimes", 'nullable', 'array', 'max:255'],
            'organization_id' => ["sometimes", 'nullable', 'numeric'],
        ];
    }
}
