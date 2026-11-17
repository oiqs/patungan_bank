import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Landmark,
  AlertTriangle,
  ClipboardCheck,
  Sprout,
  PlusCircle,
  Banknote,
  CheckCircle2,
  Check,
  X,
  FileText,
  UserCheck,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function PanelPengurus() {
  const navigate = useNavigate()
  const {
    currentUser = {},
    kasSaldo = 0,
    verifikasiPembayaranPending = [],
    pengajuanPinjamanPending = [],
    kasKeluarPending = [],
    verifikasiPembayaran,
    verifikasiPembayaranAction,
    setujuiPengajuanPinjaman,
    tolakPengajuanPinjaman,
    persetujuanPinjamanAction,
    anggotaList = [],
    anggota = [],
    loginAsPreset,
  } = useBankStore()

  const [pesanSukses, setPesanSukses] = useState('')

  const rawAnggota = (anggotaList && anggotaList.length > 0) ? anggotaList : (anggota || [])
  const listVerif = verifikasiPembayaranPending || []
  const listPengajuan = pengajuanPinjamanPending || []
  const listKasKeluar = kasKeluarPending || []

  const handleVerif = (id, terima) => {
    if (typeof verifikasiPembayaran === 'function') {
      verifikasiPembayaran(id, terima)
    } else if (typeof verifikasiPembayaranAction === 'function') {
      verifikasiPembayaranAction(id, terima)
    }
    setPesanSukses(terima ? 'Pembayaran berhasil diverifikasi!' : 'Pembayaran ditolak.')
    setTimeout(() => setPesanSukses(''), 2000)
  }

  const handlePersetujuanPinjaman = (id, setuju) => {
    if (setuju) {
      if (typeof setujuiPengajuanPinjaman === 'function') {
        setujuiPengajuanPinjaman(id)
      } else if (typeof persetujuanPinjamanAction === 'function') {
        persetujuanPinjamanAction(id, true)
      }
      setPesanSukses('Pinjaman disetujui dan dicairkan ke anggota!')
    } else {
      if (typeof tolakPengajuanPinjaman === 'function') {
        tolakPengajuanPinjaman(id)
      } else if (typeof persetujuanPinjamanAction === 'function') {
        persetujuanPinjamanAction(id, false)
      }
      setPesanSukses('Pengajuan pinjaman ditolak.')
    }
    setTimeout(() => setPesanSukses(''), 2000)
  }

  const anggotaMenunggak = rawAnggota.filter(a => a?.statusIuran !== 'lunas').length
  const currentPeran = currentUser?.peran || 'Pengurus'
  const isPengurusAktif = ['Bendahara', 'Ketua', 'Sekretaris'].includes(currentPeran)

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pb-24">
      {/* ── HEADER KHUSUS PENGURUS ── */}
      <div className="bg-gradient-to-br from-[#0D4A33] via-[#1A6B4A] to-[#207552] pt-12 pb-5 px-5 text-white shadow-sm rounded-b-[28px]">
        {/* Top Nav Row: Back button & Action button */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate('/beranda')}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={() => navigate('/pengurus/anggota')}
            className="bg-white/15 hover:bg-white/25 border border-white/25 rounded-full px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <Users className="w-3.5 h-3.5 stroke-[2]" />
            <span>Kelola Anggota</span>
          </button>
        </div>

        {/* Main Title & Role Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#F5A623] stroke-[2]" />
            <span className="text-white text-xs font-bold tracking-tight">Panel Pengurus</span>
            <span className="text-[10px] bg-[#F5A623] text-[#111F1A] font-extrabold px-2 py-0.5 rounded-full">
              {currentPeran}
            </span>
          </div>
        </div>

        <h1 className="text-lg font-extrabold text-white tracking-tight">
          Pusat Kendali Pengurus
        </h1>
        <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
          Kelola kas, verifikasi setoran & persetujuan pinjaman warga
        </p>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* Switch Role Quick Bar (Memudahkan Pengujian Peran Ketua/Bendahara/Sekretaris) */}
        <div className="bg-white p-3 rounded-2xl border border-[#E2EBE7] flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <UserCheck className="w-4 h-4 text-[#1A6B4A] flex-shrink-0 stroke-[2]" />
            <span className="text-[11px] font-bold text-[#4A6358] truncate">
              {currentUser?.nama || 'Pengurus'}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {[
              { key: 'bendahara', label: 'Bendahara' },
              { key: 'ketua', label: 'Ketua' },
              { key: 'sekretaris', label: 'Sekretaris' },
            ].map((r) => {
              const isActive = (currentPeran || '').toLowerCase() === r.key
              return (
                <button
                  key={r.key}
                  onClick={() => loginAsPreset && loginAsPreset(r.key)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#1A6B4A] text-white shadow-xs'
                      : 'bg-[#F4F7F5] text-[#4A6358] hover:bg-[#E6F4EE]'
                  }`}
                >
                  {r.label}
                </button>
              )
            })}
          </div>
        </div>

        {!isPengurusAktif && (
          <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-3 text-xs text-[#7A5000] flex items-center justify-between gap-2">
            <span>Saat ini Anda login sebagai <strong>Anggota</strong>. Klik tombol peran di atas untuk beralih mode.</span>
          </div>
        )}

        {/* Pesan Aksi */}
        {pesanSukses && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-xs font-bold p-3 rounded-2xl animate-fade-in text-center flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            <span>{pesanSukses}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Kas Tarunesha', value: rp(kasSaldo), icon: Landmark, color: 'text-[#1A6B4A]', bg: 'bg-[#E6F4EE]' },
            { label: 'Menunggak Iuran', value: `${anggotaMenunggak} warga`, icon: AlertTriangle, color: 'text-[#E84040]', bg: 'bg-[#FDEAEA]' },
            { label: 'Verifikasi Setoran', value: `${listVerif.length} pending`, icon: ClipboardCheck, color: 'text-[#F5A623]', bg: 'bg-[#FEF3DC]' },
            { label: 'Pengajuan Modal', value: `${listPengajuan.length} ajuan`, icon: Sprout, color: 'text-[#2D8B63]', bg: 'bg-[#E8F4EE]' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <Card key={i} className="p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>
                  <p className="text-[10px] font-bold text-[#8FA89E] uppercase tracking-wider">{s.label}</p>
                </div>
                <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/pengurus/kas-keluar')}
            className="py-2.5 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 stroke-[2]" />
            Input Kas Keluar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/pengurus/bantuan-tunai')}
            className="py-2.5 flex items-center justify-center gap-1.5"
          >
            <Banknote className="w-4 h-4 stroke-[2]" />
            Bantuan Tunai
          </Button>
        </div>

        {/* Verifikasi Pembayaran */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">
              Verifikasi Pembayaran Masuk
            </p>
            <span className="text-xs bg-[#F5A623] text-white font-bold px-2 py-0.5 rounded-full">
              {listVerif.length}
            </span>
          </div>

          {listVerif.length === 0 ? (
            <Card className="p-5 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1A6B4A] stroke-[2]" />
              <p className="text-sm font-semibold text-[#1A6B4A]">Semua setoran telah diverifikasi</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              {listVerif.map((v) => (
                <Card key={v.id} className="p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E6F4EE] flex items-center justify-center text-sm font-bold text-[#1A6B4A] flex-shrink-0">
                    {v.nama ? v.nama.charAt(0) : 'W'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#111F1A] truncate">{v.nama}</p>
                    <p className="text-[11px] text-[#8FA89E] mt-0.5">{v.jenis} · <strong className="text-[#1A6B4A]">{rp(v.jumlah)}</strong></p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleVerif(v.id, true)}
                      title="Setujui"
                      className="w-8 h-8 rounded-full bg-[#E6F4EE] text-[#1A6B4A] font-bold flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      onClick={() => handleVerif(v.id, false)}
                      title="Tolak"
                      className="w-8 h-8 rounded-full bg-red-50 text-[#E84040] font-bold flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pengajuan Pinjaman */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">
              Persetujuan Pinjaman Modal (Ketua)
            </p>
            <span className="text-xs bg-[#1A6B4A] text-white font-bold px-2 py-0.5 rounded-full">
              {listPengajuan.length}
            </span>
          </div>

          {listPengajuan.length === 0 ? (
            <Card className="p-5 text-center">
              <p className="text-sm text-[#8FA89E]">Tidak ada pengajuan pinjaman yang menunggu</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {listPengajuan.map((p) => (
                <Card key={p.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#111F1A]">{p.nama}</p>
                      <p className="text-xs text-[#8FA89E]">{p.jenis} · Tenor {p.tenor}</p>
                    </div>
                    <span className="text-sm font-extrabold text-[#1A6B4A]">{rp(p.nominal)}</span>
                  </div>

                  <p className="text-xs text-[#4A6358] bg-[#F4F7F5] p-2.5 rounded-xl">
                    <strong>Tujuan:</strong> {p.tujuan}
                  </p>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      full
                      className="flex items-center justify-center gap-1.5"
                      onClick={() => handlePersetujuanPinjaman(p.id, true)}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      Setujui & Cairkan
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePersetujuanPinjaman(p.id, false)}
                    >
                      Tolak
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Kas Keluar Terkini */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
            Kas Keluar Terkini
          </p>
          {listKasKeluar.map((k) => (
            <Card key={k.id} className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2EBE7] flex items-center justify-center text-[#4A6358] flex-shrink-0">
                <FileText className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#111F1A]">{k.keperluan}</p>
                <p className="text-[11px] text-[#8FA89E]">Nominal: {rp(k.nominal)} · Nota: {k.nota}</p>
              </div>
              <span className="text-[10px] font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2 py-0.5 rounded-full">
                Sesuai RAB
              </span>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}
