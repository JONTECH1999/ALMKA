import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [deviceStatus, setDeviceStatus] = useState('Checking...');
    const [latestUpdate, setLatestUpdate] = useState('Loading...');
    const [sensorReadingsCount, setSensorReadingsCount] = useState(0);
    const [videoRecordingsCount, setVideoRecordingsCount] = useState(0);
    const [locationHistoryCount, setLocationHistoryCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    // Check device connectivity
    const checkDeviceStatus = async () => {
        try {
            const response = await fetch('/api/almka-device/ip');
            if (response.ok) {
                const data = await response.json();
                setDeviceStatus('Online');
            } else {
                setDeviceStatus('Offline');
            }
        } catch (err) {
            setDeviceStatus('Offline');
        }
    };

    // Get latest sensor reading timestamp
    const getLatestUpdate = async () => {
        try {
            const response = await fetch('/api/logger/history?hours=24&limit=1');
            if (response.ok) {
                const data = await response.json();
                if (data.data && data.data.length > 0) {
                    const latest = new Date(data.data[0].recorded_at);
                    const now = new Date();
                    const diffMinutes = Math.floor((now - latest) / (1000 * 60));

                    if (diffMinutes < 1) {
                        setLatestUpdate('Just now');
                    } else if (diffMinutes === 1) {
                        setLatestUpdate('1 minute ago');
                    } else if (diffMinutes < 60) {
                        setLatestUpdate(`${diffMinutes} minutes ago`);
                    } else {
                        const diffHours = Math.floor(diffMinutes / 60);
                        setLatestUpdate(`${diffHours} hour${diffHours > 1 ? 's' : ''} ago`);
                    }
                } else {
                    setLatestUpdate('No recent data');
                }
            }
        } catch (err) {
            setLatestUpdate('Unable to check');
        }
    };

    // Get data counts
    const getDataCounts = async () => {
        try {
            // Get sensor readings count
            const sensorResponse = await fetch('/api/logger/history?hours=24&limit=1000');
            if (sensorResponse.ok) {
                const sensorData = await sensorResponse.json();
                setSensorReadingsCount(sensorData.total_readings || 0);
            }

            // Get location history count
            const locationResponse = await fetch('/api/logger/location-history?hours=24&limit=1000');
            if (locationResponse.ok) {
                const locationData = await locationResponse.json();
                setLocationHistoryCount(locationData.total_locations || 0);
            }

            // Get video recordings count
            const videoResponse = await fetch('/api/logger/video-history?hours=24&limit=1000');
            if (videoResponse.ok) {
                const videoData = await videoResponse.json();
                setVideoRecordingsCount(videoData.data ? videoData.data.length : 0);
            }
        } catch (err) {
            console.error('Error fetching data counts:', err);
        }
    };

    // Refresh all data
    const refreshData = async () => {
        setIsLoading(true);
        await Promise.all([
            checkDeviceStatus(),
            getLatestUpdate(),
            getDataCounts()
        ]);
        setIsLoading(false);
        setLastRefresh(new Date());
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        refreshData();

        const interval = setInterval(() => {
            refreshData();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Hero Section */}
                    <section className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 shadow-2xl text-white">
                        <div className="sm:flex sm:items-center sm:justify-between gap-6">
                            <div className="max-w-2xl">
                                <p className="text-xs uppercase tracking-[0.32em] text-blue-100 font-semibold">Control Center</p>
                                <h1 className="mt-4 text-4xl font-semibold tracking-tight">ALMKA Monitoring Dashboard</h1>
                                <p className="mt-4 text-sm leading-7 text-blue-100">
                                    Real-time device health, live stream status, and quick access to monitoring data. Auto-updates every 30 seconds.
                                </p>
                                <div className="mt-4 flex items-center gap-3">
                                    <button
                                        onClick={refreshData}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                                    >
                                        {isLoading ? '⟳' : '🔄'} Refresh
                                    </button>
                                    <span className="text-xs text-blue-200">Last updated: {lastRefresh.toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className="rounded-3xl bg-white/20 p-6 shadow-inner border border-white/30">
                                <p className="text-xs uppercase tracking-[0.3em] text-blue-100">Live Monitoring</p>
                                <p className="mt-3 text-3xl font-bold text-white">Active</p>
                                <p className="mt-2 text-sm text-blue-100">Real-time data streaming enabled.</p>
                            </div>
                        </div>
                    </section>

                    {/* Summary Cards */}
                    <div className="grid gap-4 xl:grid-cols-3">
                        <div className="rounded-3xl bg-white border border-blue-200 p-6 shadow-sm">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Live Device</p>
                            <p className={`mt-4 text-3xl font-semibold ${deviceStatus === 'Online' ? 'text-green-600' : deviceStatus === 'Offline' ? 'text-red-600' : 'text-yellow-600'}`}>
                                {isLoading ? '...' : deviceStatus}
                            </p>
                            <p className="mt-2 text-sm text-blue-600">
                                {deviceStatus === 'Online' ? 'ALMKA Device camera and GPS connected.' : deviceStatus === 'Offline' ? 'Device currently offline or unreachable.' : 'Checking device status...'}
                            </p>
                        </div>
                        <div className="rounded-3xl bg-white border border-blue-200 p-6 shadow-sm">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Latest Update</p>
                            <p className="mt-4 text-3xl font-semibold text-blue-900">{isLoading ? '...' : latestUpdate}</p>
                            <p className="mt-2 text-sm text-blue-600">Recent location save and stream check.</p>
                        </div>
                        <div className="rounded-3xl bg-white border border-blue-200 p-6 shadow-sm">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Data Points</p>
                            <p className="mt-4 text-3xl font-semibold text-blue-900">
                                {isLoading ? '...' : (sensorReadingsCount + locationHistoryCount + videoRecordingsCount)}
                            </p>
                            <p className="mt-2 text-sm text-blue-600">
                                {isLoading ? 'Loading data...' : `${sensorReadingsCount} readings, ${locationHistoryCount} locations, ${videoRecordingsCount} videos`}
                            </p>
                        </div>
                    </div>

                    {/* Main Navigation Cards */}
                    <div className="grid gap-6 xl:grid-cols-2">
                        <Link
                            href={route('live-monitoring')}
                            className="group rounded-3xl bg-white border border-blue-200 shadow-lg hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Live Monitoring</p>
                                        <h2 className="mt-3 text-2xl font-semibold text-blue-900">Stream & GPS</h2>
                                    </div>
                                    <div className="rounded-2xl bg-blue-100 p-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.5 1.5a.5.5 0 11-1 0V5a.5.5 0 011 0v1.5zm2 0a.5.5 0 11-1 0V5a.5.5 0 011 0v1.5zm2 0a.5.5 0 11-1 0V5a.5.5 0 011 0v1.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm text-blue-700 leading-relaxed">
                                    Open the live dashboard to view current location, camera feed, and device health in one view.
                                </p>
                                <div className="mt-8 inline-flex items-center rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold transition group-hover:bg-blue-500">
                                    Open Live Monitoring →
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={route('user-history')}
                            className="group rounded-3xl bg-white border border-blue-200 shadow-lg hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">History Review</p>
                                        <h2 className="mt-3 text-2xl font-semibold text-blue-900">Saved Records</h2>
                                    </div>
                                    <div className="rounded-2xl bg-blue-100 p-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm1 2h10v2H5V6zm0 4h7v2H5v-2z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="mt-6 text-sm text-blue-700 leading-relaxed">
                                    Access past GPS, incident, and video records with a focused interface for quick decision-making.
                                </p>
                                <div className="mt-8 inline-flex items-center rounded-2xl bg-blue-600 text-white px-4 py-2 text-sm font-semibold transition group-hover:bg-blue-500">
                                    Open History →
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="rounded-3xl bg-white border border-blue-200 p-6 shadow-sm">
                        <h3 className="text-base font-semibold text-blue-900">Dashboard focus</h3>
                        <ul className="mt-4 space-y-3 text-sm text-blue-700">
                            <li>• Clean separation of current live operations and stored records.</li>
                            <li>• Only essential metrics are displayed first.</li>
                            <li>• Simple language and clear CTA buttons for review or live monitoring.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

