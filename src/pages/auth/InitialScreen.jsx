import { useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'

export default function InitialScreen() {
  const navigate = useNavigate()

  const handleTapScreen = () => {
    navigate('/login')
  }

  return (
    <div
      onClick={handleTapScreen}
      className="relative w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#125339] p-6 active:scale-[0.98] transition-transform duration-200 overflow-hidden"
      title="Ketuk layar untuk lanjut ke Menu Login"
    >
      {/* ── AMBIENT GLOW LATAR BELAKANG HALUS (BERNAFAS) ── */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-300/[0.12] blur-3xl pointer-events-none animate-splash-bg" />
      <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

      {/* ── AREA LOGO DENGAN ANIMASI FLOAT & AURA GLOW ── */}
      <div className="relative flex items-center justify-center animate-splash-logo-in">
        {/* Lingkaran Pendar Cahaya Aura Lembut di Belakang Logo */}
        <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-400/20 blur-xl pointer-events-none animate-splash-aura" />

        {/* Ikon Tunas Logo dengan Gerakan Terapung Halus (Float) */}
        <div className="relative animate-splash-float drop-shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
          <Sprout className="w-20 h-20 sm:w-24 sm:h-24 text-white stroke-[2.2]" />
        </div>
      </div>

      {/* ── NAMA BANK DENGAN ANIMASI FADE-IN & GLOW GLEAM ── */}
      <h1 className="text-3xl sm:text-4xl tracking-tight mt-5 flex items-center justify-center animate-splash-text-in select-none">
        <span className="font-extrabold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
          Patungan
        </span>
        <span className="font-light ml-2 animate-splash-gleam">
          Bank
        </span>
      </h1>
    </div>
  )
}
