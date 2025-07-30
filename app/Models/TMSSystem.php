<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\TMSSystemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class TMSSystem extends Model
{
    use HasFactory;

    // default values
    public const RESERVATION_SPAN = "11:00,13:00";
    public const AUTOMATIC_DROPOFF_PROCESSING_TIME = "13:10";
    public const AUTOMATIC_PICKUP_PROCESSING_TIME = "15:10";
    public const ALLOWED_DROPOFF_TIMES = "17:00,18:00";
    public const ALLOWED_PICKUP_TIMES = "08:00,09:00";

    // explicit factory
    protected static function newFactory(){
        return TMSSystemFactory::new();
    }

    // table name    
    protected $table="tms_system";
    
    // fillables
    protected $fillable = [
        'organization_name',
        'organization_email',
        'organization_phonenumber',
        'automatic_dropoff_processing_time',
        'automatic_pickup_processing_time',
        'reservation_span',
        'allowed_dropoff_times',
        'allowed_pickup_times',
        'is_processing_shifts',
    ];

    // casts
    protected function casts(): array
    {
        return [
            'automatic_dropoff_processing_time' => 'datetime:H:i',
            'automatic_pickup_processing_time' => 'datetime:H:i',
        ];
    }

    // singleton instance
    private static TMSSystem $instance;

    public static function getInstance(){
        if(empty(TMSSystem::$instance)){
            TMSSystem::$instance = TMSSystem::first();
        }
        // Log::debug(TMSSystem::$instance);
        return TMSSystem::$instance;
    } 

    public static function invalidateInstance(){ // reset instance (call if updated and still gonna use it later in same current request)
        TMSSystem::$instance = TMSSystem::first();
    }

    // helpers
    public static function getAvailableDropoffTimes(): array{
        if(empty(TMSSystem::getInstance())) return [];

        $times = explode(',', TMSSystem::getInstance()->allowed_dropoff_times);
        return $times;
    }
    public static function getAvailablePickupTimes(): array{
        if(empty(TMSSystem::getInstance())) return [];

        $times = explode(',', TMSSystem::getInstance()->allowed_pickup_times);
        return $times;
    }
    public static function getReservationSpanString(): string | null{
        if(empty(TMSSystem::getInstance())) return null;
        
        return TMSSystem::getInstance()->reservation_span;
    }
    public static function getReservationSpan(): array | null{
        $strVal = TMSSystem::getReservationSpanString();
        if(empty($strVal)) return null;

        $span = explode(',', $strVal);

        if(count($span) != 2) return null;
        
        return $span;
    }

}
