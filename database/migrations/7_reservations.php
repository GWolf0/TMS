<?php

use App\Models\Reservation;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->enum('type', Reservation::$TYPES);
            $table->enum('status', Reservation::$STATUSES);
            $table->date('date');
            $table->time('time');
            $table->foreignId('traject_id')->constrained('trajects', 'id')->onDelete('set null');
            $table->foreignId('shift_id')->nullable()->constrained('shifts', 'id')->onDelete('set null');
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("reservations");
    }
};
