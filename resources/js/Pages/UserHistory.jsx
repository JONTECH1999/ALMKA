import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

// Professional Modal Component
const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger', onConfirm, onCancel, loading = false }) => {
    if (!isOpen) return null;

    const variantClasses = {
        danger: {
            button: 'bg-red-600 hover:bg-red-700 text-white',
            icon: 'bg-red-100 text-red-600',
            header: 'text-red-900',
        },
        success: {
            button: 'bg-green-600 hover:bg-green-700 text-white',
            icon: 'bg-green-100 text-green-600',
            header: 'text-green-900',
        },
        info: {
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            icon: 'bg-blue-100 text-blue-600',
            header: 'text-blue-900',
        },
    };

    const colors = variantClasses[variant] || variantClasses.info;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-scale-in">
                {/* Header */}
                <div className="flex items-start gap-4 p-6 border-b border-gray-100">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.icon}`}>
                        {variant === 'danger' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {variant === 'success' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {variant === 'info' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold ${colors.header}`}>{title}</h3>
                    </div>
                </div>

                {/* Message */}
                <div className="px-6 py-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-6 py-2 text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${colors.button}`}
                    >
                        {loading && <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>}
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes scale-in {
                    from {
                        transform: scale(0.95) translateY(-10px);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
                .animate-scale-in {
                    animation: scale-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// Mock/Temporary Data for Offline Demo
const MOCK_SENSOR_READINGS = [
    { id: 1, device_id: 'almka-blind-001', latitude: 14.77258677, longitude: 121.07891164, altitude: 15.5, satellites: 12, distance_left: 45, distance_front: 120, distance_right: 95, vibration_left: 250, vibration_front: 180, vibration_right: 200, battery_level: 85, temperature: 28.5, recorded_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, device_id: 'almka-blind-001', latitude: 14.77254992, longitude: 121.07886155, altitude: 16.2, satellites: 11, distance_left: 65, distance_front: 135, distance_right: 75, vibration_left: 180, vibration_front: 150, vibration_right: 170, battery_level: 84, temperature: 28.3, recorded_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, device_id: 'almka-blind-001', latitude: 14.77251234, longitude: 121.07883421, altitude: 14.8, satellites: 13, distance_left: 55, distance_front: 110, distance_right: 85, vibration_left: 200, vibration_front: 160, vibration_right: 190, battery_level: 83, temperature: 28.1, recorded_at: new Date(Date.now() - 10800000).toISOString() },
];

const MOCK_LOCATION_HISTORY = [
    { id: 1, device_id: 'almka-blind-001', latitude: 14.65044, longitude: 121.04129, altitude: 45.0, satellites: 14, address: 'Immaculada Concepcion College, Soldiers Hills III, Caloocan, 1400 Metro Manila', recorded_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, device_id: 'almka-blind-001', latitude: 14.65042, longitude: 121.04131, altitude: 45.2, satellites: 12, address: 'Immaculada Concepcion College, Soldiers Hills III, Caloocan, 1400 Metro Manila', recorded_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, device_id: 'almka-blind-001', latitude: 14.65046, longitude: 121.04127, altitude: 44.8, satellites: 13, address: 'Immaculada Concepcion College, Soldiers Hills III, Caloocan, 1400 Metro Manila', recorded_at: new Date(Date.now() - 5400000).toISOString() },
];

const MOCK_VIDEO_RECORDINGS = [
    { id: 1, device_id: 'almka-blind-001', title: 'Demo Recording - Morning Session', file_path: 'video-recordings/demo_001.mp4', video_url: '#', duration_seconds: 180, status: 'ready', recorded_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 2, device_id: 'almka-blind-001', title: 'Demo Recording - Navigation Test', file_path: 'video-recordings/demo_002.mp4', video_url: '#', duration_seconds: 120, status: 'ready', recorded_at: new Date(Date.now() - 5400000).toISOString() },
    { id: 3, device_id: 'almka-blind-001', title: 'Demo Recording - Obstacle Detection', file_path: 'video-recordings/demo_003.mp4', video_url: '#', duration_seconds: 240, status: 'ready', recorded_at: new Date(Date.now() - 9000000).toISOString() },
];

export default function UserHistory() {
    const [history, setHistory] = useState([]);
    const [locationHistory, setLocationHistory] = useState([]);
    const [videoHistory, setVideoHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [videoError, setVideoError] = useState(null);
    const [recording, setRecording] = useState(false);
    const [showSensorDetails, setShowSensorDetails] = useState(false);
    const [addressCache, setAddressCache] = useState({});
    const [playingVideo, setPlayingVideo] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDuration, setEditDuration] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);
    
    // Modal state management
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'info', // 'danger', 'success', 'info'
        loading: false,
        onConfirm: null,
        onCancel: null,
    });

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

    // Modal helper functions
    const openModal = (config) => {
        setModal({
            isOpen: true,
            title: config.title || 'Confirm Action',
            message: config.message || '',
            confirmText: config.confirmText || 'Confirm',
            cancelText: config.cancelText || 'Cancel',
            variant: config.variant || 'info',
            loading: false,
            onConfirm: config.onConfirm,
            onCancel: config.onCancel,
        });
    };

    const closeModal = () => {
        setModal({
            ...modal,
            isOpen: false,
            loading: false,
        });
    };

    const handleModalConfirm = async () => {
        setModal(prev => ({ ...prev, loading: true }));
        if (modal.onConfirm) {
            await modal.onConfirm();
        }
        closeModal();
    };

    const handleModalCancel = () => {
        if (modal.onCancel) {
            modal.onCancel();
        }
        closeModal();
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

    // Static address cache - hardcoded addresses for specific locations
    const staticAddressCache = {
        '14.772593,121.078935': 'Sitio Pag-asa, Caloocan City, Metro Manila, Philippines',
    };

    const reverseGeocode = async (latitude, longitude) => {
        const lat = parseCoordinate(latitude);
        const lng = parseCoordinate(longitude);
        if (lat === null || lng === null) {
            return 'Unknown location';
        }

        const key = `${lat},${lng}`;
        
        // Check state cache first
        if (addressCache[key]) {
            return addressCache[key];
        }

        // Check static cache
        if (staticAddressCache[key]) {
            const cachedAddress = staticAddressCache[key];
            setAddressCache((prev) => ({ ...prev, [key]: cachedAddress }));
            return cachedAddress;
        }

        // Check nearby in static cache (within ~0.001 degrees ≈ 100 meters)
        for (const [staticKey, staticAddress] of Object.entries(staticAddressCache)) {
            const [cacheLat, cacheLon] = staticKey.split(',').map(Number);
            const latDiff = Math.abs(cacheLat - lat);
            const lonDiff = Math.abs(cacheLon - lng);
            if (latDiff < 0.001 && lonDiff < 0.001) {
                setAddressCache((prev) => ({ ...prev, [key]: staticAddress }));
                return staticAddress;
            }
        }

        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                return 'Unknown location';
            }

            const data = await response.json();
            const addressText = formatAddress(data.address) || 'Unknown location';
            setAddressCache((prev) => ({ ...prev, [key]: addressText }));
            return addressText;
        } catch (err) {
            console.error('Geocode error:', err);
            return 'Unknown location';
        }
    };

    const fetchLocationAddresses = async (records) => {
        const entries = records.slice(0, 10);
        for (const record of entries) {
            const lat = parseCoordinate(record.latitude);
            const lng = parseCoordinate(record.longitude);
            if (lat !== null && lng !== null) {
                const key = `${lat},${lng}`;
                if (!addressCache[key]) {
                    await reverseGeocode(lat, lng);
                }
            }
        }
    };

    const fetchHistory = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/logger/history?hours=24&limit=500`);
            if (response.ok) {
                const data = await response.json();
                const sortedData = (data.data || []).sort((a, b) => 
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setHistory(sortedData);
                setError(null);
                setIsDemoMode(false);
                fetchLocationAddresses(sortedData);
            } else {
                setError('Failed to load sensor data');
                setHistory([]);
            }
        } catch (err) {
            setError('Unable to connect to server. Please check your connection.');
            setHistory([]);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLocationHistory = async () => {
        try {
            const response = await fetch(`/api/logger/location-history?hours=24&limit=100`);
            if (response.ok) {
                const data = await response.json();
                console.log('Location history API response:', data);
                const sortedLocations = (data.data || []).sort((a, b) =>
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setLocationHistory(sortedLocations);
                setLocationError(null);
                fetchLocationAddresses(sortedLocations);
            } else {
                const errorData = await response.text();
                console.error('Location API error:', errorData);
                setLocationError(`API Error: ${response.status}`);
                setLocationHistory([]);
            }
        } catch (err) {
            console.error('Failed to fetch location history:', err);
            setLocationError(`Connection error: ${err.message}`);
            setLocationHistory([]);
        }
    };

    const fetchVideoHistory = async () => {
        try {
            const response = await fetch(`/api/logger/video-history?hours=24&limit=100`);
            if (response.ok) {
                const data = await response.json();
                console.log('Video history API response:', data);
                const sortedVideos = (data.data || []).sort((a, b) =>
                    new Date(b.recorded_at) - new Date(a.recorded_at)
                );
                setVideoHistory(sortedVideos);
                setVideoError(null);
            } else {
                const errorData = await response.text();
                console.error('Video API error:', errorData);
                setVideoError(`API Error: ${response.status}`);
                setVideoHistory([]);
            }
        } catch (err) {
            console.error('Failed to fetch video history:', err);
            setVideoError(`Connection error: ${err.message}`);
            setVideoHistory([]);
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

    const deleteLocationRecord = (locationId) => {
        openModal({
            title: 'Delete Location Record',
            message: 'Are you sure you want to delete this location record? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const response = await fetch(`/api/logger/location/${locationId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                    });

                    if (response.ok) {
                        console.log(`✓ Location record ${locationId} deleted`);
                        await fetchLocationHistory();
                    } else {
                        const errorData = await response.text();
                        console.error('Delete error:', errorData);
                        setLocationError(`Failed to delete: ${response.status}`);
                    }
                } catch (err) {
                    console.error('Failed to delete location record:', err);
                    setLocationError(`Delete failed: ${err.message}`);
                }
            },
        });
    };

    const deleteVideoClip = (videoId) => {
        openModal({
            title: 'Delete Video Clip',
            message: 'Are you sure you want to delete this video clip? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const response = await fetch(`/api/logger/video/${videoId}`, {
                        method: 'DELETE',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                    });

                    if (response.ok) {
                        console.log(`✓ Video ${videoId} deleted`);
                        await fetchVideoHistory();
                    } else {
                        const errorData = await response.text();
                        console.error('Delete error:', errorData);
                        setVideoError(`Failed to delete: ${response.status}`);
                    }
                } catch (err) {
                    console.error('Failed to delete video:', err);
                    setVideoError(`Delete failed: ${err.message}`);
                }
            },
        });
    };

    useEffect(() => {
        console.log('🚀 UserHistory component mounted');
        fetchHistory();
        fetchLocationHistory();
        fetchVideoHistory();

        // Auto-refresh data every 5 minutes
        const refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing data...');
            fetchHistory();
            fetchLocationHistory();
            fetchVideoHistory();
        }, 300000); // 5 minutes

        return () => clearInterval(refreshInterval);
    }, []);

    const getAddressLabel = (record) => {
        if (!record) return 'No location available';
        if (record.address) return record.address;

        const lat = parseCoordinate(record.latitude);
        const lng = parseCoordinate(record.longitude);
        const key = lat !== null && lng !== null ? `${lat},${lng}` : null;
        if (key && addressCache[key]) {
            return addressCache[key];
        }

        if (lat !== null && lng !== null) {
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
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
            hour12: false,
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
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-widest text-blue-100 font-semibold">History & Logs</p>
                                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">Incident & Gait Logs</h1>
                                <p className="mt-3 max-w-2xl text-base leading-relaxed text-blue-50">
                                    Review all captured incidents, live recordings, and gait analysis data from your tracking device.
                                </p>
                            </div>
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
                            ) : (
                                <>
                                    {/* Location History and Live Feed History */}
                                    <div className="mb-8 grid gap-6 lg:grid-cols-2">
                                        {/* Location History */}
                                        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
                                            <h3 className="text-lg font-bold text-blue-900 mb-4">Location History</h3>
                                            {locationError && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-700">{locationError}</p>
                                                </div>
                                            )}
                                            <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-2">
                                                {locationHistory.length > 0 ? locationHistory.map((record, idx) => (
                                                    <div key={record.id || idx} className="bg-white rounded-lg p-3 border border-blue-100 hover:shadow-sm transition">
                                                        <div className="flex flex-col gap-2">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-blue-600 font-semibold">{formatDate(record.recorded_at)} · {formatTime(record.recorded_at)}</p>
                                                                    <p className="text-sm text-blue-900 font-semibold mt-1">{getAddressLabel(record)}</p>
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
                                                                {record.latitude && record.longitude ? 'Saved every 3 minutes' : 'Address not available in this record'}
                                                            </p>
                                                            <div className="flex gap-2 pt-2">
                                                                <button
                                                                    onClick={() => deleteLocationRecord(record.id)}
                                                                    className="flex-1 px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded transition border border-red-200"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="bg-white rounded-lg p-3 border border-blue-100 text-gray-700">
                                                        <p className="text-sm">No location history saved yet.</p>
                                                        <p className="text-xs text-gray-500 mt-1">Check your device connection or wait for location data.</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 flex gap-2 justify-center">
                                                <button
                                                    onClick={fetchLocationHistory}
                                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                                                >
                                                    ↻ Refresh Location Data
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
                                                    <div className="p-3 bg-rose-950 border border-rose-700 rounded-lg">
                                                        <p className="text-sm text-rose-300">{videoError}</p>
                                                    </div>
                                                )}
                                                <div className="text-xs text-slate-400 mt-3 space-y-1">
                                                    <p>Total captures: <strong className="text-slate-100">{history.length}</strong></p>
                                                    <p>Saved clips: <strong className="text-slate-100">{videoHistory.length}</strong></p>
                                                    <p>Session duration: <strong className="text-slate-100">last 24 hours</strong></p>
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
                                                                        <p className="text-xs text-slate-500 mt-1">Saved every 3 minutes</p>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <button
                                                                            onClick={() => viewVideoClip(video)}
                                                                            className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-600 transition"
                                                                        >
                                                                            View
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
                                    {history.length > 0 && (
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
                                    )}

                                    {history.length > 0 && showSensorDetails && (
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
                                            Showing <strong>{history.length}</strong> sensor readings from the last 24 hours
                                        </p>
                                    </div>
                                        </>
                                    )}

                                    {history.length === 0 && (
                                        <div className="text-center py-8 text-blue-600">
                                            <p className="text-lg font-medium">No sensor readings available yet</p>
                                            <p className="text-sm text-blue-500 mt-2">Location history and video recordings are displayed below</p>
                                        </div>
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
                            <p className="mt-2 text-base font-bold text-blue-900">Last 24 Hours</p>
                        </div>
                        <div className="rounded-2xl bg-white border border-blue-100 p-6 shadow-sm hover:shadow-md transition">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Status</p>
                            <p className="mt-2 text-base font-bold text-green-600">Active Tracking</p>
                        </div>
                    </div>

                    {/* Debug Panel */}
                    <details className="rounded-2xl bg-gray-900 border border-gray-700 p-4 text-gray-100 text-xs font-mono">
                        <summary className="cursor-pointer mb-3 text-blue-300 hover:text-blue-200">🔧 Debug Info</summary>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            <div><span className="text-green-400">Sensor Readings:</span> {history.length} records</div>
                            <div><span className="text-green-400">Location History:</span> {locationHistory.length} records</div>
                            <div><span className="text-green-400">Video History:</span> {videoHistory.length} records</div>
                            {locationError && <div><span className="text-red-400">Location Error:</span> {locationError}</div>}
                            {videoError && <div><span className="text-red-400">Video Error:</span> {videoError}</div>}
                            <div className="pt-2 border-t border-gray-700">
                                <p className="text-gray-400">Check browser console (F12) for detailed logs</p>
                            </div>
                        </div>
                    </details>
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

            {/* Professional Confirmation Modal */}
            <ConfirmModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                variant={modal.variant}
                loading={modal.loading}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </AuthenticatedLayout>
    );
}