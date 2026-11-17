import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function InitialScreen() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Jalankan timer pengisian progress bar (selama ~2.5 detik)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 100)

    // Auto-redirect ke beranda setelah 2.8 detik
    const redirectTimer = setTimeout(() => {
      navigate('/beranda')
    }, 2800)

    return () => {
      clearInterval(interval)
      clearTimeout(redirectTimer)
    }
  }, [navigate])

  const handleEnterNow = () => {
    navigate('/beranda')
  }

  return (
    <div
      onClick={handleEnterNow}
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col justify-between items-center px-6 py-10 sm:py-12 cursor-pointer select-none overflow-hidden bg-gradient-to-b from-[#0A3827] via-[#145C3E] to-[#1C734F]"
      title="Ketuk di mana saja untuk langsung masuk"
    >
      {/* ── AMBIENT DECORATIVE GLOW BACKGROUND ── */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-72 h-72 rounded-full bg-emerald-400/[0.08] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

      {/* ── TOP BADGE ── */}
      <div className="w-full flex items-center justify-between z-10 pt-4 sm:pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white/90 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.2]" />
          <span>Keuangan Warga Tarunesha RT 05</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-white/70">
          <Sparkles className="w-3 h-3 text-white/80" />
          <span>v1.2</span>
        </div>
      </div>

      {/* ── CENTER: LOGO & TULISAN PATUNGAN BANK ── */}
      <div className="flex flex-col items-center text-center z-10 my-auto -mt-6">
        {/* Logo Container dengan Efek Glow Halus */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle animated halo glow */}
          <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl animate-pulse" />
          
          {/* Box Logo Translucent Kaca Berwarna Hijau Selaras */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-[0_20px_45px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-105 active:scale-95">
            <Sprout className="w-13 h-13 sm:w-16 sm:h-16 text-white stroke-[2.3] drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]" />
          </div>
        </div>

        {/* Tulisan Patungan Bank & Subjudul */}
        <h1 className="text-white text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          Patungan Bank
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wider uppercase mt-2 drop-shadow-sm">
          Sistem Keuangan Gotong Royong Digital
        </p>

        {/* Micro Tagline */}
        <p className="text-white/60 text-[11px] mt-1 max-w-[240px]">
          Transparan, aman, dan mudah untuk seluruh warga Tarunesha
        </p>
      </div>

      {/* ── BOTTOM: PROGRESS & ENTER ACTION ── */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10 pb-4">
        {/* Tombol Masuk Cepat */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleEnterNow()
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-white text-[#145C3E] font-bold text-sm shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:bg-white/95 active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <span>Masuk ke Aplikasi</span>
          <ArrowRight className="w-4 h-4 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        {/* Loading Progress Bar Mini */}
        <div className="w-full mt-1">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/70 mt-1.5 px-0.5">
            <span>{progress < 100 ? 'Memuat sistem...' : 'Mengarahkan...'}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Tautan Alternatif ke Pengenalan / Info */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            navigate('/splash')
          }}
          className="text-white/75 text-[11px] hover:text-white underline underline-offset-4 mt-1 active:opacity-80 transition-colors"
        >
          Lihat Panduan & Fitur Aplikasi
        </button>
      </div>
    </div>
  )
}
