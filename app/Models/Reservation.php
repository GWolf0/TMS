<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    static $STATUSES = ["pending", "success", "failure"];
    static $TYPES = ["dropoff", "pickup"];

    // eager loaded realations
    public static $WITH = ["traject:id,name", "user:id,name", "shift:number"];

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
        // "time" => "datetime:H:i",
    ];

    public function getTimeAttribute($value){
        return Carbon::parse($value)->format('H:i');
    }

    // relations
    public function traject(){ return $this->belongsTo(Traject::class, "traject_id"); }
    public function shift(){ return $this->belongsTo(Shift::class, "shift_id"); }
    public function user(){ return $this->belongsTo(User::class, "user_id"); }

}
