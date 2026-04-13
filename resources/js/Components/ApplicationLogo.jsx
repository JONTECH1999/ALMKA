export default function ApplicationLogo(props) {
    return (
        <img
            src="/images/logo.jpg"
            alt="ALMKA Logo"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
            }}
            {...props}
        />
    );
}
