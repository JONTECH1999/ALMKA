<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SensorReading extends Model
{
    protected $fillable = [
        'device_id',
        'device_session_id',
        'latitude',
        'longitude',
        'altitude',
        'satellites',
        'distance_left',
        'distance_front',
        'distance_right',
        'vibration_left',
        'vibration_front',
        'vibration_right',
        'battery_level',
        'temperature',
        'recorded_at',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'altitude' => 'decimal:2',
        'recorded_at' => 'datetime',
    ];

    public function deviceSession(): BelongsTo
    {
        return $this->belongsTo(DeviceSession::class);
    }

    public function scopeForDevice($query, $deviceId)
    {
        return $query->where('device_id', $deviceId);
    }

    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('recorded_at', '>=', now()->subHours($hours));
    }

    public function scopeWithGps($query)
    {
        return $query->whereNotNull('latitude')->whereNotNull('longitude');
    }
}
