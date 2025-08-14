<?php

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
        Schema::create('tms_system', function (Blueprint $table) {
            $table->id();
            $table->string('organization_name');
            $table->string('organization_email');
            $table->string('organization_phonenumber');
            $table->time('automatic_dropoff_processing_time');
            $table->time('automatic_pickup_processing_time');
            $table->string('reservation_span'); // csv
            $table->string('allowed_dropoff_times'); // csv
            $table->string('allowed_pickup_times'); // csv
            $table->boolean('is_processing_reservations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tms_system');
    }
};
