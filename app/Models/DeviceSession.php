<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeviceSession extends Model
{
    protected $fillable = [
        'device_id',
        'device_ip',
        'wifi_mode',
        'wifi_ssid',
        'started_at',
        'ended_at',
        'is_active',
        'device_info',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'is_active' => 'boolean',
        'device_info' => 'array',
    ];

    public function sensorReadings(): HasMany
    {
        return $this->hasMany(SensorReading::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForDevice($query, $deviceId)
    {
        return $query->where('device_id', $deviceId);
    }
}
