import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Users, Landmark, Sprout } from 'lucide-react'

const slides = [
  {
    icon: CreditCard,
    title: 'Iuran Transparan',
    desc: 'Bayar iuran & cek saldo kapan saja, di mana saja',
  },
  {
    icon: Users,
    title: 'Arisan Digital',
    desc: 'Undian transparan & jadwal otomatis tanpa ribet',
  },
  {
    icon: Landmark,
    title: 'Pembiayaan Mudah',
    desc: 'Ajukan pinjaman online, proses cepat & transparan',
  },
]

export default function Splash() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const CurrentIcon = slides[currentSlide].icon

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] flex flex-col items-center justify-between px-6 py-10 pt-12">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mt-6">
        <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white shadow-xl border border-white/20">
          <Sprout className="w-10 h-10 stroke-[2]" />
        </div>
        <h1 className="text-white text-3xl font-bold tracking-tight">Patungan Bank</h1>
        <p className="text-white/70 text-sm text-center">Keuangan komunitas Tarunesha</p>
      </div>

      {/* Slide Content */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white border border-white/20 shadow-lg">
          <CurrentIcon className="w-10 h-10 stroke-[2]" />
        </div>
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
          className="w-full py-4 rounded-xl bg-white text-[#1A6B4A] font-bold text-base shadow-lg hover:bg-white/90 active:scale-98 transition-all"
        >
          Daftar Sebagai Warga
        </button>

        <p className="text-white/70 text-sm">
          Sudah terdaftar?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-white font-bold underline active:opacity-75"
          >
            Masuk Sekarang
          </button>
        </p>
      </div>
    </div>
  )
}
