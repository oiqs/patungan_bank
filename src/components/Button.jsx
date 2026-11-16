export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  onClick,
  className = '',
  disabled = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-3',
    lg: 'text-base px-6 py-3.5',
  }

  const variants = {
    primary:   'bg-[#1A6B4A] text-white shadow-[0_4px_14px_rgba(26,107,74,0.35)] hover:bg-[#2D8B63]',
    secondary: 'bg-[#E6F4EE] text-[#1A6B4A] hover:bg-[#d1ecdf]',
    danger:    'bg-[#E84040] text-white shadow-[0_4px_14px_rgba(232,64,64,0.3)] hover:bg-red-500',
    accent:    'bg-[#F5A623] text-white shadow-[0_4px_14px_rgba(245,166,35,0.35)] hover:bg-amber-500',
    ghost:     'bg-transparent text-[#4A6358] hover:bg-[#F4F7F5]',
    outline:   'border border-[#E2EBE7] bg-white text-[#111F1A] hover:bg-[#F4F7F5]',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
