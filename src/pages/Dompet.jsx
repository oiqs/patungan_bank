import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'
import {
  Wallet,
  Plus,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  ShieldCheck,
  Receipt
} from 'lucide-react'

export default function Dompet() {
  const navigate = useNavigate()
  const { dompetSaldo, transaksi } = useBankStore()

  const totalMasuk = transaksi
    .filter(t => t.type === 'in')
    .reduce((acc, curr) => acc + curr.amount, 0)

  const totalKeluar = transaksi
    .filter(t => t.type === 'out')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0)

  return (
    <div className="w-full pb-24">

      {/* ── HEADER SALDO DOMPET SAYA ── */}
      <div className="bg-[#1A6B4A] pt-12 pb-7 px-5 text-white shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wallet size={18} />
            <span className="text-white/90 text-sm font-bold">Dompet Pribadi Saya</span>
          </div>
          <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full">
            Tarunesha Pay
          </span>
        </div>

        <p className="text-white/80 text-xs font-semibold mb-1">Saldo Tersedia untuk Transaksi</p>
        <p className="text-white text-4xl font-black tracking-tight mb-5">{rp(dompetSaldo)}</p>

        {/* Action Buttons Utama */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/dompet/topup')}
            className="flex items-center justify-center gap-2 bg-[#4DB87F] hover:bg-[#3ea06d] text-[#0A3D28] rounded-xl py-3 text-sm font-bold active:scale-95 transition-all shadow-xs"
          >
            <Plus size={18} />
            <span>Isi Saldo (Top-Up)</span>
          </button>
          <button
            onClick={() => navigate('/dompet/scan')}
            className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl py-3 text-white text-sm font-bold active:scale-95 transition-all"
          >
            <QrCode size={18} />
            <span>Scan QRIS</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── RINGKASAN PEMASUKAN & PENGELUARAN ── */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center flex-shrink-0">
              <ArrowDownLeft size={20} />
            </div>
            <div>
              <p className="text-xs text-[#5F7A6E] font-medium">Total Masuk</p>
              <p className="text-base font-extrabold text-[#1A6B4A]">+{shortRp(totalMasuk)}</p>
            </div>
          </Card>
          <Card className="p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDEAEA] text-[#E84040] flex items-center justify-center flex-shrink-0">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <p className="text-xs text-[#5F7A6E] font-medium">Total Terpakai</p>
              <p className="text-base font-extrabold text-[#E84040]">-{shortRp(totalKeluar)}</p>
            </div>
          </Card>
        </div>

        {/* ── BANNER PEMBAYARAN IURAN CEPAT ── */}
        <Card className="p-4 bg-white border border-[#D5E2DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
              <Receipt size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#111F1A]">Bayar Iuran dari Dompet</p>
              <p className="text-xs text-[#5F7A6E]">Otomatis terpotong tanpa biaya admin</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/kas')}
          >
            Buka Kas
          </Button>
        </Card>

        {/* ── RIWAYAT TRANSAKSI DOMPET ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-bold text-[#111F1A]">Riwayat Transaksi Dompet</h3>
            <span className="text-xs text-[#5F7A6E]">{transaksi.length} transaksi</span>
          </div>

          <Card className="divide-y divide-[#F4F7F5]">
            {transaksi.map((t) => (
              <div key={t.id} className="p-3.5 flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  t.type === 'in' ? 'bg-[#E6F4EE] text-[#1A6B4A]' : 'bg-[#FDEAEA] text-[#E84040]'
                }`}>
                  {t.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#111F1A] truncate">{t.judul}</p>
                  <p className="text-xs text-[#5F7A6E] mt-0.5">{t.sub}</p>
                </div>
                <p className={`text-base font-black flex-shrink-0 ${
                  t.type === 'in' ? 'text-[#1A6B4A]' : 'text-[#E84040]'
                }`}>
                  {t.type === 'in' ? '+' : '-'}{rp(Math.abs(t.amount))}
                </p>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  )
}
