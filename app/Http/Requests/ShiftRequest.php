<?php

namespace App\Http\Requests;

use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShiftRequest extends FormRequest
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
            'number' => ["sometimes", "nullable", "numeric"],
            'type' => [$requiredOrSometimes, Rule::in(Reservation::$TYPES)],
            'date' => [$requiredOrSometimes, "date"],
            'time' => [$requiredOrSometimes, 'date_format:H:i'],
            'driver_id' => ["sometimes", "nullable"],
            'traject_id' => ["sometimes", "nullable"],
            'vehicle_id' => ["sometimes", "nullable"],
        ];
    }
}
