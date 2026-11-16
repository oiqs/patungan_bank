export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmLabel = 'Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'primary', // 'primary' | 'danger' | 'warning'
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  const confirmBtnStyles = {
    primary: 'bg-[#1A6B4A] hover:bg-[#207e58] text-white',
    danger: 'bg-[#E84040] hover:bg-red-600 text-white',
    warning: 'bg-[#F5A623] hover:bg-amber-600 text-white',
  }[variant] || 'bg-[#1A6B4A] text-white'

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E2EBE7] animate-scale-up flex flex-col gap-3">
        <h3 className="text-base font-bold text-[#111F1A]">{title}</h3>
        <p className="text-sm text-[#456355] leading-relaxed">
          {message}
        </p>

        <div className="flex gap-2.5 pt-2">
          {cancelLabel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-[#D5E2DC] bg-[#F4F7F5] hover:bg-gray-100 text-[#2D4539] font-bold text-sm active:scale-95 transition-all"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-sm ${confirmBtnStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
