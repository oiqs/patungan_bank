export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2EBE7] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
