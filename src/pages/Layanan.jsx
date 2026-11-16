import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'
import {
  Shuffle,
  HandCoins,
  CalendarDays,
  HeartHandshake,
  Plus,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react'

export default function Layanan() {
  const navigate = useNavigate()
  const {
    currentUser,
    pinjamanList,
    bayarCicilanPinjaman,
  } = useBankStore()

  const [bayarNotif, setBayarNotif] = useState('')

  const layananMenu = [
    {
      icon: Shuffle,
      label: 'Arisan RT Digital',
      bg: 'bg-[#FEF3DC]',
      color: 'text-[#A05C00]',
      desc: 'Setoran bulanan & undian putaran transparan',
      badge: 'Putaran 3 Aktif',
      to: '/layanan/arisan'
    },
    {
      icon: HandCoins,
      label: 'Pembiayaan Usaha',
      bg: 'bg-[#E8EEF9]',
      color: 'text-[#2B5EA7]',
      desc: 'Modal usaha mikro & gotong royong tanpa agunan',
      badge: `${pinjamanList.length} Aktif`,
      to: '/layanan/ajukan-pinjaman'
    },
    {
      icon: CalendarDays,
      label: 'Kegiatan Warga',
      bg: 'bg-[#E6F4EE]',
      color: 'text-[#1A6B4A]',
      desc: 'Gotong royong, peringatan 17-an & perbaikan jalan',
      badge: '2 Agenda',
      to: '/layanan/kegiatan?tab=kegiatan'
    },
    {
      icon: HeartHandshake,
      label: 'Dana Sosial & Duka',
      bg: 'bg-[#FAEAEA]',
      color: 'text-[#C93535]',
      desc: 'Santunan warga sakit, duka, dan bantuan darurat',
      badge: 'Tersedia',
      to: '/layanan/kegiatan?tab=sosial'
    },
  ]

  const handleBayarCicilan = (p) => {
    const success = bayarCicilanPinjaman(p.id, p.cicilanPerBulan)
    if (success) {
      setBayarNotif(`Cicilan bulan ini berhasil dibayar via saldo dompet!`)
      setTimeout(() => setBayarNotif(''), 2500)
    } else {
      setBayarNotif('Saldo dompet tidak cukup! Silakan isi saldo di menu Dompet.')
      setTimeout(() => setBayarNotif(''), 2500)
    }
  }

  return (
    <div className="w-full pb-24">

      {/* ── HEADER HALAMAN ── */}
      <div className="bg-white border-b border-[#E2EBE7] pt-12 pb-3 px-5">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">
          Layanan Komunitas
        </h1>
        <p className="text-sm text-[#5F7A6E] mt-0.5">
          Program gotong royong &amp; kesejahteraan warga RT 05
        </p>
      </div>

      <div className="px-4 py-4 space-y-5">

        {/* ── GRID 4 LAYANAN KOMUNITAS ── */}
        <div className="grid grid-cols-2 gap-3">
          {layananMenu.map((l) => {
            const Icon = l.icon
            return (
              <Card
                key={l.label}
                onClick={() => navigate(l.to)}
                className="p-4 cursor-pointer active:scale-95 transition-transform hover:border-[#1A6B4A] flex flex-col justify-between min-h-[140px]"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 ${l.bg} ${l.color} rounded-2xl flex items-center justify-center shadow-xs`}>
                      <Icon size={24} strokeWidth={2.2} />
                    </div>
                    {l.badge && (
                      <span className="text-xs font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2 py-0.5 rounded-full">
                        {l.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#111F1A] leading-tight">{l.label}</h3>
                  <p className="text-xs text-[#5F7A6E] mt-1 leading-relaxed">{l.desc}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* ── BAGIAN RINGKASAN PEMBIAYAAN & PINJAMAN BERJALAN ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-[#111F1A]">
              Pembiayaan Bergulir Warga
            </h3>
            <button
              onClick={() => navigate('/layanan/ajukan-pinjaman')}
              className="text-sm font-bold text-[#1A6B4A] hover:underline flex items-center gap-1"
            >
              <Plus size={16} />
              <span>Ajukan Baru</span>
            </button>
          </div>

          {/* Kartu Skor Reputasi & Plafon */}
          <div
            onClick={() => navigate('/profil/skor')}
            className="bg-white border-2 border-[#1A6B4A]/25 rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-98 transition-all hover:border-[#1A6B4A] shadow-xs"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E6F4EE] text-[#1A6B4A] border border-[#1A6B4A]/30 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xl font-black leading-none">{currentUser.skor}</span>
              <span className="text-[10px] font-bold text-[#1A6B4A] mt-0.5">SKOR</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#111F1A]">Skor Kelayakan Anggota</p>
                <span className="text-xs text-[#1A6B4A] font-bold flex items-center">
                  Rincian <ChevronRight size={14} />
                </span>
              </div>
              <p className="text-xs text-[#5F7A6E] mt-0.5">Batas plafon pembiayaan tersedia:</p>
              <p className="text-lg font-black text-[#1A6B4A] mt-0.5">
                {rp(currentUser.plafonTersedia)}
              </p>
            </div>
          </div>

          {bayarNotif && (
            <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-sm font-bold p-3 rounded-2xl text-center animate-fade-in">
              {bayarNotif}
            </div>
          )}

          {/* Daftar Pinjaman Aktif Milik Pengguna */}
          <div className="space-y-3 pt-1">
            <h4 className="text-sm font-bold text-[#2D4539] px-1">Pinjaman Aktif Anda</h4>

            {pinjamanList.length === 0 ? (
              <Card className="p-5 text-center">
                <p className="text-sm text-[#5F7A6E]">Belum ada pinjaman berjalan.</p>
                <div className="mt-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/layanan/ajukan-pinjaman')}
                  >
                    + Ajukan Pembiayaan Modal
                  </Button>
                </div>
              </Card>
            ) : (
              pinjamanList.map((p) => {
                const sisaCicilan = p.tenorBulan - p.cicilanTerbayar
                const isLunas = sisaCicilan <= 0

                return (
                  <Card key={p.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2.5 py-0.5 rounded-full">
                            {p.kategori}
                          </span>
                          <span className="text-xs text-[#5F7A6E]">
                            Tenor {p.tenorBulan} bulan
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-[#111F1A] mt-1">{p.nama}</h4>
                        <p className="text-sm text-[#5F7A6E]">
                          Total pinjaman: <strong className="text-[#111F1A]">{rp(p.nominal)}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#5F7A6E] block">Cicilan / bulan</span>
                        <span className="text-base font-black text-[#1A6B4A]">
                          {rp(p.cicilanPerBulan)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#F4F7F5] rounded-xl p-3 flex items-center justify-between text-xs text-[#2D4539]">
                      <div>
                        <span>Kemajuan Angsuran: </span>
                        <strong>{p.cicilanTerbayar} dari {p.tenorBulan} bulan</strong>
                      </div>
                      <span className="font-bold text-[#1A6B4A]">
                        {Math.round((p.cicilanTerbayar / p.tenorBulan) * 100)}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#E2EBE7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A6B4A] rounded-full transition-all"
                        style={{ width: `${(p.cicilanTerbayar / p.tenorBulan) * 100}%` }}
                      />
                    </div>

                    {!isLunas ? (
                      <Button
                        full
                        size="md"
                        variant="primary"
                        onClick={() => handleBayarCicilan(p)}
                      >
                        Bayar Cicilan Bulan Ini ({rp(p.cicilanPerBulan)})
                      </Button>
                    ) : (
                      <div className="text-center py-1 text-sm font-bold text-[#1A6B4A] flex items-center justify-center gap-1.5">
                        <CheckCircle2 size={16} /> Pinjaman Telah Lunas Sempurna
                      </div>
                    )}
                  </Card>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
