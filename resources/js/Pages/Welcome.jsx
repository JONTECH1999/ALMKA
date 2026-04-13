import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="IoT Assistive Navigation" />
            <div
                className="hero-section"
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'right bottom',
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: 'white',
                    padding: '20px',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                }}
            >
                <div className="logo-container" style={{ marginBottom: '30px' }}>
                    <div
                        className="logo-circle"
                        style={{
                            width: '100px',
                            height: '100px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                        }}
                    >
                        <img
                            src="/images/logo.png"
                            alt="Association Logo"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                </div>

                <h1 style={{
                    fontSize: '3.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    fontWeight: '900',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}>
                    IoT Assistive Navigation
                </h1>

                <p className="subtitle" style={{
                    fontSize: '1.1rem',
                    color: '#ffcc00',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                }}>
                    Ang Lakas ng May Kapansanan Association - Brgy 185
                </p>
                <p className="description" style={{
                    fontSize: '1rem',
                    marginBottom: '40px',
                    fontWeight: '300',
                    letterSpacing: '0.5px'
                }}>
                    Real-Time Monitoring And Safety For The Visually Impaired.
                </p>

                <div className="button-group" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="btn"
                            style={{
                                background: 'linear-gradient(135deg, #0066cc 0%, #0099ff 100%)',
                                color: 'white',
                                padding: '14px 50px',
                                border: 'none',
                                borderRadius: '30px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                minWidth: '160px',
                                textDecoration: 'none',
                                display: 'inline-block',
                                textAlign: 'center',
                                boxShadow: '0 4px 15px rgba(0, 102, 204, 0.4)',
                                letterSpacing: '0.5px'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.boxShadow = '0 8px 25px rgba(0, 102, 204, 0.7)';
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.4)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                            onMouseDown={(e) => e.target.style.transform = 'translateY(-1px) scale(0.98)'}
                            onMouseUp={(e) => e.target.style.transform = 'translateY(-3px)'}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="btn"
                                style={{
                                    background: 'linear-gradient(135deg, #0066cc 0%, #0099ff 100%)',
                                    color: 'white',
                                    padding: '14px 50px',
                                    border: 'none',
                                    borderRadius: '30px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    minWidth: '160px',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(0, 102, 204, 0.4)',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 102, 204, 0.7)';
                                    e.target.style.transform = 'translateY(-3px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.boxShadow = '0 4px 15px rgba(0, 102, 204, 0.4)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                                onMouseDown={(e) => e.target.style.transform = 'translateY(-1px) scale(0.98)'}
                                onMouseUp={(e) => e.target.style.transform = 'translateY(-3px)'}
                            >
                                Login
                            </Link>
                            <Link
                                href={route('register')}
                                className="btn"
                                style={{
                                    background: 'linear-gradient(135deg, #0099ff 0%, #00ccff 100%)',
                                    color: 'white',
                                    padding: '14px 50px',
                                    border: 'none',
                                    borderRadius: '30px',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    minWidth: '160px',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    boxShadow: '0 4px 15px rgba(0, 153, 255, 0.4)',
                                    letterSpacing: '0.5px'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.boxShadow = '0 8px 25px rgba(0, 153, 255, 0.7)';
                                    e.target.style.transform = 'translateY(-3px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.boxShadow = '0 4px 15px rgba(0, 153, 255, 0.4)';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                                onMouseDown={(e) => e.target.style.transform = 'translateY(-1px) scale(0.98)'}
                                onMouseUp={(e) => e.target.style.transform = 'translateY(-3px)'}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
