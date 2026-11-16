import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'

const topupMethods = [
  { icon: '🏦', label: 'Transfer Bank' },
  { icon: '📱', label: 'QRIS' },
  { icon: '🏪', label: 'Minimarket' },
]

export default function Dompet() {
  const navigate = useNavigate()
  const { dompetSaldo, transaksi } = useBankStore()

  // Hitung pemasukan & pengeluaran dompet
  const totalMasuk = transaksi
    .filter(t => t.type === 'in')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalKeluar = transaksi
    .filter(t => t.type === 'out')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0)

  return (
    <div className="w-full">

      {/* ── HEADER HERO ── */}
      <div className="bg-gradient-to-br from-[#0D4A33] to-[#1A6B4A] pt-12 pb-7 px-5 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/70 text-xs font-semibold">Dompet Digital Anggota</p>
          <span className="text-xs bg-white/15 text-white font-bold px-2.5 py-1 rounded-full">
            Tarunesha Pay
          </span>
        </div>

        <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mb-1">Saldo Tersedia</p>
        <p className="text-white text-4xl font-extrabold tracking-tight mb-5">{rp(dompetSaldo)}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dompet/topup')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl py-3 text-white text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="text-base">⬆️</span>
            Top-Up
          </button>
          <button
            onClick={() => navigate('/dompet/scan')}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl py-3 text-white text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="text-base">📷</span>
            Scan QRIS
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('riwayat-dompet')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl py-3 text-white text-xs font-semibold active:scale-95 transition-all"
          >
            <span className="text-base">📊</span>
            Riwayat
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4 pb-20">

        {/* ── STAT ROW ── */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-xl mb-1">📥</p>
            <p className="text-[10px] text-[#8FA89E] font-semibold uppercase tracking-wider mb-0.5">Total Masuk</p>
            <p className="text-base font-extrabold text-[#1A6B4A]">+{shortRp(totalMasuk)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xl mb-1">📤</p>
            <p className="text-[10px] text-[#8FA89E] font-semibold uppercase tracking-wider mb-0.5">Total Keluar</p>
            <p className="text-base font-extrabold text-[#E84040]">-{shortRp(totalKeluar)}</p>
          </Card>
        </div>

        {/* ── TOP-UP METHODS QUICK ACCESS ── */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2.5 px-1">Metode Isi Saldo</p>
          <div className="flex gap-2">
            {topupMethods.map((m) => (
              <Card
                key={m.label}
                onClick={() => navigate('/dompet/topup')}
                className="flex-1 p-3 flex flex-col items-center gap-1.5 cursor-pointer active:scale-95 transition-transform hover:bg-[#F9FAF9]"
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-[11px] font-semibold text-[#4A6358] text-center">{m.label}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* ── SCAN QRIS QUICK ACCESS ── */}
        <Card className="p-4 flex gap-4 items-center">
          <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden grid grid-cols-4 gap-px bg-[#E2EBE7] p-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`${[0,1,3,4,5,7,8,10,12,14,15].includes(i) ? 'bg-[#111F1A]' : 'bg-white'} rounded-sm`} />
            ))}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[#111F1A]">Scan & Bayar Non-Tunai</p>
            <p className="text-xs text-[#4A6358] mt-0.5 leading-relaxed">
              Bayar iuran, belanja stan kegiatan, atau kirim donasi dengan satu sentuhan.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-2.5"
              onClick={() => navigate('/dompet/scan')}
            >
              Buka Pemindai QRIS 📷
            </Button>
          </div>
        </Card>

        {/* ── RIWAYAT TRANSAKSI ── */}
        <div id="riwayat-dompet">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">Riwayat Transaksi Dompet</p>
            <span className="text-xs font-semibold text-[#8FA89E]">{transaksi.length} transaksi</span>
          </div>
          <Card>
            {transaksi.map((t, i) => (
              <div
                key={t.id || i}
                className={`flex items-center gap-3 p-4 ${i < transaksi.length - 1 ? 'border-b border-[#F4F7F5]' : ''}`}
              >
                <div className={`w-10 h-10 ${t.bg} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111F1A] truncate">{t.judul}</p>
                  <p className="text-xs text-[#8FA89E] mt-0.5">{t.sub}</p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${t.amount > 0 ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {t.amount > 0 ? '+' : ''}{shortRp(Math.abs(t.amount))}
                </p>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  )
}
