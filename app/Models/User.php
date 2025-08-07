<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Http\Resources\ReservationResource;
use App\Http\Resources\ShiftResource;
use App\Http\Resources\UserResource;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // Roles
    static $ROLES = ["admin", "employee", "driver"];

    // fields to show in profile section
    static $PROFILE_SHOWABLE_FIELDS = ["name", "email", "role", "created_at",];
    // updateable fields when trying to update the profile with validations
    static $PROFILE_UPDATEABLE_FIELDS = [
        "name" => "sometimes|string",
    ];

    // eager loaded realations
    public static $WITH = ["organization:id,name"];

    // fillables
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'meta',
        'organization_id',
    ];

    // hidden
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // casts
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'meta' => 'array',
        ];
    }

    // relations
    public function organization(){
        return $this->belongsTo(Organization::class);
    }

    // *** helper functions
    // is[role]
    public function isAdmin(): bool { return $this->role === User::$ROLES[0]; }
    public function isEmployee(): bool { return $this->role === User::$ROLES[1]; }
    public function isDriver(): bool { return $this->role === User::$ROLES[2]; }
 
    // *** static helper functions
    // get default meta
    public static function getDefaultMeta(string $role): array | null{
        return $role === User::$ROLES[2] ? User::getDriverDefaultMeta() : null;
    }
    // get default driver meta
    public static function getDriverDefaultMeta(): array{
        return ["is_available" => true];
    }

    // get user profile data
    public static function getUserProfile(string $userId){
        $data = new UserResource(User::select(User::$PROFILE_SHOWABLE_FIELDS)->where("id", $userId)->first());
        return $data;
    }

    // *** helpers by role *** //
    // employee: get today's reservations
    public static function getEmployeeTodaysReservations(string $employeeId): array{
        $models = Reservation::where("user_id", $employeeId)->whereDate("created_at", now())->get();
        
        $dropoffReservation = null;
        $pickupReservation = null;

        foreach($models as $model){
            if($model->type === Reservation::$TYPES[0]){
                $dropoffReservation = new ReservationResource($model);
            }else{
                $pickupReservation = new ReservationResource($model);
            }
        }

        return [$dropoffReservation, $pickupReservation];
    }

    // driver today's assigned shifts
    public static function getDriverTodaysAssignedShifts(string $driverId): AnonymousResourceCollection{
        $shifts = ShiftResource::collection(Shift::where("driver_id", $driverId)->whereDate("created_at", now())->get());
        return $shifts;
    }

    // driver availability status
    public static function getDriverAvailabilityStatus(string $driverId): bool {
        $user = User::select("meta")->where("id", $driverId)->first();

        if(empty($user) || !isset($user['meta'])) return false;

        return filter_var($user["meta"]['is_available'], FILTER_VALIDATE_BOOLEAN);
    }

}
