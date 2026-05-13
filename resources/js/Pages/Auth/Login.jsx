import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/PasswordInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Sign In - IoT Device Portal" />

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-10 text-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-20 h-20 mx-auto mb-4 object-contain"
                        />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Sign In
                        </h1>
                        <p className="mt-2 text-blue-100 text-sm">
                            IoT-Based Assistive Device Portal<br />(Brgy 185 Malaria)
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 sm:px-8 py-8 sm:py-10">
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                            </div>

                            {/* Password Field with Eye Icon */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                                        >
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Enter your password"
                                    required
                                    className="px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                            </div>

                            {/* Remember Me */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-200 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700 font-medium">Remember me</span>
                            </label>

                            {/* Submit Button */}
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full mt-8 py-3 text-base"
                            >
                                {processing ? 'Signing In...' : 'Sign In'}
                            </PrimaryButton>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                New caregiver?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>

                        <Link
                            href="/"
                            className="block mt-6 text-center text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                            ← Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
