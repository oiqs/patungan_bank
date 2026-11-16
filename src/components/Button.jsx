export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizes = {
    sm: 'text-sm px-4 py-2 min-h-[38px]',
    md: 'text-base px-5 py-3 min-h-[46px]',
    lg: 'text-base px-6 py-3.5 min-h-[50px]',
  }

  const variants = {
    primary:   'bg-[#1A6B4A] text-white shadow-[0_4px_14px_rgba(26,107,74,0.3)] hover:bg-[#207e58]',
    secondary: 'bg-[#E6F4EE] text-[#1A6B4A] hover:bg-[#d1ecdf]',
    danger:    'bg-[#E84040] text-white shadow-[0_4px_14px_rgba(232,64,64,0.25)] hover:bg-red-600',
    accent:    'bg-[#F5A623] text-white shadow-[0_4px_14px_rgba(245,166,35,0.3)] hover:bg-amber-600',
    ghost:     'bg-transparent text-[#2D4539] hover:bg-[#F4F7F5]',
    outline:   'border border-[#D5E2DC] bg-white text-[#111F1A] hover:bg-[#F4F7F5]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
