<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    static $STATUSES = ["pending", "success", "failure"];
    static $TYPES = ["dropoff", "pickup"];

    // eager loaded realations
    public static $WITH = ["traject:id,name", "user:id,name"];

    protected $fillable = [
        'type',
        'status',
        'date',
        'time',
        'traject_id',
        'shift_id',
        'user_id',
    ];

    protected $casts = [
        "date" => "datetime:Y-m-d",
        "time" => "datetime:H:i",
    ];

    // relations
    public function traject(){ return $this->hasOne(Traject::class, "traject_id"); }
    public function shift(){ return $this->hasOne(Shift::class, "shift_id"); }
    public function user(){ return $this->hasOne(User::class, "user_id"); }

}
