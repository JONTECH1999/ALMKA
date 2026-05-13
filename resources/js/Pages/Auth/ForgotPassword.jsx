import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Reset Password - IoT Device Portal" />

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#0581fd',
                padding: '20px',
                fontFamily: "'Segoe UI', Arial, sans-serif"
            }}>
                <div className="reset-card" style={{
                    backgroundColor: '#e8f4fd',
                    width: '100%',
                    maxWidth: '420px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    padding: '40px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    border: '1px solid #b3d9f2'
                }}>
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="logo"
                        style={{
                            width: '80px',
                            height: '80px',
                            marginBottom: '20px'
                        }}
                    />

                    <h1 style={{
                        fontSize: '24px',
                        marginBottom: '10px',
                        color: '#333',
                        fontWeight: '700'
                    }}>
                        Reset Password
                    </h1>
                    <p className="instruction-text" style={{
                        fontSize: '13px',
                        color: '#777',
                        marginBottom: '30px',
                        lineHeight: '1.5',
                        padding: '0 10px'
                    }}>
                        Enter your email address and we will send you instructions to reset your password.
                    </p>

                    <div className="form-container" style={{
                        width: '100%',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '25px 20px',
                        marginBottom: '25px'
                    }}>
                        {status && (
                            <div style={{
                                marginBottom: '15px',
                                padding: '10px',
                                backgroundColor: '#d4edda',
                                color: '#155724',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="form-group" style={{ marginBottom: '15px', textAlign: 'left' }}>
                                <label htmlFor="email" style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    color: '#555',
                                    fontWeight: '600',
                                    marginBottom: '8px'
                                }}>
                                    Registered Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="email@example.com"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px 15px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        color: '#333'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#28a745';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(40, 167, 69, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#ddd';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} style={{ marginTop: '5px', fontSize: '12px', color: '#dc3545' }} />
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '13px',
                                    backgroundColor: processing ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    if (!processing) e.target.style.backgroundColor = '#218838';
                                }}
                                onMouseOut={(e) => {
                                    if (!processing) e.target.style.backgroundColor = '#28a745';
                                }}
                            >
                                {processing ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </div>

                    <div className="footer-links" style={{
                        fontSize: '13px',
                        color: '#666'
                    }}>
                        Remember your password? <Link href={route('login')} style={{
                            textDecoration: 'none',
                            color: '#0581fd',
                            fontWeight: '600'
                        }}>Sign in.</Link>
                        <Link
                            href="/"
                            className="back-link"
                            style={{
                                display: 'block',
                                marginTop: '15px',
                                color: '#888',
                                fontWeight: 'normal',
                                textDecoration: 'none'
                            }}
                        >
                            ← Back to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
