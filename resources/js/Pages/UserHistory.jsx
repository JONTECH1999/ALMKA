import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function UserHistory() {
    const [history, setHistory] = useState([]);
    const [locationHistory, setLocationHistory] = useState([]);
    const [videoHistory, setVideoHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [recording, setRecording] = useState(false);
    const [showSensorDetails, setShowSensorDetails] = useState(false);
    const [addressCache, setAddressCache] = useState({});
    const [playingVideo, setPlayingVideo] = useState(null); // Track which video is playing
    const [editingVideo, setEditingVideo] = useState(null); // Track which video is being edited
    const [editTitle, setEditTitle] = useState(''); // Edit form title
    const [editDuration, setEditDuration] = useState(''); // Edit form duration

    // Detect incident types based on sensor readings
    const detectIncidentType = (reading) => {
        if (!reading) return 'Normal';
        
        const distanceFront = reading.distance_front || 999;
        const distanceLeft = reading.distance_left || 999;
        const vibrationLeft = reading.vibration_left || 0;
        const vibrationRight = reading.vibration_right || 0;
        
        if (distanceFront < 30 || distanceLeft < 30) {
            return 'Obstacle Detected';
        }
        
        if (vibrationLeft > 5000 || vibrationRight > 5000) {
            return 'High Impact';
        }
        
        if (vibrationLeft > 100 || vibrationRight > 100) {
            return 'Motion Detected';
        }
        
        return 'Normal';
    };
    
    const getSeverityColor = (type) => {
        switch(type) {
            case 'Obstacle Detected':
                return 'bg-yellow-100 text-yellow-800';
            case 'High Impact':
                return 'bg-red-100 text-red-800';
            case 'Motion Detected':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const PH_TIMEZONE = 'Asia/Manila';
    const PH_LOCALE = 'en-PH';

    const formatAddress = (address) => {
        if (!address) return null;
        const parts = [
            address.house_number,
            address.road,
            address.neighbourhood,
            address.suburb,
            address.city || address.town || address.village,
            address.state,
            address.country,
        ].filter(Boolean);
        return parts.join(', ');
    };

    const parseCoordinate = (value) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const number = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(number) ? number : null;
    };

    const formatCoordinate = (value) => {
        const coord = parseCoordinate(value);
        return coord !== null ? coord.toFixed(6) : 'N/A';
    };

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

    const fetchLocationAddresses = async (records) => {
        const entries = records.slice(0, 3); // Limit to first 3 records to avoid overwhelming APIs
        for (let i = 0; i < entries.length; i++) {
            const record = entries[i];
            const lat = parseCoordinate(record.latitude);
            const lng = parseCoordinate(record.longitude);
            if (lat !== null && lng !== null) {
                const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
                if (!addressCache[key]) {
                    try {
                        await reverseGeocode(lat, lng);
                        // Add delay between requests to be respectful
                        if (i < entries.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 800));
                        }
                    } catch (err) {
                        console.error('Failed to geocode location:', err);
                    }
                }
            }
        }
    };

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/logger/history?limit=1000`);
            if (response.ok) {
                const data = await response.json();
                // The API returns data directly, not paginated
                const sortedData = (data.data || []).sort((a, b) => 
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setHistory(sortedData);
                setError(null);
                fetchLocationAddresses(sortedData);
            } else {
                setError('Failed to fetch sensor history - no data logging yet');
            }
        } catch (err) {
            setError('Failed to fetch sensor history');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationHistory = async () => {
        try {
            const response = await fetch(`/api/logger/location-history?limit=1000`);
            if (response.ok) {
                const data = await response.json();
                const sortedLocations = (data.data || []).sort((a, b) =>
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setLocationHistory(sortedLocations);
                fetchLocationAddresses(sortedLocations);
            }
        } catch (err) {
            console.error('Failed to fetch location history:', err);
        }
    };

    const fetchVideoHistory = async () => {
        try {
            const response = await fetch(`/api/logger/video-history?limit=1000`);
            if (response.ok) {
                const data = await response.json();
                const sortedVideos = (data.data || []).sort((a, b) =>
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setVideoHistory(sortedVideos);
            } else {
                setVideoError('Unable to load saved video history.');
            }
        } catch (err) {
            console.error('Failed to fetch video history:', err);
            setVideoError('Unable to load saved video history.');
        }
    };

    const recordLiveFeed = async () => {
        setRecording(true);
        setVideoError(null);

        try {
            const response = await fetch(`/api/logger/video/record`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ duration: 10, title: 'ALMKA live feed clip' }),
            });

            if (response.ok) {
                await response.json();
                await fetchVideoHistory();
            } else {
                const errorData = await response.json();
                setVideoError(errorData.message || 'Recording failed');
            }
        } catch (err) {
            console.error('Failed to record live feed:', err);
            setVideoError('Recording failed. Please check server configuration.');
        } finally {
            setRecording(false);
        }
    };

    const viewVideoClip = (video) => {
        setPlayingVideo(video);
    };

    const closeVideoPlayer = () => {
        setPlayingVideo(null);
    };

    const editVideoClip = (video) => {
        setEditingVideo(video);
        setEditTitle(video.title || '');
        setEditDuration(video.duration_seconds || '');
    };

    const cancelEdit = () => {
        setEditingVideo(null);
        setEditTitle('');
        setEditDuration('');
    };

    const saveVideoEdit = async () => {
        if (!editingVideo) return;

        try {
            const response = await fetch(`/api/logger/video/${editingVideo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    title: editTitle,
                    duration_seconds: parseInt(editDuration) || editingVideo.duration_seconds,
                }),
            });

            if (response.ok) {
                await fetchVideoHistory(); // Refresh the list
                cancelEdit();
            } else {
                const errorData = await response.json();
                setVideoError(errorData.message || 'Failed to update video');
            }
        } catch (err) {
            console.error('Failed to update video:', err);
            setVideoError('Failed to update video. Please try again.');
        }
    };

    const deleteVideoClip = async (videoId) => {
        if (!confirm('Are you sure you want to delete this video clip? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`/api/logger/video/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                await fetchVideoHistory(); // Refresh the list
            } else {
                const errorData = await response.json();
                setVideoError(errorData.message || 'Failed to delete video');
            }
        } catch (err) {
            console.error('Failed to delete video:', err);
            setVideoError('Failed to delete video. Please try again.');
        }
    };

    useEffect(() => {
        fetchHistory();
        fetchLocationHistory();
        fetchVideoHistory();
    }, []);

    const getAddressLabel = (record) => {
        if (!record) return 'No location available';

        // Check if record has a valid address from database
        if (record.address && record.address !== 'Address lookup failed' && record.address !== 'Unknown location' && record.address.trim() !== '') {
            return record.address;
        }

        // Check cache for geocoded address
        const lat = parseCoordinate(record.latitude);
        const lng = parseCoordinate(record.longitude);
        const key = lat !== null && lng !== null ? `${lat.toFixed(4)},${lng.toFixed(4)}` : null;
        if (key && addressCache[key]) {
            return addressCache[key];
        }

        // Return coordinates as fallback
        if (lat !== null && lng !== null) {
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }

        return 'No location available';
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleDateString(PH_LOCALE, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            timeZone: PH_TIMEZONE,
        });
    };

    const formatTime = (datetime) => {
        const date = new Date(datetime);
        return date.toLocaleTimeString(PH_LOCALE, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: PH_TIMEZONE,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User History
                </h2>
            }
        >
            <Head title="User History" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Hero Section */}
                    <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 shadow-2xl text-white">
                        <div>
                            <p className="text-sm uppercase tracking-widest text-blue-100 font-semibold">History & Logs</p>
                            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Incident & Gait Logs</h1>
                            <p className="mt-3 max-w-2xl text-base leading-relaxed text-blue-50">
                                Review all captured incidents, live recordings, and gait analysis data from your tracking device.
                            </p>
                        </div>
                    </section>

                    {/* Logs Table Card */}
                    <section className="rounded-3xl bg-white shadow-xl border border-blue-100 overflow-hidden">
                        <div className="p-8">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="flex items-center gap-3 text-blue-600">
                                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
                                        <span className="font-medium text-lg">Loading history data...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12 text-red-600">
                                    <p className="text-lg font-medium">{error}</p>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-12 text-blue-600">
                                    <p className="text-lg font-medium">No history records available yet</p>
                                </div>
                            ) : (
                                <>
                                    {/* Location History and Live Feed History */}
                                    <div className="mb-8 grid gap-6 lg:grid-cols-2">
                                        {/* Location History */}
                                        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
                                            <h3 className="text-lg font-bold text-blue-900 mb-4">Location History</h3>
                                            <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-2">
                                                {locationHistory.length > 0 ? locationHistory.slice(0, 25).map((record, idx) => (
                                                    <div key={record.id || idx} className="bg-white rounded-lg p-3 border border-blue-100 hover:shadow-sm transition">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-blue-600 font-semibold">{formatDate(record.recorded_at)}</p>                                                                        <p className="text-xs text-blue-500 font-medium">{formatTime(record.recorded_at)}</p>                                                                    <p className="text-sm text-blue-900 font-semibold mt-1">{getAddressLabel(record)}</p>
                                                                    {parseCoordinate(record.latitude) !== null && parseCoordinate(record.longitude) !== null && (
                                                                        <p className="text-xs text-blue-500 mt-1 font-mono">
                                                                            Lat: {formatCoordinate(record.latitude)} · Lng: {formatCoordinate(record.longitude)}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ml-2 ${getSeverityColor(detectIncidentType(record))}`}>
                                                                    {detectIncidentType(record)}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {record.latitude && record.longitude ? 'Saved every 2 minutes' : 'Address not available in this record'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="bg-white rounded-lg p-3 border border-blue-100 text-gray-700">
                                                        No location history saved yet.
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 text-center">
                                                <button
                                                    onClick={fetchLocationHistory}
                                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                                >
                                                    Retry Location History
                                                </button>
                                            </div>
                                        </div>

                                        {/* Live Feed History */}
                                        <div className="rounded-2xl bg-slate-950 border border-slate-700 p-6">
                                            <h3 className="text-lg font-semibold text-slate-100 mb-4">Live Feed History</h3>
                                            <div className="space-y-3">
                                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-200">ALMKA Blind Camera</p>
                                                            <p className="text-xs text-slate-400 mt-1">Real-time MJPEG Stream</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => window.open('http://almka.local:81/stream', '_blank')}
                                                    className="w-full px-4 py-3 bg-slate-700 text-slate-100 rounded-lg font-semibold hover:bg-slate-600 transition"
                                                >
                                                    Open Live Camera Feed
                                                </button>
                                                <button
                                                    onClick={recordLiveFeed}
                                                    disabled={recording}
                                                    className={`w-full px-4 py-3 rounded-lg font-semibold text-slate-100 transition ${recording ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}
                                                >
                                                    {recording ? 'Recording...' : 'Record Live Feed Clip'}
                                                </button>
                                                {videoError && (
                                                    <p className="text-sm text-rose-300">{videoError}</p>
                                                )}
                                                <div className="text-xs text-slate-400 mt-3 space-y-1">
                                                    <p>Total captures: <strong className="text-slate-100">{history.length}</strong></p>
                                                    <p>Saved clips: <strong className="text-slate-100">{videoHistory.length}</strong></p>
                                                    <p>Session duration: <strong className="text-slate-100">all time</strong></p>
                                                </div>
                                                {videoHistory.length > 0 && (
                                                    <div className="mt-4 max-h-72 overflow-y-auto space-y-3 pr-2">
                                                        {videoHistory.map((video) => (
                                                            <div key={video.id} className="bg-slate-900 rounded-2xl p-4 border border-slate-700 hover:border-slate-500 transition">
                                                                <div className="flex flex-col gap-3">
                                                                    <div>
                                                                        <p className="text-xs text-slate-400 font-medium">{formatDate(video.recorded_at)}</p>
                                                                        <p className="text-sm text-slate-100 font-semibold mt-1">{formatTime(video.recorded_at)}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-slate-300">{video.title || 'Live feed clip'}</p>
                                                                        <p className="text-xs text-slate-500 mt-1">Saved every {video.duration_seconds || 60}s</p>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="inline-flex items-center rounded-full bg-slate-800 text-slate-300 px-2 py-1 text-xs font-medium">Normal</span>
                                                                        <button
                                                                            onClick={() => viewVideoClip(video)}
                                                                            className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition"
                                                                        >
                                                                            View
                                                                        </button>
                                                                        <button
                                                                            onClick={() => editVideoClip(video)}
                                                                            className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => deleteVideoClip(video.id)}
                                                                            className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sensor Details Toggle */}
                                    <div className="mb-6 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <button 
                                            onClick={() => setShowSensorDetails(!showSensorDetails)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                                showSensorDetails 
                                                    ? 'bg-yellow-600 text-white' 
                                                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {showSensorDetails ? '✓ Hide' : '+ Show'} Sensor Details
                                        </button>
                                        <p className="text-sm text-yellow-800">Advanced ultrasonic sensor readings</p>
                                    </div>

                                    {showSensorDetails && (
                                        <>
                                            <h3 className="text-lg font-bold text-blue-900 mb-4">🔧 Advanced Ultrasonic Sensor Readings</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-blue-100">
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Time</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Latitude</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Longitude</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Incident Type</th>
                                                    {showSensorDetails && (
                                                        <>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Distance (cm)</th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-blue-900 uppercase tracking-wider">Vibration</th>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {history.map((reading, idx) => (
                                                    <tr 
                                                        key={reading.id}
                                                        className={`border-b border-blue-50 hover:bg-blue-50 transition ${
                                                            idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'
                                                        }`}
                                                    >
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                            {formatDate(reading.recorded_at)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">
                                                            {formatTime(reading.recorded_at)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                            {formatCoordinate(reading.latitude)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                            {formatCoordinate(reading.longitude)}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm">
                                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getSeverityColor(detectIncidentType(reading))}`}>
                                                                {detectIncidentType(reading)}
                                                            </span>
                                                        </td>
                                                        {showSensorDetails && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                                    F: {reading.distance_front || '--'}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                                    L: {reading.vibration_left || 0} | R: {reading.vibration_right || 0}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Stats Summary */}
                                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-700">
                                            Showing <strong>{history.length}</strong> sensor readings from all time
                                        </p>
                                    </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    {/* Stats Footer */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Records</p>
                            <p className="mt-2 text-3xl font-bold text-blue-900">{history.length}</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Data Range</p>
                            <p className="mt-2 text-base font-bold text-blue-900">All Time</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Status</p>
                            <p className="mt-2 text-base font-bold text-green-600">Active Tracking</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{playingVideo.title || 'Video Clip'}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Recorded: {formatDate(playingVideo.recorded_at)} {formatTime(playingVideo.recorded_at)} • 
                                    Duration: {playingVideo.duration_seconds || '--'} seconds
                                </p>
                            </div>
                            <button
                                onClick={closeVideoPlayer}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <video
                                controls
                                autoPlay
                                className="w-full rounded-lg shadow-lg"
                                src={playingVideo.video_url || playingVideo.file_path}
                                onError={(e) => {
                                    console.error('Video failed to load:', e);
                                    // Show error message if video fails to load
                                    e.target.style.display = 'none';
                                    const errorMsg = document.createElement('div');
                                    errorMsg.className = 'text-center py-8 text-red-600';
                                    errorMsg.innerHTML = `
                                        <p className="text-lg font-semibold">Video Playback Error</p>
                                        <p className="text-sm mt-2">Unable to load video clip. The file may not exist or be corrupted.</p>
                                        <p className="text-xs mt-2 text-gray-500">File: ${playingVideo.file_path}</p>
                                    `;
                                    e.target.parentNode.appendChild(errorMsg);
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Video Modal */}
            {editingVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Edit Video Clip</h3>
                            <button
                                onClick={cancelEdit}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter video title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
                                <input
                                    type="number"
                                    value={editDuration}
                                    onChange={(e) => setEditDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter duration in seconds"
                                    min="1"
                                    max="300"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={saveVideoEdit}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}