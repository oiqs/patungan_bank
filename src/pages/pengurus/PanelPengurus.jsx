import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import ConfirmModal from '../../components/ConfirmModal'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import {
  ArrowLeft,
  ShieldCheck,
  Receipt,
  HandCoins,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Plus
} from 'lucide-react'

export default function PanelPengurus() {
  const navigate = useNavigate()
  const {
    currentUser,
    kasSaldo,
    anggota,
    verifikasiPembayaranPending,
    pengajuanPinjamanPending,
    kasKeluarPending,
    verifikasiPembayaran,
    setujuiPinjaman,
    tolakPinjaman,
  } = useBankStore()

  const [pesanSukses, setPesanSukses] = useState('')
  const [confirmDialog, setConfirmDialog] = useState(null)

  const anggotaMenunggak = anggota.filter(a => a.statusIuran === 'belum' || a.statusIuran === 'telat').length

  const handleVerif = (id, approved) => {
    verifikasiPembayaran(id, approved)
    setPesanSukses(approved ? '✓ Setoran berhasil disetujui & masuk kas RT' : '✕ Setoran ditolak')
    setConfirmDialog(null)
    setTimeout(() => setPesanSukses(''), 2500)
  }

  const handlePersetujuanPinjaman = (id, disetujui) => {
    if (disetujui) {
      setujuiPinjaman(id)
      setPesanSukses('✓ Pinjaman disetujui & dana dicairkan ke warga')
    } else {
      tolakPinjaman(id)
      setPesanSukses('✕ Pengajuan pinjaman ditolak')
    }
    setConfirmDialog(null)
    setTimeout(() => setPesanSukses(''), 2500)
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* ── HEADER SOLID ── */}
      <div className="bg-[#1A6B4A] pt-12 pb-5 px-5 text-white shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-95"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <ShieldCheck size={16} />
            <span className="text-white text-xs font-bold">Panel Pengurus</span>
            <span className="text-xs bg-[#F5A623] text-[#111F1A] font-extrabold px-2 py-0.5 rounded-full">
              {currentUser.peran}
            </span>
          </div>
        </div>

        <h1 className="text-xl font-extrabold text-white tracking-tight">
          Pusat Kendali Pengurus RT 05
        </h1>
        <p className="text-white/90 text-sm mt-0.5 leading-relaxed">
          Verifikasi setoran warga &amp; persetujuan pinjaman produktif
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Pesan Sukses */}
        {pesanSukses && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-sm font-bold p-3.5 rounded-2xl animate-fade-in text-center">
            {pesanSukses}
          </div>
        )}

        {/* Statistik Pengurus */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-3.5 flex flex-col gap-1">
            <p className="text-xs font-bold text-[#5F7A6E]">Total Kas RT</p>
            <p className="text-lg font-black text-[#1A6B4A]">{rp(kasSaldo)}</p>
          </Card>
          <Card className="p-3.5 flex flex-col gap-1">
            <p className="text-xs font-bold text-[#5F7A6E]">Menunggak Iuran</p>
            <p className="text-lg font-black text-[#E84040]">{anggotaMenunggak} warga</p>
          </Card>
          <Card className="p-3.5 flex flex-col gap-1">
            <p className="text-xs font-bold text-[#5F7A6E]">Verifikasi Pending</p>
            <p className="text-lg font-black text-[#A05C00]">{verifikasiPembayaranPending.length} transaksi</p>
          </Card>
          <Card className="p-3.5 flex flex-col gap-1">
            <p className="text-xs font-bold text-[#5F7A6E]">Pengajuan Modal</p>
            <p className="text-lg font-black text-[#2B5EA7]">{pengajuanPinjamanPending.length} permohonan</p>
          </Card>
        </div>

        {/* Tombol Aksi Cepat */}
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/pengurus/kas-keluar')}
          >
            <Plus size={16} /> Input Kas Keluar
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/pengurus/bantuan-tunai')}
          >
            <HandCoins size={16} /> Bantuan Tunai
          </Button>
        </div>

        {/* Verifikasi Pembayaran Masuk */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-[#111F1A]">
              Verifikasi Pembayaran Masuk
            </h3>
            <span className="text-xs bg-[#FEF3DC] text-[#A05C00] font-bold px-2.5 py-0.5 rounded-full">
              {verifikasiPembayaranPending.length} pending
            </span>
          </div>

          {verifikasiPembayaranPending.length === 0 ? (
            <Card className="p-5 text-center">
              <p className="text-sm font-semibold text-[#1A6B4A]">
                ✓ Semua setoran iuran warga telah diverifikasi
              </p>
            </Card>
          ) : (
            verifikasiPembayaranPending.map((v) => (
              <Card key={v.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E6F4EE] flex items-center justify-center text-sm font-bold text-[#1A6B4A]">
                      {v.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#111F1A]">{v.nama}</p>
                      <p className="text-xs text-[#5F7A6E]">{v.jenis}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[#1A6B4A]">{rp(v.jumlah)}</span>
                </div>

                <div className="flex gap-2 pt-1 border-t border-[#E2EBE7]">
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Tolak Pembayaran?',
                        message: `Apakah Anda yakin ingin menolak setoran sebesar ${rp(v.jumlah)} dari ${v.nama}?`,
                        confirmLabel: 'Tolak Setoran',
                        variant: 'danger',
                        onConfirm: () => handleVerif(v.id, false)
                      })
                    }}
                    className="flex-1 min-h-[42px] py-2 px-3 rounded-xl border border-[#D5E2DC] bg-[#FDEAEA] text-[#E84040] font-bold text-sm active:scale-95 transition-all"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Setujui Pembayaran?',
                        message: `Setujui setoran iuran ${rp(v.jumlah)} dari ${v.nama}? Dana akan diverifikasi masuk ke pembukuan kas RT.`,
                        confirmLabel: 'Setujui',
                        variant: 'primary',
                        onConfirm: () => handleVerif(v.id, true)
                      })
                    }}
                    className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-[#1A6B4A] hover:bg-[#207e58] text-white font-bold text-sm active:scale-95 transition-all shadow-xs"
                  >
                    Setujui
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pengajuan Pinjaman Modal */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-[#111F1A]">
              Persetujuan Pembiayaan Modal
            </h3>
            <span className="text-xs bg-[#E8EEF9] text-[#2B5EA7] font-bold px-2.5 py-0.5 rounded-full">
              {pengajuanPinjamanPending.length} diajukan
            </span>
          </div>

          {pengajuanPinjamanPending.length === 0 ? (
            <Card className="p-5 text-center">
              <p className="text-sm text-[#5F7A6E]">Tidak ada pengajuan pinjaman modal yang menunggu.</p>
            </Card>
          ) : (
            pengajuanPinjamanPending.map((p) => (
              <Card key={p.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#111F1A]">{p.nama}</h4>
                    <p className="text-xs text-[#5F7A6E]">{p.jenis} · Tenor {p.tenor}</p>
                  </div>
                  <span className="text-lg font-black text-[#1A6B4A]">{rp(p.nominal)}</span>
                </div>

                <div className="bg-[#F4F7F5] rounded-xl p-3 text-xs text-[#2D4539] leading-relaxed">
                  <strong>Keperluan Usaha:</strong> {p.tujuan}
                </div>

                <div className="flex gap-2 pt-1 border-t border-[#E2EBE7]">
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Tolak Pengajuan Modal?',
                        message: `Tolak permohonan pinjaman ${rp(p.nominal)} untuk ${p.nama}?`,
                        confirmLabel: 'Tolak',
                        variant: 'danger',
                        onConfirm: () => handlePersetujuanPinjaman(p.id, false)
                      })
                    }}
                    className="flex-1 min-h-[42px] py-2 px-3 rounded-xl border border-[#D5E2DC] bg-[#FDEAEA] text-[#E84040] font-bold text-sm active:scale-95 transition-all"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Setujui & Cairkan Modal?',
                        message: `Setujui dan cairkan pinjaman sebesar ${rp(p.nominal)} untuk ${p.nama}? Dana kas gotong royong akan ditransfer ke akun pemohon.`,
                        confirmLabel: 'Setujui & Cairkan',
                        variant: 'primary',
                        onConfirm: () => handlePersetujuanPinjaman(p.id, true)
                      })
                    }}
                    className="flex-1 min-h-[42px] py-2 px-3 rounded-xl bg-[#1A6B4A] hover:bg-[#207e58] text-white font-bold text-sm active:scale-95 transition-all shadow-xs"
                  >
                    Setujui &amp; Cairkan
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>

      {/* MODAL DIALOG KONFIRMASI */}
      <ConfirmModal
        isOpen={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmLabel={confirmDialog?.confirmLabel}
        variant={confirmDialog?.variant}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  )
}
