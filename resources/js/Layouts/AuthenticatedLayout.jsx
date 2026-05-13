import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        setLoggingOut(true);
        // Use Inertia's post method to logout
        document.querySelector('button[data-logout-button]')?.click();
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-600 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0`}>
                <div className="flex items-center justify-center h-16 bg-blue-700">
                    <Link href="/" className="text-white text-xl font-bold">
                        ALMKA Blind
                    </Link>
                </div>
                <nav className="mt-8">
                    <NavLink
                        href={route('dashboard')}
                        active={route().current('dashboard')}
                        className="block px-4 py-2 text-white hover:bg-blue-500"
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        Dashboard
                    </NavLink>
                    <NavLink
                        href={route('live-monitoring')}
                        active={route().current('live-monitoring')}
                        className="block px-4 py-2 text-white hover:bg-blue-500"
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        Live Monitoring
                    </NavLink>
                    <NavLink
                        href={route('user-history')}
                        active={route().current('user-history')}
                        className="block px-4 py-2 text-white hover:bg-blue-500"
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        User History
                    </NavLink>
                    <div className="absolute bottom-0 w-full">
                        <div className="px-4 py-2 text-white">
                            <p className="text-sm">{user.name}</p>
                            <p className="text-xs text-blue-200">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogoutClick}
                            className="block w-full px-4 py-2 text-left text-white hover:bg-blue-500 transition"
                        >
                            <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path>
                            </svg>
                            Logout
                        </button>
                        {/* Hidden logout button for Inertia */}
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="hidden"
                            data-logout-button
                        >
                            Logout
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar for mobile */}
                <div className="md:hidden bg-white shadow p-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>

                {/* Page header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={showLogoutModal}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
                loading={loggingOut}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </div>
    );
}
