import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Use the live ALMKA Device IP by default with mDNS fallback
const DEFAULT_CAMERA_URL = 'http://10.88.109.105:81/stream';

export default function LiveMonitoring() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [cameraError, setCameraError] = useState(false);
    const [cameraUrl, setCameraUrl] = useState(DEFAULT_CAMERA_URL);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [espIp, setEspIp] = useState('10.88.109.105'); // Default ALMKA Device IP
    const [deviceInfo, setDeviceInfo] = useState(null);
    const [checkingDevice, setCheckingDevice] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // Track save status
    const [isRecording, setIsRecording] = useState(false); // Track video recording
    const [recordingStatus, setRecordingStatus] = useState(null); // Show recording messages
    const [recordingStarted, setRecordingStarted] = useState(false); // Track if recording has been started for this session
    const [watchingLocation, setWatchingLocation] = useState(false);
    const [addressCache, setAddressCache] = useState({}); // Cache for geocoded addresses
    const watchIdRef = useRef(null);
    const isRecordingRef = useRef(false);
    const streamImageRef = useRef(null);

    // Initialize camera immediately
    useEffect(() => {
        setCameraUrl(DEFAULT_CAMERA_URL);
    }, []);

    // Simple camera URL builder
    const buildCameraUrl = useCallback((ip) => {
        if (!ip) return DEFAULT_CAMERA_URL;
        const cleaned = ip.trim().replace(/\/$/, '');
        if (/^https?:\/\//.test(cleaned)) {
            return `${cleaned}:81/stream`;
        }
        return `http://${cleaned}:81/stream`;
    }, []);

    // Parse coordinate values safely
    const parseCoordinate = (value) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const number = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(number) ? number : null;
    };

    // Reverse geocoding function using Photon API
    const reverseGeocode = async (latitude, longitude) => {
        const lat = parseCoordinate(latitude);
        const lng = parseCoordinate(longitude);
        if (lat === null || lng === null) {
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        if (addressCache[key]) {
            return addressCache[key];
        }

        try {
            // Try Photon geocoding service first (more reliable than Nominatim)
            const photonUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=en`;
            const photonResponse = await fetch(photonUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'ALMKA-Blind-Monitoring/1.0',
                },
            });

            if (photonResponse.ok) {
                const photonData = await photonResponse.json();
                if (photonData && photonData.features && photonData.features.length > 0) {
                    const feature = photonData.features[0];
                    const properties = feature.properties;

                    // Build address from Photon response
                    const addressParts = [];
                    if (properties.name) addressParts.push(properties.name);
                    if (properties.street) addressParts.push(properties.street);
                    if (properties.city) addressParts.push(properties.city);
                    if (properties.state) addressParts.push(properties.state);
                    if (properties.country) addressParts.push(properties.country);

                    if (addressParts.length > 0) {
                        const addressText = addressParts.join(', ');
                        setAddressCache((prev) => ({ ...prev, [key]: addressText }));
                        return addressText;
                    }
                }
            }

            // Fallback: Try backend API
            const backendResponse = await fetch(`/api/geocode/reverse?lat=${lat}&lon=${lng}`, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (backendResponse.ok) {
                const backendData = await backendResponse.json();
                if (backendData && backendData.display_name) {
                    const addressText = backendData.display_name;
                    setAddressCache((prev) => ({ ...prev, [key]: addressText }));
                    return addressText;
                }
            }

            // Final fallback: return formatted coordinates
            const coordFallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setAddressCache((prev) => ({ ...prev, [key]: coordFallback }));
            return coordFallback;

        } catch (err) {
            console.error('Geocode error:', err);
            const coordFallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setAddressCache((prev) => ({ ...prev, [key]: coordFallback }));
            return coordFallback;
        }
    };

    // Update camera URL when ESP IP changes
    useEffect(() => {
        setCameraUrl(buildCameraUrl(espIp));
    }, [espIp, buildCameraUrl]);

    // Simple GPS - use browser geolocation only
    const startLocationWatch = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation not supported');
            setErrorDetails('Your browser does not support GPS');
            setLoading(false);
            return;
        }

        if (watchIdRef.current !== null) {
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                setError(null);
                setErrorDetails(null);
                setLoading(false);

                // Get address using the improved geocoding function
                const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);

                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    created_at: new Date().toISOString(),
                    address,
                });
            },
            (err) => {
                setError('GPS not available');
                setErrorDetails('Enable location permission in browser settings');
                setLoading(false);
                console.error('Location watch error:', err);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 1000,
                timeout: 10000,
            }
        );

        watchIdRef.current = watchId;
        setWatchingLocation(true);
    }, []);

    const stopLocationWatch = useCallback(() => {
        if (watchIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            setWatchingLocation(false);
        }
    }, []);

    const saveLocationToDatabase = useCallback(async () => {
        console.log('Attempting to save location to database...');
        console.log('Current location:', location);

        if (location && location.latitude && location.longitude) {
            try {
                console.log('Making API call to save location...');
                const response = await fetch('/api/location/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        address: location.address,
                    }),
                });

                if (response.ok) {
                    console.log('Location saved to database successfully');
                    const result = await response.json();
                    console.log('API response:', result);
                    setSaveStatus({ type: 'success', message: '✓ Location saved successfully' });
                    setTimeout(() => setSaveStatus(null), 3000);
                } else {
                    console.error('Failed to save location to database:', response.status, response.statusText);
                    setSaveStatus({ type: 'error', message: `Failed to save: ${response.status}` });
                    setTimeout(() => setSaveStatus(null), 3000);
                }
            } catch (err) {
                console.error('Error saving location to database:', err);
                setSaveStatus({ type: 'error', message: `Error: ${err.message}` });
                setTimeout(() => setSaveStatus(null), 3000);
            }
        } else {
            console.log('Location not available, skipping save');
            setSaveStatus({ type: 'warning', message: 'Location not available yet' });
            setTimeout(() => setSaveStatus(null), 3000);
        }
    }, [location]);

    // Start location watch on mount and save every 2 seconds
    useEffect(() => {
        startLocationWatch();

        const interval = setInterval(() => {
            saveLocationToDatabase();
        }, 120000); // 2 minutes

        const initialSaveTimeout = setTimeout(() => {
            saveLocationToDatabase();
        }, 120000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialSaveTimeout);
            stopLocationWatch();
        };
    }, [saveLocationToDatabase, startLocationWatch, stopLocationWatch]);

    // Record 1-minute video clip when stream starts
    const recordVideoClip = useCallback(async (duration = 60) => {
        console.log(`Starting ${duration}-second video recording...`);
        setIsRecording(true);
        setRecordingStatus({ type: 'recording', message: `🔴 Recording video... (${duration} seconds)` });

        try {
            const response = await fetch('/api/logger/video/record', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    duration,
                    title: `Auto recording - ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Video recorded successfully:', result);
                setRecordingStatus({ type: 'success', message: '✓ Video saved to database' });
                setTimeout(() => setRecordingStatus(null), 3000);
            } else {
                console.error('Failed to record video:', response.status);
                setRecordingStatus({ type: 'error', message: `Failed to save video (${response.status})` });
                setTimeout(() => setRecordingStatus(null), 3000);
            }
        } catch (err) {
            console.error('Error recording video:', err);
            setRecordingStatus({ type: 'error', message: `Recording error: ${err.message}` });
            setTimeout(() => setRecordingStatus(null), 3000);
        } finally {
            setIsRecording(false);
        }
    }, []);

    // Auto-record a short clip every 2 minutes when stream starts
    useEffect(() => {
        if (!recordingStarted) return;

        console.log('Starting auto video recording every 2 minutes...');
        const interval = setInterval(() => {
            if (!isRecordingRef.current) {
                recordVideoClip(2);
            }
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, [recordingStarted, recordVideoClip]);

    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    // Check device connectivity and camera status
    const checkDeviceDiagnostics = useCallback(async () => {
        if (!espIp || espIp.trim() === '') return;
        setCheckingDevice(true);
        setDeviceInfo(null);

        const baseUrl = `http://${espIp.trim()}:81`;

        try {
            // First check if device is reachable
            const statusResponse = await fetch(`${baseUrl}/status`, { timeout: 3000 });

            if (statusResponse.ok) {
                // Device is reachable, now check camera stream
                try {
                    const streamResponse = await fetch(`${baseUrl}/stream`, { timeout: 2000 });
                    const cameraWorking = streamResponse.ok;

                    setDeviceInfo({
                        status: 'connected',
                        cameraReady: cameraWorking,
                        message: `✓ Device connected at ${espIp}${cameraWorking ? ' - Camera streaming' : ' - Camera offline'}`,
                    });
                } catch (streamErr) {
                    // Device reachable but camera not working
                    setDeviceInfo({
                        status: 'connected',
                        cameraReady: false,
                        message: `✓ Device connected at ${espIp} - Camera not responding`,
                    });
                }
            } else {
                setDeviceInfo({
                    status: 'error',
                    cameraReady: false,
                    message: `Device returned error (${statusResponse.status})`,
                });
            }
        } catch (err) {
            setDeviceInfo({
                status: 'unreachable',
                cameraReady: false,
                message: `Cannot reach device at ${espIp}. Check: 1) Device powered on? 2) Same WiFi network? 3) Correct IP/hostname?`,
            });
        } finally {
            setCheckingDevice(false);
        }
    }, [espIp]);

    useEffect(() => {
        checkDeviceDiagnostics();

        // Check device status every 30 seconds
        const deviceCheckInterval = setInterval(() => {
            checkDeviceDiagnostics();
        }, 30000);

        return () => clearInterval(deviceCheckInterval);
    }, [checkDeviceDiagnostics]);

    const cameraSrc = useMemo(() => {
        return cameraUrl;
    }, [cameraUrl]);

    const statusText = loading ? 'Loading' : location ? 'Active' : 'Unavailable';
    const cameraStatusText = cameraError ? 'Offline' : 'Streaming';

    const metricCards = [
        {
            label: 'GPS Status',
            value: statusText,
            description: loading ? 'Waiting for location' : location ? 'Position found' : 'No GPS',
        },
        {
            label: 'Camera Status',
            value: cameraStatusText,
            description: cameraError ? 'Check device connection' : 'Stream active',
        },
        {
            label: 'Latitude',
            value: location ? location.latitude.toFixed(6) : '--',
            description: 'Current position',
        },
        {
            label: 'Longitude',
            value: location ? location.longitude.toFixed(6) : '--',
            description: 'Current position',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Live Monitoring
                </h2>
            }
        >
            <Head title="Live Monitoring" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Hero Section */}
                    <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 shadow-2xl text-white">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-widest text-blue-100 font-semibold">Live Telemetry</p>
                                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Monitoring Hub</h1>
                                <p className="mt-3 max-w-2xl text-base leading-relaxed text-blue-50">
                                    Real-time GPS tracking and camera stream monitoring. Auto-refresh every 5 seconds.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoading(true);
                                        stopLocationWatch();
                                        startLocationWatch();
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-white text-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-50 shadow-lg"
                                >
                                    Refresh GPS
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        saveLocationToDatabase();
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-blue-400 text-white px-6 py-3 text-sm font-semibold transition hover:bg-blue-300 shadow-lg"
                                >
                                    Save Location Now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCameraError(false);
                                        setCameraUrl(buildCameraUrl(espIp));
                                    }}
                                    className="inline-flex items-center justify-center rounded-xl bg-blue-400 text-white px-6 py-3 text-sm font-semibold transition hover:bg-blue-300 shadow-lg"
                                >
                                    Refresh Camera
                                </button>
                            </div>
                        </div>

                        {/* Metrics Cards */}
                        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {metricCards.map((card) => (
                                <div key={card.label} className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 hover:bg-white/15 transition">
                                    <p className="text-sm font-medium text-blue-100">{card.label}</p>
                                    <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-blue-100">{card.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Save Status Notification */}
                    {saveStatus && (
                        <div className={`rounded-2xl p-4 shadow-lg animate-slide-in ${
                            saveStatus.type === 'success' ? 'bg-green-100 border border-green-400' :
                            saveStatus.type === 'error' ? 'bg-red-100 border border-red-400' :
                            'bg-yellow-100 border border-yellow-400'
                        }`}>
                            <p className={`font-semibold ${
                                saveStatus.type === 'success' ? 'text-green-800' :
                                saveStatus.type === 'error' ? 'text-red-800' :
                                'text-yellow-800'
                            }`}>
                                {saveStatus.message}
                            </p>
                        </div>
                    )}

                    {/* Recording Status Notification */}
                    {recordingStatus && (
                        <div className={`rounded-2xl p-4 shadow-lg animate-pulse ${
                            recordingStatus.type === 'recording' ? 'bg-red-100 border border-red-400' :
                            recordingStatus.type === 'success' ? 'bg-green-100 border border-green-400' :
                            'bg-red-100 border border-red-400'
                        }`}>
                            <p className={`font-semibold ${
                                recordingStatus.type === 'recording' ? 'text-red-800' :
                                recordingStatus.type === 'success' ? 'text-green-800' :
                                'text-red-800'
                            }`}>
                                {recordingStatus.message}
                            </p>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* GPS Location Card */}
                        <section className="rounded-3xl bg-white p-8 shadow-xl border border-blue-100">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900">GPS Location</h2>
                                    <p className="mt-1 text-sm text-blue-600">Live coordinates from tracking device</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-2">
                                        <span className="text-xs font-semibold text-blue-700">
                                            {location ? 'Position Acquired' : loading ? 'Loading...' : 'No Data'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50 shadow-md" style={{ height: '400px' }}>
                                {loading ? (
                                    <div className="flex h-full items-center justify-center bg-blue-50">
                                        <div className="flex items-center gap-3 text-blue-600">
                                            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-300 border-t-blue-600"></div>
                                            <span className="font-medium">Loading map...</span>
                                        </div>
                                    </div>
                                ) : error ? (
                                    <div className="flex h-full items-center justify-center bg-red-50 text-center px-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-center">
                                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                                    <span className="text-2xl">⚠️</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-red-800">{error}</p>
                                                <p className="text-sm text-red-600 mt-2">{errorDetails}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLoading(true);
                                                    stopLocationWatch();
                                                    startLocationWatch();
                                                }}
                                                className="mt-3 inline-flex items-center justify-center rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                ) : location ? (
                                    <MapContainer
                                        key={`${location.latitude}-${location.longitude}-${location.source || 'unknown'}`}
                                        center={[location.latitude, location.longitude]}
                                        zoom={15}
                                        style={{ height: '100%', width: '100%' }}
                                        className="rounded-2xl"
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={[location.latitude, location.longitude]}>
                                            <Popup>
                                                Current Location<br />Lat: {location.latitude}<br />Lng: {location.longitude}<br />Address: {location.address}
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-gray-500">
                                        No location data available
                                    </div>
                                )}
                            </div>

                            {/* Coordinates Info */}
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Latitude</p>
                                    <p className="mt-2 text-xl font-bold text-blue-900">
                                        {location ? location.latitude.toFixed(6) : '--'}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Longitude</p>
                                    <p className="mt-2 text-xl font-bold text-blue-900">
                                        {location ? location.longitude.toFixed(6) : '--'}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 sm:col-span-2">
                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Address</p>
                                    <p className="mt-2 text-base font-semibold text-blue-900">
                                        {location ? location.address : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Camera Stream Card */}
                        <section className="rounded-3xl bg-white p-8 shadow-xl border border-blue-100">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-900">Live Camera Stream</h2>
                                <p className="mt-1 text-sm text-blue-600">ALMKA Device direct connection</p>
                                </div>
                                <div className="inline-flex items-center rounded-lg bg-blue-100 px-4 py-2">
                                    <span className="text-xs font-semibold text-blue-700">
                                        {cameraError ? 'Offline' : 'Streaming'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative  overflow-hidden rounded-3xl border-2 border-blue-200 bg-blue-900 shadow-md">
                                {cameraError ? (
                                    <div className="flex h-72 items-center justify-center px-4 text-center">
                                        <div className="text-blue-200">
                                            <p className="text-sm font-medium">Unable to load camera stream</p>
                                            <p className="text-xs mt-1">Make sure:</p>
                                            <ul className="text-xs mt-2 text-left">
                                                <li>✓ ALMKA Device is powered on</li>
                                                <li>✓ Same WiFi network (e.g., "SM")</li>
                                                <li>✓ Correct IP/hostname ({espIp})</li>
                                            </ul>
                                            <button 
                                                onClick={() => setCameraError(false)}
                                                className="mt-3 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold tracking-widest">LIVE</span>
                                        </div>
                                        <img
                                            ref={streamImageRef}
                                            src={cameraSrc}
                                            alt="ALMKA Device camera stream"
                                            className="h-96 w-full object-cover"
                                            style={{ transform: 'rotate(180deg) scaleY(-1)' }}
                                            crossOrigin="anonymous"
                                            onLoad={() => {
                                                setCameraError(false);
                                                // Start auto-saving live stream when stream loads
                                                if (!recordingStarted) {
                                                    setRecordingStarted(true);
                                                    recordVideoClip(2);
                                                }
                                            }}
                                            onError={(e) => {
                                                const img = e.target;
                                                // Try port 80 fallback if port 81 fails
                                                if (img.src.includes(':81')) {
                                                    img.src = img.src.replace(':81', '');
                                                } else {
                                                    setCameraError(true);
                                                }
                                            }}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
                                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Status</p>
                                    <p className="mt-2 text-sm text-yellow-800">Live streaming active</p>
                                </div>
                                <div className="rounded-2xl bg-green-50 border border-green-200 p-4">
                                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Connection</p>
                                    <p className="mt-2 text-sm text-green-800">
                                        Direct ALMKA Device connection
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">ALMKA Device Status</p>
                                    <button
                                        onClick={checkDeviceDiagnostics}
                                        disabled={checkingDevice}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:bg-blue-400"
                                    >
                                        {checkingDevice ? 'Checking...' : 'Refresh'}
                                    </button>
                                </div>
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    {deviceInfo ? (
                                        <>
                                            ALMKA Device - WiFi connected! IP Address: {espIp}<br />
                                            mDNS started: http://almka.local<br />
                                            {deviceInfo.cameraReady ? 'Camera: Ready and streaming!' : 'Camera: Offline - Check connection'}
                                        </>
                                    ) : checkingDevice ? (
                                        <>
                                            Checking device status...<br />
                                            Camera: Status checking...
                                        </>
                                    ) : (
                                        <>
                                            Device status unknown<br />
                                            Camera: Not available
                                        </>
                                    )}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
