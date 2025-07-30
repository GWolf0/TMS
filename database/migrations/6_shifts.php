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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->integer('number');
            $table->enum('type', Reservation::$TYPES);
            $table->date('date');
            $table->time('time');
            $table->foreignId('driver_id')->nullable()->constrained("users", "id")->onDelete('set null');
            $table->foreignId('traject_id')->nullable()->constrained("trajects", "id")->onDelete('set null');
            $table->foreignId('vehicle_id')->nullable()->constrained("vehicles", "id")->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("shifts");
    }
};
