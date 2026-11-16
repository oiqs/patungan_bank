export default function Button({ children, onClick, variant = 'primary', disabled }) {
    const style =
        variant === 'primary'
            ? 'bg-amber-400 text-emerald-950'
            : 'bg-white border border-gray-200 text-gray-800'
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full rounded-xl py-3 font-semibold active:scale-95 transition disabled:opacity-40 ${style}`}
        >
            {children}
        </button>
    )
}