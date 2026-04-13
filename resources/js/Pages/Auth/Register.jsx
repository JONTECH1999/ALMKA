import InputError from '@/Components/InputError';
import PasswordInput from '@/Components/PasswordInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account - IoT Assistive System" />

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-500 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 sm:px-8 py-10 text-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-20 h-20 mx-auto mb-4 object-contain"
                        />
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                            Create Account
                        </h1>
                        <p className="mt-2 text-blue-100 text-sm">
                            Register as a Caregiver for Brgy 185<br />Assistive IoT System
                        </p>
                    </div>

                    {/* Content */}
                    <div className="px-6 sm:px-8 py-8 sm:py-10">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    placeholder="e.g. Juan Dela Cruz"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2 text-sm text-red-600" />
                            </div>

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
                                    placeholder="email@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2 text-sm text-red-600" />
                            </div>

                            {/* Password Field with Eye Icon */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    placeholder="Create a strong password"
                                    required
                                    className="px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2 text-sm text-red-600" />
                            </div>

                            {/* Confirm Password Field with Eye Icon */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    placeholder="Confirm your password"
                                    required
                                    className="px-4 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-200"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} className="mt-2 text-sm text-red-600" />
                            </div>

                            {/* Terms Checkbox */}
                            <label className="flex items-start gap-3 cursor-pointer mt-6">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    checked={data.terms}
                                    required
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-200 cursor-pointer"
                                    onChange={(e) => setData('terms', e.target.checked)}
                                />
                                <span className="text-sm text-gray-700">
                                    I agree to the{' '}
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                                        Terms of Service
                                    </a>
                                    {' '}for ALMKA data privacy.
                                </span>
                            </label>

                            {/* Submit Button */}
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full mt-8 py-3 text-base"
                            >
                                {processing ? 'Creating Account...' : 'Register Caregiver'}
                            </PrimaryButton>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Already registered?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                                >
                                    Sign in here
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
