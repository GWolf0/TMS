<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    // eager loaded realations
    public static $WITH = ["traject:id,name", "driver:id,name", "vehicle:id,model_name"];

    protected $fillable = [
        'number',
        'type',
        'date',
        'time',
        'driver_id',
        'traject_id',
        'vehicle_id',
    ];

    protected $casts = [
        "date" => "datetime:Y-m-d",
        // "time" => "datetime:H:i",
    ];

    public function getTimeAttribute($value){
        return Carbon::parse($value)->format('H:i');
    }

    // relations
    public function driver() { return $this->belongsTo(User::class, "driver_id"); }
    public function traject() { return $this->belongsTo(Traject::class, "traject_id"); }
    public function vehicle() { return $this->belongsTo(Vehicle::class, "vehicle_id"); }

}
