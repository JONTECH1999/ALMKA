<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class LocationController extends Controller
{
    // POST /api/location - Store GPS data from ALMKA Device
    public function store(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $location = Location::create($request->only(['latitude', 'longitude']));

        return response()->json(['message' => 'Location stored successfully', 'location' => $location], 201);
    }

    // GET /api/location - Get latest location
    public function latest()
    {
        $location = Location::latest()->first();

        if (!$location) {
            return response()->json(['message' => 'No locations found'], 404);
        }

        return response()->json($location);
    }

    // GET /api/history - Get all locations with pagination
    public function history(Request $request)
    {
        $locations = Location::orderBy('created_at', 'desc')->paginate(20);

        return response()->json($locations);
    }

    // GET /api/geocode/reverse - Reverse geocoding proxy to avoid CORS
    public function reverseGeocode(Request $request)
    {
        $lat = $request->query('lat');
        $lon = $request->query('lon');

        if (!$lat || !$lon) {
            return response()->json(['error' => 'Latitude and longitude are required'], 400);
        }

        // Create cache key for this location
        $cacheKey = "geocode_{$lat}_{$lon}";

        // Check cache first (cache for 1 hour)
        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json($cached);
        }

        try {
            $response = Http::timeout(10)->get('https://nominatim.openstreetmap.org/reverse', [
                'format' => 'json',
                'lat' => $lat,
                'lon' => $lon,
                'zoom' => 18,
                'addressdetails' => 1,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // Cache the result for 1 hour
                Cache::put($cacheKey, $data, 3600);

                return response()->json($data);
            } else {
                return response()->json(['error' => 'Geocoding service unavailable'], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Geocoding request failed'], 500);
        }
    }
}
