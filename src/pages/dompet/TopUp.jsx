import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

const metodeList = [
  { id: 'bca', nama: 'BCA Virtual Account', icon: '🏦', va: '8219-0812-3456-7890' },
  { id: 'bri', nama: 'BRI Virtual Account (BRIVA)', icon: '🏛️', va: '7721-0812-3456-7890' },
  { id: 'qris', nama: 'QRIS Instan', icon: '📱', va: 'Scan QRIS Dinamis' },
  { id: 'alfa', nama: 'Alfamart / Indomaret', icon: '🏪', va: 'KODE: TRN-992102' },
]

const quickNominal = [50000, 100000, 200000, 500000]

export default function TopUp() {
  const navigate = useNavigate()
  const { dompetSaldo, topupDompet } = useBankStore()

  const [selectedMetode, setSelectedMetode] = useState(metodeList[0])
  const [nominal, setNominal] = useState(100000)
  const [customInput, setCustomInput] = useState('')
  const [salinStatus, setSalinStatus] = useState(false)
  const [sukses, setSukses] = useState(false)

  const activeNominal = customInput ? Number(customInput) : nominal

  const handleSalin = () => {
    navigator.clipboard?.writeText(selectedMetode.va)
    setSalinStatus(true)
    setTimeout(() => setSalinStatus(false), 1500)
  }

  const handleProsesTopUp = () => {
    if (activeNominal < 10000) return
    topupDompet(activeNominal, selectedMetode.nama)
    setSukses(true)
    setTimeout(() => {
      navigate('/dompet')
    }, 1800)
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Isi Saldo Dompet (Top-Up)</h1>
      </div>

      <div className="p-4 space-y-4">
        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <span className="text-6xl animate-bounce">🎉</span>
            <h2 className="text-xl font-bold text-[#111F1A]">Top-Up Berhasil!</h2>
            <p className="text-xs text-[#4A6358]">
              Saldo dompet Anda berhasil bertambah <strong>{rp(activeNominal)}</strong>.
            </p>
            <span className="text-xs text-[#1A6B4A] font-bold bg-[#E6F4EE] px-4 py-1.5 rounded-full">
              Saldo Sekarang: {rp(dompetSaldo + activeNominal)}
            </span>
          </div>
        ) : (
          <>
            {/* Saldo Saat Ini */}
            <div className="bg-gradient-to-r from-[#0D4A33] to-[#1A6B4A] rounded-2xl p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 font-semibold">Saldo Dompet Saat Ini</p>
                <p className="text-2xl font-extrabold mt-0.5">{rp(dompetSaldo)}</p>
              </div>
              <span className="text-3xl">👛</span>
            </div>

            {/* Pilihan Nominal Cepat */}
            <div>
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
                Pilih Nominal Top-Up
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {quickNominal.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => { setNominal(n); setCustomInput('') }}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      activeNominal === n && !customInput
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A] shadow-sm'
                        : 'bg-white text-[#111F1A] border-[#E2EBE7]'
                    }`}
                  >
                    {shortRp(n)}
                  </button>
                ))}
              </div>

              {/* Input Custom */}
              <input
                type="number"
                placeholder="Atau ketik nominal lainnya (min. Rp 10.000)"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:border-[#1A6B4A]"
              />
            </div>

            {/* Pilihan Metode Pembayaran */}
            <div>
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
                Metode Pembayaran
              </p>
              <div className="space-y-2">
                {metodeList.map((m) => (
                  <Card
                    key={m.id}
                    onClick={() => setSelectedMetode(m)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                      selectedMetode.id === m.id
                        ? 'border-2 border-[#1A6B4A] bg-[#E8F4EE]/40'
                        : 'border border-[#E2EBE7]'
                    }`}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#111F1A]">{m.nama}</p>
                      <p className="text-xs text-[#8FA89E] font-mono mt-0.5">{m.va}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedMetode.id === m.id ? 'border-[#1A6B4A] bg-[#1A6B4A]' : 'border-[#C0CCC8]'
                    }`}>
                      {selectedMetode.id === m.id && <span className="text-white text-xs">✓</span>}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Box Instruksi & Copy VA */}
            <Card className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#8FA89E]">Nomor Pembayaran ({selectedMetode.nama})</p>
                  <p className="text-sm font-mono font-bold text-[#111F1A] mt-0.5">{selectedMetode.va}</p>
                </div>
                <button
                  onClick={handleSalin}
                  className="bg-[#F4F7F5] border border-[#E2EBE7] text-xs font-bold text-[#1A6B4A] px-3 py-1.5 rounded-lg active:scale-95"
                >
                  {salinStatus ? '✓ Tersalin' : 'Salin'}
                </button>
              </div>

              <div className="border-t border-[#E2EBE7] pt-2 text-[11px] text-[#4A6358] space-y-1">
                <p>1. Buka m-Banking atau gerai pembayaran pilihan Anda.</p>
                <p>2. Masukkan nomor pembayaran/VA di atas dengan nominal <strong>{rp(activeNominal)}</strong>.</p>
                <p>3. Saldo akan otomatis masuk ke dompet aplikasi tanpa biaya admin.</p>
              </div>
            </Card>

            {/* Tombol Simulasi Pembayaran Instan */}
            <div className="pt-2">
              <Button
                variant="primary"
                full
                size="lg"
                onClick={handleProsesTopUp}
              >
                Konfirmasi & Simulasi Bayar Sekarang ⚡
              </Button>
              <p className="text-center text-[10px] text-[#8FA89E] mt-2">
                Klik tombol di atas untuk simulasi instan top-up saldo dompet
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
