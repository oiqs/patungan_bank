import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Copy, CheckCircle2, Building2, QrCode, Store } from 'lucide-react'

const metodeList = [
  { id: 'bca', nama: 'BCA Virtual Account', icon: Building2, va: '8219-0812-3456-7890' },
  { id: 'bri', nama: 'BRI Virtual Account (BRIVA)', icon: Building2, va: '7721-0812-3456-7890' },
  { id: 'qris', nama: 'QRIS Instan', icon: QrCode, va: 'Scan QRIS Dinamis' },
  { id: 'alfa', nama: 'Alfamart / Indomaret', icon: Store, va: 'KODE TRN-992102' },
]

const quickNominal = [20000, 50000, 100000, 200000]

export default function TopUp() {
  const navigate = useNavigate()
  const { dompetSaldo, topupDompet } = useBankStore()

  const [selectedMetode, setSelectedMetode] = useState(metodeList[0])
  const [nominal, setNominal] = useState(50000)
  const [customInput, setCustomInput] = useState('')
  const [salinStatus, setSalinStatus] = useState(false)
  const [sukses, setSukses] = useState(false)

  const activeNominal = customInput ? Number(customInput) : nominal

  const handleSalin = () => {
    navigator.clipboard?.writeText(selectedMetode.va)
    setSalinStatus(true)
    setTimeout(() => setSalinStatus(false), 2000)
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
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E2EBE7] flex items-center gap-2 sticky top-0 z-10 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Isi Saldo Dompet</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-[#111F1A]">Top-Up Berhasil!</h2>
            <p className="text-sm text-[#456355]">
              Saldo dompet Anda berhasil bertambah <strong>{rp(activeNominal)}</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Saldo Saat Ini */}
            <Card className="p-4 bg-white border border-[#D5E2DC]">
              <span className="text-xs font-bold text-[#5F7A6E]">Saldo Dompet Anda Saat Ini</span>
              <p className="text-2xl font-black text-[#1A6B4A] mt-0.5">{rp(dompetSaldo)}</p>
            </Card>

            {/* Pilihan Nominal Cepat */}
            <div>
              <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
                Pilih Nominal Top-Up
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {quickNominal.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setNominal(n)
                      setCustomInput('')
                    }}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      activeNominal === n && !customInput
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#2D4539] border-[#D5E2DC]'
                    }`}
                  >
                    {rp(n)}
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Kustom */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Atau Ketik Nominal Lain (Rp)
              </label>
              <input
                type="number"
                placeholder="Minimal Rp 10.000"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              />
            </div>

            {/* Pilihan Metode Transfer */}
            <div>
              <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
                Pilih Kanal Pembayaran
              </h3>
              <div className="space-y-2">
                {metodeList.map((m) => {
                  const Icon = m.icon
                  const isSelected = selectedMetode.id === m.id
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMetode(m)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#1A6B4A] bg-[#E6F4EE]'
                          : 'border-[#E2EBE7] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E2EBE7] flex items-center justify-center text-[#1A6B4A]">
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111F1A]">{m.nama}</p>
                          <p className="text-xs text-[#5F7A6E] mt-0.5">{m.va}</p>
                        </div>
                      </div>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#1A6B4A] bg-[#1A6B4A]' : 'border-[#D5E2DC]'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Instruksi Kode Bayar */}
            <Card className="p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5F7A6E]">Nomor Rekening / Kode Pembayaran:</span>
                {salinStatus && (
                  <span className="text-xs font-bold text-[#1A6B4A]">Tersalin ✓</span>
                )}
              </div>
              <div className="flex items-center justify-between bg-[#F4F7F5] p-3 rounded-xl">
                <span className="font-mono font-black text-sm text-[#111F1A]">{selectedMetode.va}</span>
                <button
                  type="button"
                  onClick={handleSalin}
                  className="text-xs font-bold text-[#1A6B4A] flex items-center gap-1 active:scale-95"
                >
                  <Copy size={14} /> Salin
                </button>
              </div>
            </Card>

            <Button
              full
              size="lg"
              variant="primary"
              onClick={handleProsesTopUp}
            >
              Konfirmasi Top-Up {rp(activeNominal)}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
