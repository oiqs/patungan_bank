import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import NailongAvatar from '../components/NailongAvatar'
import { useBankStore } from '../store/useBankStore'
import {
  Bell,
  CreditCard,
  Shuffle,
  HandCoins,
  Heart,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  ShieldAlert,
  Wallet,
  Users
} from 'lucide-react'

export default function Beranda() {
  const navigate = useNavigate()
  const {
    currentUser,
    kasSaldo,
    kasBulanIniMasuk,
    kasBulanIniKeluar,
    dompetSaldo,
    tagihanIuran,
    transaksi,
    notifikasi
  } = useBankStore()

  // Prioritaskan tagihan yang terlambat duluan, baru tagihan belum lunas lainnya
  const tagihanTertunggak = [...tagihanIuran]
    .filter(t => t.status === 'belum' || t.status === 'telat')
    .sort((a, b) => (b.telat ? 1 : 0) - (a.telat ? 1 : 0))[0]

  const unreadNotif = notifikasi.filter(n => !n.dibaca).length

  const pintasan = [
    { icon: CreditCard, label: 'Bayar Iuran', bg: 'bg-[#E6F4EE]', color: 'text-[#1A6B4A]', to: '/kas' },
    { icon: Shuffle,    label: 'Arisan RT',   bg: 'bg-[#FEF3DC]', color: 'text-[#A05C00]', to: '/layanan/arisan' },
    { icon: HandCoins,  label: 'Pinjaman',    bg: 'bg-[#E8EEF9]', color: 'text-[#2B5EA7]', to: '/layanan' },
    { icon: Heart,      label: 'Dana Sosial', bg: 'bg-[#FAEAEA]', color: 'text-[#C93535]', to: '/layanan/kegiatan?tab=sosial' },
  ]

  const isPengurus = ['Bendahara', 'Ketua', 'Sekretaris'].includes(currentUser.peran)

  return (
    <div className="w-full pb-24">

      {/* ── HEADER HIJAU SOLID ── */}
      <div className="bg-[#1A6B4A] pt-12 pb-6 px-5 text-white shadow-sm">
        
        {/* Top bar: Profil & Notifikasi */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate('/profil')}
              className="w-12 h-12 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl cursor-pointer active:scale-95 transition-transform"
            >
              {currentUser.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white/90 text-sm font-medium">Selamat datang,</span>
                <span className="text-xs bg-[#4DB87F] text-[#0D4A33] font-bold px-2 py-0.5 rounded-full">
                  {currentUser.peran}
                </span>
              </div>
              <h2 className="text-white text-lg font-extrabold leading-tight tracking-tight">
                {currentUser.nama}
              </h2>
            </div>
          </div>

          <button
            onClick={() => navigate('/notifikasi')}
            className="relative w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white active:scale-90 transition-transform"
            aria-label="Notifikasi"
          >
            <Bell size={20} />
            {unreadNotif > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#F5A623] rounded-full border-2 border-[#1A6B4A]" />
            )}
          </button>
        </div>

        {/* ── DOMPET SAYA (UANG PRIBADI WARGA) ── */}
        <div className="bg-[#124E35] rounded-2xl p-4 border border-white/15 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-semibold">
              <Wallet size={15} />
              <span>Saldo Dompet Saya</span>
            </div>
            <p className="text-white text-2xl font-black tracking-tight mt-1">
              {rp(dompetSaldo)}
            </p>
          </div>
          <button
            onClick={() => navigate('/dompet/topup')}
            className="bg-[#4DB87F] hover:bg-[#3ea06d] text-[#0A3D28] text-sm font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
          >
            + Isi Saldo
          </button>
        </div>

      </div>

      <div className="px-4 -mt-3 space-y-4">

        {/* ════ PRIORITAS UTAMA: KARTU TAGIHAN WARGA ════ */}
        {tagihanTertunggak ? (
          <div className="bg-white border-2 border-[#F5A623] rounded-2xl p-4 shadow-md animate-scale-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3DC] text-[#A05C00] flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertCircle size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E84040] bg-[#FDEAEA] px-2.5 py-0.5 rounded-full">
                    {tagihanTertunggak.telat ? '⚠️ Terlambat' : 'Perlu Dibayar'}
                  </span>
                  <span className="text-xs text-[#5F7A6E]">
                    Jatuh tempo: {tagihanTertunggak.jatuhTempo}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#111F1A] mt-1 truncate">
                  {tagihanTertunggak.judul}
                </h3>
                <p className="text-xl font-black text-[#1A6B4A] mt-0.5">
                  {rp(tagihanTertunggak.nominal)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2EBE7] flex items-center gap-2">
              <Button
                variant="primary"
                size="md"
                full
                onClick={() => navigate('/kas')}
                className="shadow-sm"
              >
                Bayar Sekarang ({rp(tagihanTertunggak.nominal)})
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#4DB87F]/40 rounded-2xl p-4 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#1A6B4A]">Semua Iuran Wajib Lunas</h3>
              <p className="text-xs text-[#5F7A6E] mt-0.5">Terima kasih atas kedisiplinan gotong royong Anda.</p>
            </div>
          </div>
        )}

        {/* ════ KARTU KAS RT (MILIK BERSAMA) ════ */}
        <Card className="p-4 bg-white border border-[#D5E2DC]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2D4539]">
                  Uang Kas RT 05 (Milik Bersama)
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/kas')}
              className="text-xs font-bold text-[#1A6B4A] hover:underline flex items-center gap-0.5"
            >
              <span>Buku Kas</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <p className="text-2xl font-black text-[#111F1A] tracking-tight mt-1 mb-1">
            {rp(kasSaldo)}
          </p>
          <p className="text-xs text-[#5F7A6E]">
            Dana warga tersimpan aman &amp; diawasi bersama secara transparan
          </p>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#E2EBE7]">
            <div className="bg-[#F4F7F5] rounded-xl p-2.5">
              <p className="text-xs font-medium text-[#5F7A6E]">Pemasukan Bulan Ini</p>
              <p className="text-sm font-bold text-[#1A6B4A] mt-0.5">↑ {shortRp(kasBulanIniMasuk)}</p>
            </div>
            <div className="bg-[#F4F7F5] rounded-xl p-2.5">
              <p className="text-xs font-medium text-[#5F7A6E]">Pengeluaran Bulan Ini</p>
              <p className="text-sm font-bold text-[#E84040] mt-0.5">↓ {shortRp(kasBulanIniKeluar)}</p>
            </div>
          </div>
        </Card>

        {/* ── BANNER KHUSUS PENGURUS ── */}
        {isPengurus && (
          <div
            onClick={() => navigate('/pengurus')}
            className="bg-[#1A6B4A] rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer active:scale-98 transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                <ShieldAlert size={20} />
              </div>
              <div>
                <span className="text-xs font-bold text-[#F5A623]">AKSES PENGURUS</span>
                <p className="text-sm font-bold leading-tight">Buka Pusat Kendali Pengurus</p>
              </div>
            </div>
            <span className="text-white font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl">
              Buka →
            </span>
          </div>
        )}

        {/* ── PINTASAN LAYANAN UTAMA (4 IKON BESAR & MUDAH DITAP) ── */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2.5 px-1">
            Pintasan Layanan Warga
          </h3>
          <div className="grid grid-cols-4 gap-2.5">
            {pintasan.map((p) => {
              const Icon = p.icon
              return (
                <button
                  key={p.label}
                  onClick={() => navigate(p.to)}
                  className="bg-white border border-[#E2EBE7] rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-xs hover:border-[#1A6B4A]"
                >
                  <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center shadow-xs`}>
                    <Icon size={26} strokeWidth={2.2} />
                  </div>
                  <span className="text-xs font-bold text-[#2D4539] text-center leading-tight">
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── KARTU patuAI ASISTEN ── */}
        <div
          onClick={() => navigate('/ai-asisten')}
          className="bg-white border-2 border-[#1A6B4A]/25 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer active:scale-98 transition-all shadow-xs hover:border-[#1A6B4A]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E6F4EE] border border-[#1A6B4A]/20 flex items-center justify-center p-1.5 flex-shrink-0">
            <NailongAvatar className="w-9 h-9" animated />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-bold text-sm text-[#111F1A]">patuAI Asisten</span>
              <span className="text-xs bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2 py-0.5 rounded-full">
                AI Pintar
              </span>
            </div>
            <p className="text-xs text-[#5F7A6E] leading-relaxed truncate">
              Tanya tagihan, simulasi pinjaman, atau kas RT
            </p>
          </div>
          <div className="flex-shrink-0 bg-[#1A6B4A] text-white rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1 shadow-xs">
            <span>Tanya</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* ── PENGUMUMAN RAPAT / AGENDA ── */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
            Pengumuman &amp; Agenda Terkini
          </h3>
          <Card className="p-4 flex gap-3.5 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3DC] text-[#A05C00] flex items-center justify-center flex-shrink-0">
              <Calendar size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#111F1A]">Rapat Koordinasi &amp; Arisan Bulanan</p>
              <p className="text-xs text-[#5F7A6E] mt-0.5">Jumat, 20 Nov 2026 · 19:30 WIB (Balai RW 05)</p>
              <p className="text-xs text-[#456355] mt-2 leading-relaxed">
                Agenda: Pembahasan transparansi kas akhir tahun dan pengocokan nomor arisan periode November.
              </p>
            </div>
          </Card>
        </div>

        {/* ── AKTIVITAS TERBARU ── */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-bold text-[#111F1A]">Aktivitas Terakhir</h3>
            <button
              onClick={() => navigate('/kas')}
              className="text-xs font-bold text-[#1A6B4A] hover:underline"
            >
              Lihat Kas Resmi →
            </button>
          </div>
          <Card>
            {transaksi.slice(0, 4).map((a, i) => (
              <div
                key={a.id || i}
                className={`flex items-center gap-3 p-3.5 ${i < Math.min(transaksi.length, 4) - 1 ? 'border-b border-[#F4F7F5]' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  a.amount > 0 ? 'bg-[#E6F4EE] text-[#1A6B4A]' : 'bg-[#FDEAEA] text-[#E84040]'
                }`}>
                  {a.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#111F1A] truncate">{a.judul}</p>
                  <p className="text-xs text-[#5F7A6E] mt-0.5">{a.sub}</p>
                </div>
                <p className={`text-base font-black flex-shrink-0 ${a.amount > 0 ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
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
