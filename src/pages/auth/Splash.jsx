import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    icon: '💰',
    title: 'Iuran Transparan',
    desc: 'Bayar iuran & cek saldo kapan saja, di mana saja',
  },
  {
    icon: '🎲',
    title: 'Arisan Digital',
    desc: 'Undian transparan & jadwal otomatis tanpa ribet',
  },
  {
    icon: '🏦',
    title: 'Pembiayaan Mudah',
    desc: 'Ajukan pinjaman online, proses cepat & transparan',
  },
]

export default function Splash() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] flex flex-col items-center justify-between px-6 py-10 pt-12">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
          🌱
        </div>
        <h1 className="text-white text-3xl font-bold tracking-tight">Patungan Bank</h1>
        <p className="text-white/70 text-sm text-center">Keuangan komunitas Tarunesha</p>
      </div>

      {/* Slide Content */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="text-6xl">{slides[currentSlide].icon}</div>
        <h2 className="text-white text-xl font-bold text-center">{slides[currentSlide].title}</h2>
        <p className="text-white/80 text-sm text-center max-w-xs">{slides[currentSlide].desc}</p>

        {/* Dots */}
        <div className="flex gap-2 mt-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all active:scale-95 ${
                i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-4 w-full">
        <button
          onClick={() => navigate('/daftar')}
          className="w-full bg-white text-[#1A6B4A] font-bold text-base py-4 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          Mulai →
        </button>
        <button
          onClick={() => navigate('/login')}
          className="text-white/80 text-sm active:scale-95 transition-transform"
        >
          Sudah punya akun? <span className="text-white font-semibold">Masuk</span>
        </button>
      </div>
    </div>
  )
}
