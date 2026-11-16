import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Smartphone } from 'lucide-react'
import Button from '../../components/Button'

export default function OTP() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(59)
  const inputs = useRef([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) inputs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  const isFull = otp.every(d => d !== '')

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-[#E2EBE7]">
        <button
          onClick={() => navigate(-1)}
          className="text-[#1A6B4A] text-sm font-bold active:scale-95 transition-transform flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" /> Kembali
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-10 gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center shadow-md animate-bounce">
          <Smartphone className="w-8 h-8 stroke-[2]" />
        </div>
        <div className="text-center">
          <h1 className="text-[#111F1A] text-2xl font-bold mb-1">Masukkan Kode OTP</h1>
          <p className="text-[#4A6358] text-sm">Dikirim ke +62 812-xxxx-xxxx</p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => (inputs.current[i] = el)}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl bg-white focus:outline-none focus:border-[#1A6B4A] transition-colors"
              style={{ borderColor: digit ? '#1A6B4A' : '#E2EBE7' }}
            />
          ))}
        </div>

        <p className="text-[#8FA89E] text-xs">
          Kirim ulang dalam <span className="font-bold text-[#1A6B4A]">{countdown}s</span>
        </p>

        <Button
          full
          disabled={!isFull}
          onClick={() => navigate('/buat-pin')}
          className="max-w-xs"
        >
          Verifikasi OTP
        </Button>
      </div>
    </div>
  )
}
