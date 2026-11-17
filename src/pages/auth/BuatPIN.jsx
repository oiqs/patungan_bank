import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Fingerprint } from 'lucide-react'
import Button from '../../components/Button'

export default function BuatPIN() {
  const navigate = useNavigate()
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const [fingerprint, setFingerprint] = useState(false)

  const handleChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return
    const next = [...pin]
    next[idx] = val.slice(-1)
    setPin(next)
    if (val && idx < 5) {
      document.getElementById(`pin-${idx + 1}`)?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx - 1}`)?.focus()
    }
  }

  const isFull = pin.every(d => d !== '')

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12">
      <div className="flex-1 flex flex-col items-center px-6 py-10 gap-6">
        {/* Lock icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center shadow-md animate-bounce">
          <Lock className="w-8 h-8 stroke-[2]" />
        </div>

        <div className="text-center">
          <h1 className="text-[#111F1A] text-2xl font-bold mb-1">Buat PIN Rahasia</h1>
          <p className="text-[#4A6358] text-sm">PIN 6 digit digunakan untuk verifikasi transaksi</p>
        </div>

        {/* PIN Grid */}
        <div className="grid grid-cols-6 gap-2 w-full max-w-xs">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-full aspect-square text-center text-2xl font-bold border-2 rounded-xl bg-white focus:outline-none focus:border-[#1A6B4A] transition-colors"
              style={{ borderColor: digit ? '#1A6B4A' : '#E2EBE7' }}
            />
          ))}
        </div>

        {/* Fingerprint Toggle */}
        <div className="flex items-center justify-between w-full max-w-xs bg-white border border-[#E2EBE7] rounded-2xl px-4 py-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF7F1] flex items-center justify-center text-[#1A6B4A]">
              <Fingerprint className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111F1A]">Aktifkan Sidik Jari</p>
              <p className="text-xs text-[#8FA89E]">Login lebih cepat & aman</p>
            </div>
          </div>
          <button
            onClick={() => setFingerprint(f => !f)}
            className={`w-12 h-6 rounded-full transition-colors active:scale-95 ${fingerprint ? 'bg-[#1A6B4A]' : 'bg-[#E2EBE7]'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${fingerprint ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <Button
          full
          disabled={!isFull}
          onClick={() => navigate('/beranda')}
          className="max-w-xs"
        >
          Simpan PIN & Lanjut
        </Button>
      </div>
    </div>
  )
}
