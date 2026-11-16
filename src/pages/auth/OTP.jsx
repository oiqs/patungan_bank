import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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
          className="text-[#1A6B4A] text-lg font-bold active:scale-95 transition-transform mb-3"
        >
          ← Kembali
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-10 gap-6">
        <div className="text-7xl animate-bounce">📱</div>
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
              className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl bg-white focus:outline-none focus:border-[#1A6B4A] transition-colors"
              style={{ borderColor: digit ? '#1A6B4A' : '#E2EBE7' }}
            />
          ))}
        </div>

        {/* Countdown */}
        <div className="text-sm text-[#4A6358]">
          {countdown > 0 ? (
            <span>Kirim ulang dalam <span className="text-[#1A6B4A] font-semibold">{countdown} detik</span></span>
          ) : (
            <button
              onClick={() => setCountdown(59)}
              className="text-[#1A6B4A] font-semibold active:scale-95 transition-transform"
            >
              Kirim ulang OTP
            </button>
          )}
        </div>

        <div className="w-full mt-2">
          <Button
            full
            size="lg"
            disabled={!isFull}
            onClick={() => navigate('/buat-pin')}
          >
            Verifikasi
          </Button>
        </div>
      </div>
    </div>
  )
}
