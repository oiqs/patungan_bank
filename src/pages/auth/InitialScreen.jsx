import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'

export default function InitialScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    // Tampilkan logo selama 2 detik lalu langsung diarahkan ke menu Login
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div
      onClick={() => navigate('/login')}
      className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#125339] p-6"
    >
      {/* Hanya Logo Sesuai Permintaan */}
      <Sprout className="w-20 h-20 sm:w-24 sm:h-24 text-white stroke-[2.2]" />

      {/* Hanya Tulisan Patungan Bank di Bawahnya */}
      <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mt-4">
        Patungan Bank
      </h1>
    </div>
  )
}
