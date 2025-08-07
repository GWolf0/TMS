<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conflict extends Model
{
    use HasFactory;

    static $TYPES = ["no seats remaining", "no drivers remaining"];

    protected $fillable = [
        'type',
        'data',
    ];

}
