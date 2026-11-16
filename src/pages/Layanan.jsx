import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sprout,
  Waves,
  AlertCircle,
  Users,
  Landmark,
  Calendar,
  HeartHandshake,
  Calculator,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'

const jenisPinjaman = [
  { icon: Sprout, label: 'Pertanian', color: 'text-[#1A6B4A]' },
  { icon: Waves, label: 'Perikanan', color: 'text-[#2B6CB0]' },
  { icon: AlertCircle, label: 'Pribadi/Darurat', color: 'text-[#E84040]' },
]

export default function Layanan() {
  const navigate = useNavigate()
  const {
    currentUser,
    pinjamanList,
    bayarCicilanPinjaman,
  } = useBankStore()

  const [jenis, setJenis] = useState(0)
  const [nominal, setNominal] = useState(1200000)
  const [tenor, setTenor] = useState(6)
  const [bayarNotif, setBayarNotif] = useState('')

  const cicilan = Math.round(nominal * (1 + (tenor * 0.015)) / tenor)

  const layananMenu = [
    {
      icon: Users, label: 'Arisan Digital', bg: 'bg-[#FEF3DC]', color: 'text-[#B7791F]',
      desc: 'Jadwal setoran & undian transparan',
      badge: 'Aktif',
      to: '/layanan/arisan'
    },
    {
      icon: Landmark, label: 'Pembiayaan', bg: 'bg-[#E8EEF9]', color: 'text-[#2B6CB0]',
      desc: 'Modal usaha tani & darurat',
      badge: `${pinjamanList.length} Aktif`,
      to: '/layanan/ajukan-pinjaman'
    },
    {
      icon: Calendar, label: 'Kegiatan Warga', bg: 'bg-[#E6F4EE]', color: 'text-[#1A6B4A]',
      desc: '17-an, tahun baru, gotong royong',
      badge: '2 Event',
      to: '/layanan/kegiatan'
    },
    {
      icon: HeartHandshake, label: 'Dana Sosial', bg: 'bg-[#FAEAEA]', color: 'text-[#C53030]',
      desc: 'Santunan warga sakit & duka',
      badge: 'Open',
      to: '/layanan/kegiatan'
    },
  ]

  const handleBayarCicilan = (p) => {
    const success = bayarCicilanPinjaman(p.id, p.cicilanPerBulan)
    if (success) {
      setBayarNotif('Cicilan berhasil dibayar via saldo dompet!')
      setTimeout(() => setBayarNotif(''), 2000)
    } else {
      setBayarNotif('Saldo dompet kurang! Silakan isi saldo terlebih dahulu.')
      setTimeout(() => setBayarNotif(''), 2500)
    }
  }

  return (
    <div className="w-full">

      {/* ── HEADER ── */}
      <div className="bg-[#F4F7F5] pt-12 pb-2 px-5">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">Layanan Komunitas</h1>
        <p className="text-xs text-[#8FA89E] mt-0.5">Arisan digital, pinjaman produktif & gotong royong</p>
      </div>

      <div className="px-4 mt-3 space-y-5 pb-20">

        {/* ── LAYANAN GRID ── */}
        <div className="grid grid-cols-2 gap-3">
          {layananMenu.map((l) => {
            const Icon = l.icon
            return (
              <Card
                key={l.label}
                onClick={() => navigate(l.to)}
                className="p-4 cursor-pointer active:scale-95 transition-transform hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div className={`w-11 h-11 ${l.bg} ${l.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  {l.badge && (
                    <span className="text-[10px] font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2 py-0.5 rounded-full">
                      {l.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#111F1A]">{l.label}</p>
                <p className="text-xs text-[#8FA89E] mt-0.5 leading-relaxed">{l.desc}</p>
              </Card>
            )
          })}
        </div>

        {/* ── PEMBIAYAAN SECTION ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">Pembiayaan Bergulir</p>
            <button
              onClick={() => navigate('/layanan/ajukan-pinjaman')}
              className="text-xs font-bold text-[#1A6B4A]"
            >
              + Ajukan Pinjaman
            </button>
          </div>

          {/* Score card */}
          <div
            onClick={() => navigate('/profil/skor')}
            className="bg-gradient-to-r from-[#1A6B4A] to-[#4DB87F] rounded-2xl p-4 flex items-center gap-4 mb-3 shadow-[0_4px_16px_rgba(26,107,74,0.3)] cursor-pointer active:scale-98 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-white/15 border-2 border-white/40 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xl font-extrabold text-white leading-none">{currentUser.skor}</span>
              <span className="text-[9px] text-white/70 font-semibold mt-0.5">SKOR</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-sm">Skor Kelayakan Anda</p>
                <span className="text-[10px] text-white/80 font-bold flex items-center gap-0.5">
                  Rincian <ArrowRight className="w-3 h-3 stroke-[2]" />
                </span>
              </div>
              <p className="text-white/70 text-xs">Plafon pembiayaan tersedia</p>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-1.5">
                {shortRp(currentUser.plafonTersedia)}
              </span>
            </div>
          </div>

          {/* Jenis selector */}
          <div className="flex gap-2 mb-3">
            {jenisPinjaman.map((j, i) => {
              const Icon = j.icon
              return (
                <button
                  key={j.label}
                  onClick={() => setJenis(i)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border-2 transition-all text-sm ${
                    jenis === i
                      ? 'border-[#1A6B4A] bg-[#E8F4EE] font-bold'
                      : 'border-[#E2EBE7] bg-white'
                  }`}
                >
                  <div className={j.color}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#4A6358]">{j.label}</span>
                </button>
              )
            })}
          </div>

          {/* Simulasi */}
          <Card className="p-4">
            <p className="text-sm font-bold text-[#111F1A] mb-2 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#1A6B4A] stroke-[2]" />
              Simulasi Pinjaman Mandiri
            </p>
            <p className="text-2xl font-extrabold text-[#1A6B4A] mb-2">{rp(nominal)}</p>

            <input
              type="range"
              min={200000}
              max={currentUser.plafonTersedia}
              step={100000}
              value={nominal}
              onChange={e => setNominal(+e.target.value)}
              className="w-full mb-1 accent-[#1A6B4A]"
            />
            <div className="flex justify-between text-[10px] text-[#8FA89E] mb-3">
              <span>Rp 200rb</span><span>{shortRp(currentUser.plafonTersedia)}</span>
            </div>

            {/* Tenor */}
            <div className="flex gap-2 mb-4">
              {[3, 6, 12].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenor(t)}
                  className={`flex-1 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                    tenor === t
                      ? 'border-[#1A6B4A] bg-[#E8F4EE] text-[#1A6B4A]'
                      : 'border-[#E2EBE7] bg-white text-[#4A6358]'
                  }`}
                >
                  {t} Bulan
                </button>
              ))}
            </div>

            {/* Result */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Cicilan/bln', val: shortRp(cicilan) },
                { label: 'Total Bayar', val: shortRp(cicilan * tenor) },
                { label: 'Jasa Gotong', val: '1.5%/bln' },
              ].map((r) => (
                <div key={r.label} className="bg-[#F4F7F5] rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-[#8FA89E] font-semibold mb-0.5">{r.label}</p>
                  <p className="text-xs font-extrabold text-[#111F1A]">{r.val}</p>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              full
              className="flex items-center justify-center gap-1.5"
              onClick={() => navigate('/layanan/ajukan-pinjaman')}
            >
              Ajukan Pembiayaan Ini
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </Button>
          </Card>

          {/* Pinjaman aktif */}
          {pinjamanList.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
                Pinjaman Sedang Berjalan
              </p>

              {bayarNotif && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center mb-2 ${
                  bayarNotif.includes('berhasil') ? 'bg-green-50 text-[#1A6B4A]' : 'bg-red-50 text-[#E84040]'
                }`}>
                  {bayarNotif}
                </div>
              )}

              {pinjamanList.map((p) => {
                const pct = Math.round((p.terbayar / p.nominal) * 100)
                return (
                  <Card key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#E8EEF9] text-[#2B6CB0] flex items-center justify-center flex-shrink-0">
                          <Landmark className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#111F1A]">
                            {p.judul}
                          </p>
                          <p className="text-xs text-[#8FA89E] mt-0.5">
                            Cair {p.tglPencairan} · Tenor {p.tenorBulan} bulan
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2.5 py-1 rounded-full">
                        {p.status}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#F4F7F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A6B4A] to-[#4DB87F] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-[#8FA89E]">
                      <span>Terbayar: {shortRp(p.terbayar)} / {shortRp(p.nominal)}</span>
                      <span>Sisa pokok: {shortRp(p.sisaPokok)}</span>
                    </div>

                    {p.sisaPokok > 0 && (
                      <Button
                        variant="primary"
                        full
                        size="sm"
                        onClick={() => handleBayarCicilan(p)}
                      >
                        Bayar Cicilan ke-{p.cicilanKe} ({rp(p.cicilanPerBulan)})
                      </Button>
                    )}
                  </Card>
                )
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
