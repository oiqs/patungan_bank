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
      className="w-full h-full min-h-[100dvh] sm:min-h-full flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#125339] p-6 active:opacity-95 transition-opacity"
      title="Ketuk layar untuk lanjut ke Menu Login"
    >
      {/* Logo */}
      <Sprout className="w-20 h-20 sm:w-24 sm:h-24 text-white stroke-[2.2]" />

      {/* Sempurnakan Tipografi & Hierarki Visual */}
      <h1 className="text-3xl sm:text-4xl tracking-tight mt-4 flex items-center justify-center">
        <span className="font-extrabold text-white">Patungan</span>
        <span className="font-light text-[#86EFAC] ml-2">Bank</span>
      </h1>
    </div>
  )
}
