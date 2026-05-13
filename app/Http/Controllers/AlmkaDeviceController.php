<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AlmkaDeviceController extends Controller
{
    public function gps(Request $request)
    {
        $ip = trim($request->query('ip', ''));

        if (empty($ip)) {
            return response()->json(['message' => 'ALMKA Device IP is required'], 400);
        }

        $ip = preg_replace('/\/$/', '', $ip);
        if (!preg_match('/^https?:\/\//', $ip)) {
            $ip = 'http://' . $ip;
        }

        $url = $ip . '/gps';

        try {
            $response = Http::timeout(5)->get($url);
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            
            // Provide user-friendly error messages based on exception type
            $userMessage = 'Unable to reach ALMKA Device';
            $reason = 'unknown';
            
            if (str_contains($message, 'timed out') || str_contains($message, 'Connection timed out')) {
                $userMessage = 'ALMKA Device is not responding';
                $reason = 'timeout';
            } elseif (str_contains($message, 'Connection refused')) {
                $userMessage = 'ALMKA Device connection refused';
                $reason = 'refused';
            } elseif (str_contains($message, 'Name or service not known') || str_contains($message, 'Could not resolve')) {
                $userMessage = 'Cannot find ALMKA Device at the given address';
                $reason = 'not_found';
            }
            
            return response()->json([
                'message' => $userMessage,
                'reason' => $reason,
                'details' => 'The ALMKA Device is offline or unreachable. Please check the device power and network connection.',
            ], 502);
        }

        if (! $response->ok()) {
            return response()->json([
                'message' => 'ALMKA Device returned an error',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 502);
        }

        $payload = $response->json();

        if (! isset($payload['lat']) || ! isset($payload['lon'])) {
            return response()->json([
                'message' => 'Invalid GPS payload from ALMKA Device',
                'body' => $payload,
            ], 502);
        }

        return response()->json([
            'lat' => $payload['lat'],
            'lon' => $payload['lon'],
        ]);
    }

    public function camera(Request $request)
    {
        $ip = trim($request->query('ip', ''));

        if (empty($ip)) {
            return response()->json(['message' => 'ALMKA Device IP is required'], 400);
        }

        $ip = preg_replace('/\/$/', '', $ip);
        if (!preg_match('/^https?:\/\//', $ip)) {
            $ip = 'http://' . $ip;
        }

        $url = $ip . '/camera';

        try {
            $response = Http::timeout(10)->get($url);
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            
            $userMessage = 'Unable to reach ALMKA Device camera';
            $reason = 'unknown';
            
            if (str_contains($message, 'timed out') || str_contains($message, 'Connection timed out')) {
                $userMessage = 'ALMKA Device camera is not responding';
                $reason = 'timeout';
            } elseif (str_contains($message, 'Connection refused')) {
                $userMessage = 'ALMKA Device camera connection refused';
                $reason = 'refused';
            } elseif (str_contains($message, 'Name or service not known') || str_contains($message, 'Could not resolve')) {
                $userMessage = 'Cannot find ALMKA Device camera at the given address';
                $reason = 'not_found';
            }
            
            return response()->json([
                'message' => $userMessage,
                'reason' => $reason,
                'details' => 'The ALMKA Device camera is offline or unreachable.',
            ], 502);
        }

        if (! $response->ok()) {
            return response()->json([
                'message' => 'ALMKA Device camera returned an error',
                'status' => $response->status(),
            ], 502);
        }

        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Cache-Control', 'no-cache')
            ->header('Pragma', 'no-cache');
    }

    public function stream(Request $request)
    {
        $ip = trim($request->query('ip', ''));

        if (empty($ip)) {
            return response()->json(['message' => 'ALMKA Device IP is required'], 400);
        }

        $ip = preg_replace('/\/$/', '', $ip);
        if (!preg_match('/^https?:\/\//', $ip)) {
            $ip = 'http://' . $ip;
        }

        // Try port 81 first for MJPEG stream, fallback to port 80
        $streamUrl = $ip . ':81/stream';
        
        try {
            $response = Http::timeout(10)->get($streamUrl);
        } catch (\Exception $exception) {
            // Fallback to port 80 /stream
            try {
                $streamUrl = $ip . '/stream';
                $response = Http::timeout(10)->get($streamUrl);
            } catch (\Exception $fallbackException) {
                $message = $fallbackException->getMessage();
                
                $userMessage = 'Unable to reach ALMKA Device stream';
                $reason = 'unknown';
                
                if (str_contains($message, 'timed out') || str_contains($message, 'Connection timed out')) {
                    $userMessage = 'ALMKA Device stream is not responding';
                    $reason = 'timeout';
                } elseif (str_contains($message, 'Connection refused')) {
                    $userMessage = 'ALMKA Device stream connection refused';
                    $reason = 'refused';
                } elseif (str_contains($message, 'Name or service not known') || str_contains($message, 'Could not resolve')) {
                    $userMessage = 'Cannot find ALMKA Device stream at the given address';
                    $reason = 'not_found';
                }
                
                return response()->json([
                    'message' => $userMessage,
                    'reason' => $reason,
                    'details' => 'The ALMKA Device stream is offline or unreachable. Tried both port 81 and port 80.',
                ], 502);
            }
        }

        if (! $response->ok()) {
            return response()->json([
                'message' => 'ALMKA Device stream returned an error',
                'status' => $response->status(),
            ], 502);
        }

        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'))
            ->header('Cache-Control', 'no-cache')
            ->header('Pragma', 'no-cache');
    }

    public function saveSensorSettings(Request $request)
    {
        $ip = trim($request->query('ip', ''));

        if (empty($ip)) {
            return response()->json(['message' => 'ALMKA Device IP is required'], 400);
        }

        $detectionDistance = $request->input('detection_distance');
        $vibrationIntensity = $request->input('vibration_intensity');

        if (!is_numeric($detectionDistance) || !is_numeric($vibrationIntensity)) {
            return response()->json(['message' => 'Invalid sensor settings'], 400);
        }

        $ip = preg_replace('/\/$/', '', $ip);
        if (!preg_match('/^https?:\/\//', $ip)) {
            $ip = 'http://' . $ip;
        }

        $url = $ip . '/save?d=' . $detectionDistance . '&v=' . $vibrationIntensity;

        try {
            $response = Http::timeout(5)->get($url);
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            
            $userMessage = 'Unable to save sensor settings to ALMKA Device';
            $reason = 'unknown';
            
            if (str_contains($message, 'timed out') || str_contains($message, 'Connection timed out')) {
                $userMessage = 'ALMKA Device is not responding';
                $reason = 'timeout';
            } elseif (str_contains($message, 'Connection refused')) {
                $userMessage = 'ALMKA Device connection refused';
                $reason = 'refused';
            } elseif (str_contains($message, 'Name or service not known') || str_contains($message, 'Could not resolve')) {
                $userMessage = 'Cannot find ALMKA Device at the given address';
                $reason = 'not_found';
            }
            
            return response()->json([
                'message' => $userMessage,
                'reason' => $reason,
                'details' => 'The ALMKA Device is offline or unreachable. Settings could not be saved.',
            ], 502);
        }

        if (! $response->ok()) {
            return response()->json([
                'message' => 'ALMKA Device returned an error while saving settings',
                'status' => $response->status(),
                'body' => $response->body(),
            ], 502);
        }

        return response()->json([
            'message' => 'Sensor settings saved successfully',
            'detection_distance' => $detectionDistance,
            'vibration_intensity' => $vibrationIntensity,
        ]);
    }
}
