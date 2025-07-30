<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    public const SAMPLE_NAMES = ["Organization 1", "Organization 2", "Organization 3", "Organization 4", "Organization 5"];

    // fillables
    protected $fillable = [
        'name',
        'email',
        'phonenumber',
        'contract_end_date',
    ];

    // casts
    protected function casts()
    {
        return [
            "contract_end_date" => "datetime"
        ];
    }

}
