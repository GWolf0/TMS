<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrganizationRequest extends FormRequest
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
            'name' => [$requiredOrSometimes, 'string'],
            'email' => [$requiredOrSometimes, 'string'],
            'phonenumber' => [$requiredOrSometimes, 'string'],
            'contract_end_date' => [$requiredOrSometimes, 'date'],
        ];
    }
}
