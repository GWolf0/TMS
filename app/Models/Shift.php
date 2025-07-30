<?php

namespace App\Models;

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
        "time" => "datetime:H:i",
    ];

    // relations
    public function driver() { return $this->hasOne(User::class, "driver_id"); }
    public function traject() { return $this->hasOne(Traject::class, "traject_id"); }
    public function vehicle() { return $this->hasOne(Vehicle::class, "vehicle_id"); }

}
