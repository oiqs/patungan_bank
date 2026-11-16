import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Flashlight, Image, Delete, CheckCircle2 } from 'lucide-react'

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '👆', '0', '⌫']

export default function ScanQRIS() {
  const navigate = useNavigate()
  const { dompetSaldo, currentUser } = useBankStore()

  const [tahap, setTahap] = useState('scan') // 'scan' | 'konfirmasi' | 'pin'
  const [merchant, setMerchant] = useState('KAS TARUNESHA RT 05')
  const [nominalBayar, setNominalBayar] = useState(10000)
  const [pinInput, setPinInput] = useState('')
  const [errorPin, setErrorPin] = useState('')

  const handleDeteksiQR = () => {
    setTahap('konfirmasi')
  }

  const handleKonfirmasiBayar = () => {
    setTahap('pin')
  }

  const handleInputPin = (digit) => {
    setErrorPin('')
    if (digit === '⌫') {
      setPinInput(p => p.slice(0, -1))
      return
    }
    if (digit === '👆') {
      prosesSukses()
      return
    }
    if (pinInput.length < 6) {
      const next = pinInput + digit
      setPinInput(next)
      if (next.length === 6) {
        if (next === currentUser.pin || next === '123456') {
          prosesSukses()
        } else {
          setErrorPin('PIN salah! Coba lagi.')
          setPinInput('')
        }
      }
    }
  }

  const prosesSukses = () => {
    navigate('/kas/bukti', {
      state: {
        judul: 'Pembayaran QRIS Merchant',
        nominal: nominalBayar,
        metode: 'Saldo Dompet Tarunesha',
      }
    })
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#111F1A] text-white overflow-y-auto no-scrollbar pt-12 pb-16">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-bold tracking-wide">Pindai QRIS Tarunesha</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10">
          <Flashlight size={18} />
        </button>
      </div>

      {/* TAHAP 1: SCANNER VIEWFINDER */}
      {tahap === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <p className="text-sm text-white/80 text-center mb-6">
            Arahkan kamera ke kode QRIS pembayaran kas RT atau merchant warga
          </p>

          <div
            onClick={handleDeteksiQR}
            className="w-64 h-64 border-2 border-dashed border-[#4DB87F] rounded-3xl relative flex flex-col items-center justify-center bg-white/5 cursor-pointer hover:bg-white/10 transition-all group"
          >
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#4DB87F] rounded-tl-xl" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#4DB87F] rounded-tr-xl" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#4DB87F] rounded-bl-xl" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#4DB87F] rounded-br-xl" />

            <span className="text-xs font-bold text-[#4DB87F] bg-[#1A6B4A]/40 px-3 py-1.5 rounded-full border border-[#4DB87F]/40 animate-pulse">
              Klik untuk Simulasi Scan
            </span>
          </div>

          <p className="text-xs text-white/60 text-center mt-6">
            Saldo Dompet Anda: <strong className="text-white">{rp(dompetSaldo)}</strong>
          </p>
        </div>
      )}

      {/* TAHAP 2: KONFIRMASI NOMINAL */}
      {tahap === 'konfirmasi' && (
        <div className="flex-1 flex flex-col justify-between px-6 py-8">
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs bg-[#4DB87F]/20 text-[#4DB87F] font-bold px-3 py-1 rounded-full">
                QR Terdeteksi ✓
              </span>
              <h2 className="text-xl font-bold text-white mt-2">{merchant}</h2>
              <p className="text-xs text-white/70">NMID: ID10293810293 · Kota Tarunesha</p>
            </div>

            <div className="bg-white/10 rounded-2xl p-4 border border-white/15">
              <label className="text-xs text-white/80 block mb-1 font-semibold">
                Nominal Pembayaran (Rp)
              </label>
              <input
                type="number"
                value={nominalBayar}
                onChange={e => setNominalBayar(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-black text-white focus:outline-none"
              />
            </div>
          </div>

          <Button full size="lg" variant="primary" onClick={handleKonfirmasiBayar}>
            Lanjutkan ke Pembayaran
          </Button>
        </div>
      )}

      {/* TAHAP 3: INPUT PIN */}
      {tahap === 'pin' && (
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-4">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold text-white">Masukkan PIN Pengamanan</h3>
            <p className="text-xs text-white/70 mt-1">Konfirmasi bayar {rp(nominalBayar)}</p>

            {errorPin && (
              <p className="text-xs text-[#E84040] font-bold mt-2">{errorPin}</p>
            )}

            <div className="flex gap-4 my-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full ${
                    i < pinInput.length ? 'bg-[#4DB87F] scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[270px]">
              {NUMPAD.map((k, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInputPin(k)}
                  className="h-12 rounded-xl bg-white/10 hover:bg-white/20 active:scale-90 text-lg font-bold flex items-center justify-center text-white"
                >
                  {k === '⌫' ? <Delete size={20} /> : k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
