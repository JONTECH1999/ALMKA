<?php

namespace App\Http\Controllers;

use App\Models\DeviceSession;
use App\Models\LocationHistory;
use App\Models\SensorReading;
use App\Models\VideoRecording;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class DataLoggerController extends Controller
{
    /**
     * Start a new device session
     */
    public function startSession(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'device_ip' => 'string|nullable',
            'wifi_mode' => 'string|in:STA,AP',
            'wifi_ssid' => 'string|nullable',
        ]);

        // End any existing active sessions for this device
        DeviceSession::where('device_id', $request->device_id ?? 'almka-blind-001')
            ->where('is_active', true)
            ->update(['is_active' => false, 'ended_at' => now()]);

        $session = DeviceSession::create([
            'device_id' => $request->device_id ?? 'almka-blind-001',
            'device_ip' => $request->device_ip,
            'wifi_mode' => $request->wifi_mode ?? 'STA',
            'wifi_ssid' => $request->wifi_ssid,
            'started_at' => now(),
            'is_active' => true,
            'device_info' => $request->device_info,
        ]);

        return response()->json([
            'success' => true,
            'session_id' => $session->id,
            'message' => 'Device session started',
        ]);
    }

    /**
     * Log sensor readings
     */
    public function logSensorData(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'session_id' => 'integer|exists:device_sessions,id',
            'latitude' => 'numeric|nullable|between:-90,90',
            'longitude' => 'numeric|nullable|between:-180,180',
            'altitude' => 'numeric|nullable',
            'satellites' => 'integer|nullable|min:0|max:50',
            'distance_left' => 'integer|nullable|min:0|max:400',
            'distance_front' => 'integer|nullable|min:0|max:400',
            'distance_right' => 'integer|nullable|min:0|max:400',
            'vibration_left' => 'integer|nullable|min:0|max:255',
            'vibration_front' => 'integer|nullable|min:0|max:255',
            'vibration_right' => 'integer|nullable|min:0|max:255',
            'battery_level' => 'integer|nullable|min:0|max:100',
            'temperature' => 'numeric|nullable|min:-50|max:100',
        ]);

        $reading = SensorReading::create([
            'device_id' => $request->device_id ?? 'almka-blind-001',
            'device_session_id' => $request->session_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'altitude' => $request->altitude,
            'satellites' => $request->satellites,
            'distance_left' => $request->distance_left,
            'distance_front' => $request->distance_front,
            'distance_right' => $request->distance_right,
            'vibration_left' => $request->vibration_left ?? 0,
            'vibration_front' => $request->vibration_front ?? 0,
            'vibration_right' => $request->vibration_right ?? 0,
            'battery_level' => $request->battery_level,
            'temperature' => $request->temperature,
            'recorded_at' => now(),
        ]);

        if ($reading->latitude !== null && $reading->longitude !== null) {
            $lastLocation = LocationHistory::forDevice($reading->device_id)
                ->orderBy('recorded_at', 'desc')
                ->first();

            $shouldSaveLocation = false;

            if (!$lastLocation) {
                $shouldSaveLocation = true;
            } elseif ($lastLocation->recorded_at->diffInMinutes($reading->recorded_at) >= 1) {
                $shouldSaveLocation = true;
            }

            if ($shouldSaveLocation) {
                LocationHistory::create([
                    'device_id' => $reading->device_id,
                    'device_session_id' => $reading->device_session_id,
                    'latitude' => $reading->latitude,
                    'longitude' => $reading->longitude,
                    'altitude' => $reading->altitude,
                    'satellites' => $reading->satellites,
                    'address' => null,
                    'recorded_at' => $reading->recorded_at,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'reading_id' => $reading->id,
            'message' => 'Sensor data logged successfully',
        ]);
    }

    /**
     * Get historical sensor data
     */
    public function getHistoricalData(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'hours' => 'integer|min:0|max:168|nullable', // Allow 0 for all data
            'limit' => 'integer|min:1|max:10000|nullable',
        ]);

        $deviceId = $request->device_id ?? 'almka-blind-001';
        $hours = $request->hours;
        $limit = $request->limit ?? 1000;

        $query = SensorReading::forDevice($deviceId)
            ->with('deviceSession')
            ->orderBy('recorded_at', 'desc');

        if ($hours && $hours > 0) {
            $query->recent($hours);
        }

        $readings = $query->limit($limit)->get();

        return response()->json([
            'success' => true,
            'device_id' => $deviceId,
            'time_range' => $hours ? "{$hours} hours" : "all time",
            'total_readings' => $readings->count(),
            'data' => $readings,
        ]);
    }

    public function getLocationHistory(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'hours' => 'integer|min:0|max:168|nullable',
            'limit' => 'integer|min:1|max:10000|nullable',
        ]);

        $deviceId = $request->device_id ?? 'almka-blind-001';
        $hours = $request->hours;
        $limit = $request->limit ?? 1000;

        $query = LocationHistory::forDevice($deviceId)
            ->orderBy('recorded_at', 'desc');

        if ($hours && $hours > 0) {
            $query->recent($hours);
        }

        $locations = $query->limit($limit)->get();

        return response()->json([
            'success' => true,
            'device_id' => $deviceId,
            'time_range' => $hours ? "{$hours} hours" : "all time",
            'total_locations' => $locations->count(),
            'data' => $locations,
        ]);
    }

    public function recordVideo(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'session_id' => 'integer|nullable|exists:device_sessions,id',
            'duration' => 'integer|min:1|max:120',
            'title' => 'string|nullable|max:255',
        ]);

        try {
            $deviceId = $request->device_id ?? 'almka-blind-001';
            $sessionId = $request->session_id;
            $duration = $request->duration ?? 10;
            $title = $request->title ?? 'Live feed recording';
            $recordedAt = now();

            $filename = sprintf('video-recordings/%s_%s.mp4',
                preg_replace('/[^A-Za-z0-9_-]/', '_', $deviceId),
                $recordedAt->format('YmdHis')
            );
            $disk = Storage::disk('public');
            $outputPath = $disk->path($filename);
            
            // Ensure directory exists
            $dir = dirname($outputPath);
            if (!is_dir($dir)) {
                @mkdir($dir, 0755, true);
            }

            // Check if ffmpeg is available
            $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
            @system(($isWindows ? 'tasklist | find /I "ffmpeg"' : 'which ffmpeg') . ' > /dev/null 2>&1', $ffmpegExists);
            $ffmpegAvailable = $ffmpegExists === 0;

            if ($ffmpegAvailable) {
                // Use ffmpeg to record 
                $streamUrl = 'http://almka.local:81/stream';
                $process = new \Symfony\Component\Process\Process([
                    'ffmpeg',
                    '-y',
                    '-i', $streamUrl,
                    '-t', (string)$duration,
                    '-c:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-pix_fmt', 'yuv420p',
                    $outputPath,
                ]);
                $process->setTimeout($duration + 30);
                $process->run();

                if (!$process->isSuccessful()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to record video with ffmpeg',
                        'error' => $process->getErrorOutput(),
                    ], 500);
                }
            } else {
                // Create dummy video file for testing
                $dummyContent = "DUMMY_VIDEO_{$duration}_{$recordedAt->timestamp}";
                if (file_put_contents($outputPath, $dummyContent) === false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to create video file',
                    ], 500);
                }
            }

            // Create database record
            $baseUrl = request()->getSchemeAndHttpHost(); // Get the actual request URL with port
            $videoUrl = $baseUrl . '/storage/' . $filename;
            $record = VideoRecording::create([
                'device_id' => $deviceId,
                'device_session_id' => $sessionId,
                'title' => $title,
                'file_path' => $filename,
                'video_url' => $videoUrl,
                'duration_seconds' => $duration,
                'status' => 'ready',
                'recorded_at' => $recordedAt,
            ]);

            return response()->json([
                'success' => true,
                'recording_id' => $record->id,
                'video_url' => $videoUrl,
                'message' => 'Video recording saved successfully',
                'ffmpeg_available' => $ffmpegAvailable,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error recording video: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getVideoHistory(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'hours' => 'integer|min:0|max:168|nullable',
            'limit' => 'integer|min:1|max:10000|nullable',
        ]);

        $deviceId = $request->device_id ?? 'almka-blind-001';
        $hours = $request->hours;
        $limit = $request->limit ?? 1000;

        $query = VideoRecording::forDevice($deviceId)
            ->orderBy('recorded_at', 'desc');

        if ($hours && $hours > 0) {
            $query->recent($hours);
        }

        $videos = $query->limit($limit)->get();

        return response()->json([
            'success' => true,
            'device_id' => $deviceId,
            'time_range' => $hours ? "{$hours} hours" : "all time",
            'total_videos' => $videos->count(),
            'data' => $videos,
        ]);
    }

    public function updateVideo(Request $request, $id): JsonResponse
    {
        $request->validate([
            'title' => 'string|nullable|max:255',
            'duration_seconds' => 'integer|min:1|max:300|nullable',
        ]);

        try {
            $video = VideoRecording::findOrFail($id);
            
            $updateData = [];
            if ($request->has('title')) {
                $updateData['title'] = $request->title;
            }
            if ($request->has('duration_seconds')) {
                $updateData['duration_seconds'] = $request->duration_seconds;
            }

            $video->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Video updated successfully',
                'video' => $video,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update video: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteVideo(Request $request, $id): JsonResponse
    {
        try {
            $video = VideoRecording::findOrFail($id);
            
            // Delete the physical file if it exists
            $filePath = storage_path('app/public/' . $video->file_path);
            if (file_exists($filePath)) {
                unlink($filePath);
            }

            // Delete the database record
            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'Video deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete video: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function saveLocationData(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'altitude' => 'numeric|nullable',
            'address' => 'string|nullable',
        ]);

        $deviceId = $request->device_id ?? 'almka-blind-001';

        // Always save location data when called
        $location = LocationHistory::create([
            'device_id' => $deviceId,
            'device_session_id' => null, // No session for browser-based location
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'altitude' => $request->altitude,
            'satellites' => null, // Not available from browser
            'address' => $request->address,
            'recorded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'location_id' => $location->id,
            'message' => 'Location data saved successfully',
        ]);
    }

    /**
     * Get device statistics
     */
    public function getDeviceStats(Request $request): JsonResponse
    {
        $deviceId = $request->device_id ?? 'almka-blind-001';

        $stats = [
            'active_session' => DeviceSession::forDevice($deviceId)->active()->first(),
            'total_readings' => SensorReading::forDevice($deviceId)->count(),
            'readings_last_24h' => SensorReading::forDevice($deviceId)->recent(24)->count(),
            'readings_with_gps' => SensorReading::forDevice($deviceId)->withGps()->count(),
            'latest_reading' => SensorReading::forDevice($deviceId)->orderBy('recorded_at', 'desc')->first(),
            'first_reading' => SensorReading::forDevice($deviceId)->orderBy('recorded_at', 'asc')->first(),
        ];

        return response()->json([
            'success' => true,
            'device_id' => $deviceId,
            'stats' => $stats,
        ]);
    }

    /**
     * End device session
     */
    public function endSession(Request $request): JsonResponse
    {
        $request->validate([
            'device_id' => 'string|nullable',
            'session_id' => 'integer|exists:device_sessions,id',
        ]);

        $deviceId = $request->device_id ?? 'almka-blind-001';

        $session = DeviceSession::where('device_id', $deviceId)
            ->where('id', $request->session_id)
            ->where('is_active', true)
            ->first();

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'Active session not found',
            ], 404);
        }

        $session->update([
            'is_active' => false,
            'ended_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Device session ended',
        ]);
    }

    /**
     * Get the IP of the active device
     */
    public function getDeviceIp(): JsonResponse
    {
        $session = DeviceSession::where('is_active', true)->latest()->first();

        if (!$session) {
            return response()->json(['message' => 'No active device session'], 404);
        }

        return response()->json(['device_ip' => $session->device_ip]);
    }
}
