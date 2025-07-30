<?php

namespace App\Http\Requests;

use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReservationRequest extends FormRequest
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
            'type' => [$requiredOrSometimes, Rule::in(Reservation::$TYPES)],
            'status' => [$requiredOrSometimes, Rule::in(Reservation::$STATUSES)],
            'date' => [$requiredOrSometimes, "date"],
            'time' => [$requiredOrSometimes, 'string'],
            'traject_id' => [$requiredOrSometimes],
            'shift_id' => ["sometimes", "nullable"],
            'user_id' => [$requiredOrSometimes],
        ];
    }
}
