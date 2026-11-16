import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

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
      // Fingerprint bypass
      prosesSukses()
      return
    }
    if (pinInput.length < 6) {
      const next = pinInput + digit
      setPinInput(next)
      if (next.length === 6) {
        if (next === currentUser.pin) {
          prosesSukses()
        } else {
          setErrorPin('PIN salah! Coba lagi.')
          setPinInput('')
        }
      }
    }
  }

  const prosesSukses = () => {
    navigate('/kas/bukti')
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#111F1A] text-white flex flex-col pt-12">
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/10">
        <button onClick={() => navigate(-1)} className="text-white text-lg active:scale-95">←</button>
        <h1 className="text-sm font-bold tracking-wide">Pindai QRIS Tarunesha</h1>
        <span className="text-lg">⚡</span>
      </div>

      {tahap === 'scan' && (
        <div className="flex-1 flex flex-col items-center justify-between p-6">
          <p className="text-xs text-white/70 text-center max-w-xs mt-2">
            Arahkan kamera ke kode QRIS merchant atau stan kas kegiatan Tarunesha
          </p>

          {/* Viewfinder Scanner */}
          <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden flex items-center justify-center my-auto">
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-[#4DB87F] rounded-tl-xl" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-[#4DB87F] rounded-tr-xl" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-[#4DB87F] rounded-bl-xl" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-[#4DB87F] rounded-br-xl" />

            {/* Laser scanning line */}
            <div className="absolute inset-x-0 h-1 bg-[#4DB87F] shadow-[0_0_15px_#4DB87F] animate-laser" />

            <style>{`
              @keyframes laser {
                0% { top: 10%; opacity: 0.2; }
                50% { top: 90%; opacity: 1; }
                100% { top: 10%; opacity: 0.2; }
              }
              .animate-laser { animation: laser 2.2s infinite ease-in-out; }
            `}</style>

            <span className="text-4xl opacity-30">📷</span>
          </div>

          {/* Quick trigger for prototype */}
          <div className="w-full space-y-3">
            <button
              onClick={handleDeteksiQR}
              className="w-full py-3.5 bg-[#1A6B4A] hover:bg-[#2D8B63] text-white text-xs font-bold rounded-2xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>✨</span> Simulasi Pindai QR Kas RT 05
            </button>
            <p className="text-[10px] text-center text-white/50">
              Saldo Dompet Tersedia: {rp(dompetSaldo)}
            </p>
          </div>
        </div>
      )}

      {/* TAHAP KONFIRMASI */}
      {tahap === 'konfirmasi' && (
        <div className="flex-1 bg-[#F4F7F5] text-[#111F1A] rounded-t-[32px] p-6 flex flex-col justify-between mt-6">
          <div>
            <div className="w-12 h-1 bg-[#E2EBE7] rounded-full mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-[#8FA89E] font-bold text-center">Konfirmasi Transaksi</p>
            <h2 className="text-xl font-bold text-center mt-1">{merchant}</h2>
            <p className="text-xs text-center text-[#4A6358] mt-0.5">NMID: ID102026110992</p>

            <div className="bg-white rounded-2xl border border-[#E2EBE7] p-5 my-6 text-center shadow-sm">
              <p className="text-xs text-[#8FA89E] font-semibold">Nominal Pembayaran</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <span className="text-lg font-bold text-[#1A6B4A]">Rp</span>
                <input
                  type="number"
                  value={nominalBayar}
                  onChange={e => setNominalBayar(Number(e.target.value))}
                  className="text-3xl font-extrabold text-[#111F1A] text-center w-40 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-[#4A6358] mt-2">Sumber: Dompet Tarunesha ({rp(dompetSaldo)})</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button full size="lg" variant="primary" onClick={handleKonfirmasiBayar}>
              Lanjut ke Verifikasi PIN / Fingerprint →
            </Button>
            <Button full size="md" variant="ghost" onClick={() => setTahap('scan')}>
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* TAHAP PIN */}
      {tahap === 'pin' && (
        <div className="flex-1 bg-white text-[#111F1A] rounded-t-[32px] p-6 flex flex-col items-center justify-between mt-4">
          <div className="w-full flex flex-col items-center">
            <div className="w-12 h-1 bg-[#E2EBE7] rounded-full mx-auto mb-4" />
            <p className="text-sm font-bold text-[#111F1A]">Masukkan 6 Digit PIN</p>
            <p className="text-xs text-[#8FA89E] mt-0.5">Konfirmasi bayar {rp(nominalBayar)}</p>

            {errorPin && (
              <p className="text-xs font-bold text-[#E84040] mt-2 bg-red-50 px-3 py-1 rounded-full">
                {errorPin}
              </p>
            )}

            {/* PIN Dots */}
            <div className="flex gap-3 my-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    i < pinInput.length ? 'bg-[#1A6B4A] scale-110' : 'bg-[#E2EBE7]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3 w-64 max-w-xs mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '👆', '0', '⌫'].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => handleInputPin(key)}
                className="h-14 rounded-2xl bg-[#F4F7F5] font-bold text-lg active:scale-90 transition-transform flex items-center justify-center text-[#111F1A]"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
