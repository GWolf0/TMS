<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Traject extends Model
{
    use HasFactory;

    public const SAMPLE_TRAJECTS = ["Traject 1", "Traject 2", "Traject 3", "Traject 4", "Traject 5", "Traject 6", "Traject 7", "Traject 8", "Traject 9", "Traject 10"];

    protected $fillable = [
        'name',
        'stop_areas',
    ];

}
