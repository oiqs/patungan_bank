import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'
import { Lock, Delete, CheckCircle2, Fingerprint } from 'lucide-react'

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function BuatPIN() {
  const navigate = useNavigate()
  const { setPin: savePinToStore, toggleFingerprint } = useBankStore()
  const [pin, setPin] = useState([])
  const [fingerprint, setFingerprint] = useState(true)

  const handlePress = (key) => {
    if (!key) return
    if (key === '⌫') {
      setPin(prev => prev.slice(0, -1))
      return
    }
    if (pin.length < 6) {
      setPin(prev => [...prev, key])
    }
  }

  const isFull = pin.length === 6

  const handleSimpanPin = () => {
    if (!isFull) return
    savePinToStore(pin.join(''))
    if (fingerprint) {
      toggleFingerprint()
    }
    navigate('/')
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F4F7F5] select-none pb-8 pt-12">
      <div className="px-5 flex flex-col items-center">
        
        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-3xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center mb-3 mt-4 shadow-xs">
          <Lock size={32} />
        </div>

        <h1 className="text-xl font-extrabold text-[#111F1A] text-center">
          Buat PIN Rahasia Anda
        </h1>
        <p className="text-sm text-[#5F7A6E] text-center mt-1">
          Gunakan 6 digit angka untuk verifikasi transaksi &amp; keamanan
        </p>

        {/* PIN 6 Dots Indicator */}
        <div className="flex gap-4 my-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-150 ${
                i < pin.length
                  ? 'bg-[#1A6B4A] scale-125 shadow-[0_0_8px_rgba(26,107,74,0.4)]'
                  : 'bg-[#C8D9D2]'
              }`}
            />
          ))}
        </div>

        {/* Numpad Besar Sesuai Halaman Login */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[290px] mb-4">
          {NUMPAD.map((key, idx) => (
            <button
              key={idx}
              onClick={() => handlePress(key)}
              disabled={!key}
              className={`h-14 rounded-2xl text-xl font-black flex items-center justify-center transition-all ${
                !key
                  ? 'invisible'
                  : key === '⌫'
                  ? 'bg-white text-[#1A6B4A] border border-[#D5E2DC] shadow-xs active:scale-90 hover:bg-gray-50'
                  : 'bg-white text-[#111F1A] border border-[#D5E2DC] shadow-xs active:scale-90 hover:border-[#1A6B4A]'
              }`}
            >
              {key === '⌫' ? <Delete size={22} /> : key}
            </button>
          ))}
        </div>

        {/* Toggle Fingerprint */}
        <div className="flex items-center justify-between w-full max-w-[290px] bg-white border border-[#E2EBE7] rounded-2xl px-4 py-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Fingerprint size={22} className="text-[#1A6B4A]" />
            <div>
              <p className="text-xs font-bold text-[#111F1A]">Aktifkan Sidik Jari</p>
              <p className="text-[11px] text-[#5F7A6E]">Login instan tanpa ketik PIN</p>
            </div>
          </div>
          <button
            onClick={() => setFingerprint(f => !f)}
            className={`w-11 h-6 rounded-full transition-colors ${fingerprint ? 'bg-[#1A6B4A]' : 'bg-[#E2EBE7]'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${fingerprint ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

      </div>

      {/* Button Simpan */}
      <div className="px-6 w-full max-w-[320px] mx-auto">
        <Button
          full
          size="lg"
          disabled={!isFull}
          onClick={handleSimpanPin}
        >
          Simpan PIN &amp; Masuk
        </Button>
      </div>
    </div>
  )
}
