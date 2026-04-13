export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 ease-out hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:from-indigo-700 hover:to-indigo-800'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
