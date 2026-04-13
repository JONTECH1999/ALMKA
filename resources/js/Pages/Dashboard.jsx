import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalLocations: 0,
        totalVideos: 0,
        totalReadings: 0,
        deviceStatus: 'Checking...',
        lastUpdate: 'Loading...'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/data-logger/statistics');
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalLocations: data.location_count || 0,
                        totalVideos: data.video_count || 0,
                        totalReadings: data.sensor_count || 0,
                        deviceStatus: 'Online',
                        lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const StatCard = ({ label, value, icon, color }) => (
        <div className="rounded-2xl bg-white border border-blue-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{label}</p>
                    <p className={`mt-3 text-4xl font-bold ${color}`}>{value}</p>
                </div>
                <div className={`rounded-xl p-3 ${color.replace('text', 'bg').replace('900', '100')}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

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
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg">
                        <h1 className="text-3xl font-bold">ALMKA Monitoring Dashboard</h1>
                        <p className="mt-2 text-blue-100">Real-time system monitoring and data overview</p>
                    </div>

                    {/* Key Statistics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            label="Location Records"
                            value={stats.totalLocations}
                            icon={<svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                            color="text-blue-900"
                        />
                        <StatCard
                            label="Video Recordings"
                            value={stats.totalVideos}
                            icon={<svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>}
                            color="text-green-900"
                        />
                        <StatCard
                            label="Sensor Readings"
                            value={stats.totalReadings}
                            icon={<svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2 1 1 0 100 2 2 2 0 01.001 4 1 1 0 100 2 1 1 0 000 2 2 2 0 002 2h8a2 2 0 002-2 1 1 0 100-2 1 1 0 000-2 2 2 0 01-.001-4 1 1 0 100-2 1 1 0 000-2 2 2 0 00-2-2H6a2 2 0 00-2 2zm10 0H6v4h8V5z" clipRule="evenodd" /></svg>}
                            color="text-purple-900"
                        />
                        <StatCard
                            label="Device Status"
                            value={stats.deviceStatus}
                            icon={<svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>}
                            color="text-amber-900"
                        />
                    </div>

                    {/* Data Summary Section */}
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Activity Overview */}
                        <div className="rounded-2xl bg-white border border-blue-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">Activity Overview</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-blue-700">Locations Tracked</span>
                                        <span className="text-sm font-semibold text-blue-900">{stats.totalLocations}</span>
                                    </div>
                                    <div className="w-full bg-blue-100 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min((stats.totalLocations / 100) * 100, 100)}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-green-700">Videos Recorded</span>
                                        <span className="text-sm font-semibold text-green-900">{stats.totalVideos}</span>
                                    </div>
                                    <div className="w-full bg-green-100 rounded-full h-2">
                                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min((stats.totalVideos / 50) * 100, 100)}%`}}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-purple-700">Sensor Data Points</span>
                                        <span className="text-sm font-semibold text-purple-900">{stats.totalReadings}</span>
                                    </div>
                                    <div className="w-full bg-purple-100 rounded-full h-2">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{width: `${Math.min((stats.totalReadings / 500) * 100, 100)}%`}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="rounded-2xl bg-white border border-blue-200 p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                                    <span className="text-sm text-green-900">Device Connection</span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                        <span className="text-sm font-semibold text-green-900">Connected</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                                    <span className="text-sm text-blue-900">Data Collection</span>
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                        <span className="text-sm font-semibold text-blue-900">Active</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
                                    <span className="text-sm text-amber-900">Last Update</span>
                                    <span className="text-sm font-semibold text-amber-900">{stats.lastUpdate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <Link
                            href={route('live-monitoring')}
                            className="group rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-blue-100 uppercase tracking-wide">Quick Access</p>
                                    <h2 className="mt-2 text-2xl font-bold">Live Monitoring</h2>
                                    <p className="mt-2 text-sm text-blue-100">View real-time location, camera feed & device health</p>
                                </div>
                                <svg className="w-8 h-8 text-blue-200" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" /></svg>
                            </div>
                        </Link>

                        <Link
                            href={route('user-history')}
                            className="group rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg hover:shadow-xl transition overflow-hidden"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-green-100 uppercase tracking-wide">Quick Access</p>
                                    <h2 className="mt-2 text-2xl font-bold">History & Records</h2>
                                    <p className="mt-2 text-sm text-green-100">Review past GPS, videos & incident records</p>
                                </div>
                                <svg className="w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2 1 1 0 100 2 2 2 0 01.001 4 1 1 0 100 2 1 1 0 000 2 2 2 0 002 2h8a2 2 0 002-2 1 1 0 100-2 1 1 0 000-2 2 2 0 01-.001-4 1 1 0 100-2 1 1 0 000-2 2 2 0 00-2-2H6a2 2 0 00-2 2zm10 0H6v4h8V5z" clipRule="evenodd" /></svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

