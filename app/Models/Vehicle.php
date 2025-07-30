<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    public const SAMPLE_MODELS_NAME = ["Model 1", "Model 2", "Model 3", "Model 4", "Model 5"];

    static $STATUS = ["available", "not available"];

    protected $fillable = [
        'model_name',
        'capacity',
        'status',
    ];

}
