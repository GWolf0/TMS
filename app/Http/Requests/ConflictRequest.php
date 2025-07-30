<?php

namespace App\Http\Requests;

use App\Models\Conflict;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ConflictRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $requiredOrSometimes = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'type' => [$requiredOrSometimes, Rule::in(Conflict::$TYPES)],
            'data' => ["sometimes", "nullable"],
        ];
    }
}
