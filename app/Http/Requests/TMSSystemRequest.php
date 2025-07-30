<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TMSSystemRequest extends FormRequest
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
            'organization_name' => [$requiredOrSometimes, 'string'],
            'organization_email' => [$requiredOrSometimes, 'string'],
            'organization_phonenumber' => [$requiredOrSometimes, 'string'],
            'automatic_dropoff_processing_time' => [$requiredOrSometimes, 'datetime'],
            'automatic_pickup_processing_time' => [$requiredOrSometimes, 'datetime'],
            'reservation_span' => [$requiredOrSometimes, 'string'],
            'allowed_dropoff_times' => [$requiredOrSometimes, 'string'],
            'allowed_pickup_times' => [$requiredOrSometimes, 'string'],
        ];
    }
}
