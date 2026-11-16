import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Dices,
  Landmark,
  Heart,
  Bell,
  User,
  AlertTriangle,
  Check,
  ShieldCheck,
  Clock,
  Megaphone,
  ChevronRight,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import NailongAvatar from '../components/NailongAvatar'
import { useBankStore } from '../store/useBankStore'

export default function Beranda() {
  const navigate = useNavigate()
  const {
    currentUser,
    kasSaldo,
    kasBulanIniMasuk,
    kasBulanIniKeluar,
    tagihanIuran,
    transaksi,
    notifikasi
  } = useBankStore()

  const tagihanTertunggak = tagihanIuran.find(t => t.status === 'belum')
  const unreadNotif = notifikasi.filter(n => !n.dibaca).length

  const pintasan = [
    { icon: CreditCard, label: 'Bayar Iuran', bg: 'bg-[#E6F4EE]', color: 'text-[#1A6B4A]', to: '/kas' },
    { icon: Dices,      label: 'Arisan',      bg: 'bg-[#FEF3DC]', color: 'text-[#B7791F]', to: '/layanan/arisan' },
    { icon: Landmark,   label: 'Pinjaman',    bg: 'bg-[#E8EEF9]', color: 'text-[#2B6CB0]', to: '/layanan/ajukan-pinjaman' },
    { icon: Heart,      label: 'Donasi',      bg: 'bg-[#FAEAEA]', color: 'text-[#C53030]', to: '/layanan/kegiatan' },
  ]

  const isPengurus = ['Bendahara', 'Ketua', 'Sekretaris'].includes(currentUser.peran)

  return (
    <div className="w-full">

      {/* ── HEADER HERO ── */}
      <div className="bg-gradient-to-br from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] pt-12 pb-7 px-5 rounded-b-[32px]">

        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white/70 text-xs font-medium">Halo, Warga</p>
              <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                {currentUser.peran}
              </span>
            </div>
            <p className="text-white text-lg font-bold leading-tight mt-0.5">{currentUser.nama}</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => navigate('/notifikasi')}
              className="relative w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4 stroke-[2]" />
              {unreadNotif > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F5A623] rounded-full border-2 border-[#1A6B4A]" />
              )}
            </button>
            <div
              onClick={() => navigate('/profil')}
              className="w-9 h-9 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white cursor-pointer active:scale-90 transition-transform"
              title="Profil Saya"
            >
              <User className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Balance card */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
          {/* Top row: Label & Status Badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4DB87F] shadow-[0_0_8px_#4DB87F]" />
              <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wider">
                Kas Tarunesha RT 05
              </p>
            </div>
            {tagihanTertunggak ? (
              <span
                onClick={() => navigate('/kas')}
                className="bg-[#F5A623]/25 border border-[#F5A623]/50 text-[#FDD280] text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer active:scale-95 transition-transform flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-3 h-3 text-[#FDD280] stroke-[2.2]" />
                <span>Ada Tagihan</span>
              </span>
            ) : (
              <span className="bg-[#4DB87F]/25 border border-[#4DB87F]/50 text-[#A6E8C2] text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
                <Check className="w-3 h-3 text-[#A6E8C2] stroke-[2.5]" />
                <span>Semua Lunas</span>
              </span>
            )}
          </div>

          {/* Saldo Nominal */}
          <p className="text-white text-3xl font-extrabold tracking-tight mt-1 mb-1">{rp(kasSaldo)}</p>
          <p className="text-white/60 text-xs">Transparan & dapat dipantau seluruh warga</p>

          <div className="flex gap-4 mt-4 pt-4 border-t border-white/15">
            <div className="flex-1">
              <p className="text-white/55 text-[10px] font-semibold uppercase tracking-wider mb-1">Pemasukan Bulan Ini</p>
              <p className="text-[#4DB87F] text-sm font-bold flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                {shortRp(kasBulanIniMasuk)}
              </p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex-1">
              <p className="text-white/55 text-[10px] font-semibold uppercase tracking-wider mb-1">Pengeluaran Bulan Ini</p>
              <p className="text-[#FF8080] text-sm font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                {shortRp(kasBulanIniKeluar)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">

        {/* ── BANNER KHUSUS PENGURUS ── */}
        {isPengurus && (
          <div
            onClick={() => navigate('/pengurus')}
            className="bg-gradient-to-r from-[#0D4A33] to-[#1A6B4A] rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#F5A623]">
                <ShieldCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#F5A623]">AKSES PENGURUS</p>
                <p className="text-sm font-bold">Buka Panel Pengurus</p>
              </div>
            </div>
            <span className="text-white/80 font-bold text-sm flex items-center gap-1">
              Masuk <ArrowRight className="w-4 h-4 stroke-[2]" />
            </span>
          </div>
        )}

        {/* ── PINTASAN ── */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2.5 px-1">Pintasan Layanan</p>
          <div className="grid grid-cols-4 gap-3">
            {pintasan.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.label}
                  onClick={() => navigate(p.to)}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#4A6358] text-center leading-tight">{p.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── FITUR AI ASSISTANT CARD ── */}
        <div
          onClick={() => navigate('/ai-asisten')}
          className="bg-gradient-to-r from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] rounded-2xl p-3.5 text-white flex items-center gap-3 cursor-pointer active:scale-98 transition-all shadow-md border border-white/20"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner border border-white/20">
            <NailongAvatar className="w-8 h-8" animated />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-sm text-white tracking-tight">patuAI Asisten</span>
              <span className="text-[9px] bg-[#F5A623] text-[#111F1A] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap leading-none shadow-sm">
                AI
              </span>
            </div>
            <p className="text-[11px] text-white/80 leading-tight truncate">
              Cek tagihan, simulasi cicilan & ringkas kas
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1 text-white shadow-sm active:scale-95 transition-all">
            <span>Tanya</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </div>

        {/* ── ALERT TAGIHAN JATUH TEMPO ── */}
        {tagihanTertunggak && (
          <div className="bg-[#FEF3DC] border border-[#F5A623]/30 border-l-4 border-l-[#F5A623] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0 text-[#7A5000]">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#7A5000]">{tagihanTertunggak.judul}</p>
              <p className="text-xs text-[#9A6A10] mt-0.5">
                Jatuh tempo: {tagihanTertunggak.jatuhTempo} ({rp(tagihanTertunggak.nominal)})
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/kas')}
            >
              Bayar
            </Button>
          </div>
        )}

        {/* ── PENGUMUMAN RAPAT / AGENDA ── */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2.5 px-1">Pengumuman Terkini</p>
          <Card className="p-4 flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-[#E6F4EE] flex items-center justify-center flex-shrink-0 text-[#1A6B4A]">
              <Megaphone className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#111F1A]">Rapat Koordinasi – 20 Nov 2026</p>
              <p className="text-xs text-[#8FA89E] mt-0.5">Pukul 19:00 WIB · Balai RW 05 Tarunesha</p>
              <p className="text-[11px] text-[#4A6358] mt-1.5 leading-relaxed">
                Agenda: Evaluasi laporan kas triwulan dan persiapan kegiatan bakti sosial akhir tahun.
              </p>
            </div>
          </Card>
        </div>

        {/* ── AKTIVITAS TERBARU ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">Aktivitas Terakhir</p>
            <button
              onClick={() => navigate('/kas')}
              className="text-xs font-semibold text-[#1A6B4A] active:scale-95 flex items-center gap-0.5"
            >
              Lihat Kas Resmi <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>
          </div>
          <Card>
            {transaksi.slice(0, 4).map((a, i) => (
              <div
                key={a.id || i}
                className={`flex items-center gap-3 p-4 ${i < Math.min(transaksi.length, 4) - 1 ? 'border-b border-[#F4F7F5]' : ''}`}
              >
                <div className={`w-10 h-10 ${a.bg} rounded-xl flex items-center justify-center flex-shrink-0 ${a.amount > 0 ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {a.amount > 0 ? (
                    <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111F1A] truncate">{a.judul}</p>
                  <p className="text-xs text-[#8FA89E] mt-0.5">{a.sub}</p>
                </div>
                <p className={`text-sm font-bold flex-shrink-0 ${a.amount > 0 ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {a.amount > 0 ? '+' : ''}{shortRp(Math.abs(a.amount))}
                </p>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  )
}
