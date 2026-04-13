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
        Schema::create('sensor_readings', function (Blueprint $table) {
            $table->id();
            $table->string('device_id')->default('almka-blind-001');
            $table->foreignId('device_session_id')->constrained('device_sessions')->onDelete('cascade');
            
            // GPS Data
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('altitude', 8, 2)->nullable();
            $table->integer('satellites')->nullable();
            
            // Ultrasonic Sensor Data
            $table->integer('distance_left')->nullable(); // cm
            $table->integer('distance_front')->nullable(); // cm
            $table->integer('distance_right')->nullable(); // cm
            
            // Vibration Motor Data
            $table->integer('vibration_left')->default(0); // 0-255
            $table->integer('vibration_front')->default(0); // 0-255
            $table->integer('vibration_right')->default(0); // 0-255
            
            // Device Status
            $table->integer('battery_level')->nullable(); // percentage
            $table->decimal('temperature', 4, 2)->nullable(); // celsius
            
            $table->timestamp('recorded_at');
            $table->timestamps();
            
            $table->index(['device_id', 'recorded_at']);
            $table->index('recorded_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_readings');
    }
};
