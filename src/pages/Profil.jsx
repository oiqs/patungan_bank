import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ConfirmModal from '../components/ConfirmModal'
import { useBankStore, PRESET_USERS } from '../store/useBankStore'
import {
  Bell,
  User,
  Shield,
  FileText,
  HelpCircle,
  LogOut,
  Pencil,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2
} from 'lucide-react'

export default function Profil() {
  const navigate = useNavigate()
  const {
    currentUser,
    tagihanIuran,
    pinjamanList,
    notifikasi,
    resetStateKeAwal,
    isDemoMode,
    toggleDemoMode,
    loginAsPreset
  } = useBankStore()

  const [modalEdit, setModalEdit] = useState(false)
  const [namaEdit, setNamaEdit] = useState(currentUser.nama)
  const [telpEdit, setTelpEdit] = useState(currentUser.telepon)
  const [confirmDialog, setConfirmDialog] = useState(null)

  const unreadCount = notifikasi.filter(n => !n.dibaca).length
  const lunasCount = tagihanIuran.filter(t => t.status === 'lunas').length

  const handleSimpanEdit = (e) => {
    e.preventDefault()
    useBankStore.getState().updateProfil({ nama: namaEdit, telepon: telpEdit })
    setModalEdit(false)
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* ── HEADER HALAMAN ── */}
      <div className="bg-white border-b border-[#E2EBE7] pt-12 pb-3 px-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">
          Profil Anggota
        </h1>
        <button
          onClick={() => navigate('/notifikasi')}
          className="relative w-11 h-11 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-90 transition-all"
          aria-label="Notifikasi"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#E84040] rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── KARTU IDENTITAS ANGGOTA ── */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1A6B4A] text-white flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-sm">
              {currentUser.avatar || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-extrabold text-[#111F1A] tracking-tight truncate">
                {currentUser.nama}
              </h2>
              <p className="text-sm text-[#5F7A6E] mt-0.5">{currentUser.telepon}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-[#E6F4EE] text-[#1A6B4A] text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} /> {currentUser.peran} · RT 05
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setNamaEdit(currentUser.nama)
                setTelpEdit(currentUser.telepon)
                setModalEdit(true)
              }}
              className="w-10 h-10 rounded-xl bg-[#F4F7F5] border border-[#E2EBE7] flex items-center justify-center text-[#2D4539] hover:bg-gray-100 flex-shrink-0 active:scale-90 transition-all"
              aria-label="Ubah Data"
            >
              <Pencil size={18} />
            </button>
          </div>
        </Card>

        {/* ── STATISTIK REPUTASI (3 STRIP) ── */}
        <div className="grid grid-cols-3 divide-x divide-[#E2EBE7] bg-white border border-[#E2EBE7] rounded-2xl overflow-hidden shadow-xs">
          <div
            onClick={() => navigate('/profil/skor')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9] active:scale-98 transition-all"
          >
            <p className="text-2xl font-black text-[#1A6B4A]">{currentUser.skor}</p>
            <p className="text-xs font-bold text-[#5F7A6E] mt-0.5">Skor Saya</p>
          </div>
          <div
            onClick={() => navigate('/kas')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9] active:scale-98 transition-all"
          >
            <p className="text-2xl font-black text-[#111F1A]">{lunasCount}/{tagihanIuran.length}</p>
            <p className="text-xs font-bold text-[#5F7A6E] mt-0.5">Iuran Lunas</p>
          </div>
          <div
            onClick={() => navigate('/layanan')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9] active:scale-98 transition-all"
          >
            <p className="text-2xl font-black text-[#2B5EA7]">{pinjamanList.length}</p>
            <p className="text-xs font-bold text-[#5F7A6E] mt-0.5">Pinjaman</p>
          </div>
        </div>

        {/* ── MENU AKUN & KEAMANAN ── */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
            Akun &amp; Pengaturan
          </h3>
          <Card className="divide-y divide-[#F4F7F5]">
            <button
              onClick={() => setModalEdit(true)}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#E6F4EE] text-[#1A6B4A] rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#111F1A]">Data Diri &amp; Alamat</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">{currentUser.alamat}</p>
              </div>
              <span className="text-sm text-[#5F7A6E] font-bold">›</span>
            </button>

            <button
              onClick={() => navigate('/profil/keamanan')}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#E8EEF9] text-[#2B5EA7] rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#111F1A]">Keamanan Akun</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">PIN 6 digit &amp; verifikasi sidik jari</p>
              </div>
              <span className="text-sm text-[#5F7A6E] font-bold">›</span>
            </button>

            <button
              onClick={() => navigate('/notifikasi')}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#FEF3DC] text-[#A05C00] rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#111F1A]">Notifikasi &amp; Pengingat</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">Tagihan iuran, hasil arisan &amp; info RT</p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-[#E84040] text-white text-xs font-bold px-2 py-0.5 rounded-full mr-1">
                  {unreadCount}
                </span>
              )}
              <span className="text-sm text-[#5F7A6E] font-bold">›</span>
            </button>
          </Card>
        </div>

        {/* ── BANTUAN & LAINNYA ── */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
            Bantuan &amp; Layanan Warga
          </h3>
          <Card className="divide-y divide-[#F4F7F5]">
            <button
              onClick={() => navigate('/profil/skor')}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#E6F4EE] text-[#1A6B4A] rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#111F1A]">Skor Kelayakan Saya</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">Rincian reputasi &amp; peluang kenaikan plafon</p>
              </div>
              <span className="text-sm text-[#5F7A6E] font-bold">›</span>
            </button>

            <button
              onClick={() => navigate('/profil/bantuan')}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#F4F7F5] text-[#2D4539] rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#111F1A]">Pusat Bantuan RT 05</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">Pertanyaan umum &amp; kontak sekretariat</p>
              </div>
              <span className="text-sm text-[#5F7A6E] font-bold">›</span>
            </button>

            <button
              onClick={() => {
                setConfirmDialog({
                  title: 'Keluar dari Akun?',
                  message: 'Anda akan keluar dari sesi aplikasi Patungan Bank Tarunesha.',
                  confirmLabel: 'Keluar',
                  variant: 'danger',
                  onConfirm: () => navigate('/login')
                })
              }}
              className="w-full flex items-center gap-3.5 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#FAEAEA] text-[#E84040] rounded-xl flex items-center justify-center flex-shrink-0">
                <LogOut size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-[#E84040]">Keluar Akun</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5">Kunci sesi &amp; kembali ke layar masuk</p>
              </div>
              <span className="text-sm text-[#E84040] font-bold">›</span>
            </button>
          </Card>
        </div>

        {/* ── TOGGLE MODE DEMO / DOSEN (TIDAK MENGOTORI UI UTAMA) ── */}
        <div className="pt-2">
          <Card className="p-4 bg-white border border-[#D5E2DC]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FEF3DC] text-[#A05C00] flex items-center justify-center">
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111F1A]">Mode Demo / Presentasi</h4>
                  <p className="text-xs text-[#5F7A6E]">Fitur pengujian dosen &amp; reset data</p>
                </div>
              </div>
              <button
                onClick={toggleDemoMode}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isDemoMode ? 'bg-[#1A6B4A]' : 'bg-[#E2EBE7]'
                }`}
                aria-label="Toggle Demo Mode"
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                  isDemoMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            {/* Menu Khusus saat Mode Demo Aktif */}
            {isDemoMode && (
              <div className="mt-4 pt-3 border-t border-[#E2EBE7] space-y-3 animate-fade-in">
                <p className="text-xs font-bold text-[#1A6B4A]">
                  Ganti Akun Cepat untuk Uji Coba:
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.entries(PRESET_USERS).map(([key, u]) => (
                    <button
                      key={key}
                      onClick={() => loginAsPreset(key)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        currentUser.peran === u.peran
                          ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                          : 'bg-[#F4F7F5] text-[#2D4539] border-[#D5E2DC]'
                      }`}
                    >
                      {u.peran}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setConfirmDialog({
                        title: 'Reset Semua Data?',
                        message: 'Seluruh tagihan, saldo dompet, dan riwayat simulasi akan dikembalikan ke kondisi awal mula.',
                        confirmLabel: 'Reset Data',
                        variant: 'danger',
                        onConfirm: () => {
                          resetStateKeAwal()
                          setConfirmDialog(null)
                        }
                      })
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E84040]/30 bg-[#FDEAEA] text-[#E84040] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <RotateCcw size={15} />
                    <span>Reset Semua Data Simulasi ke Default</span>
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-[#5F7A6E] leading-relaxed px-4 pt-2">
          Patungan Bank adalah sistem tata kelola keuangan gotong royong digital khusus warga Tarunesha RT 05.
        </p>

      </div>

      {/* MODAL EDIT DATA DIRI */}
      {modalEdit && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Ubah Data Diri</h3>
              <button
                onClick={() => setModalEdit(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F7A6E] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimpanEdit} className="space-y-3.5">
              <div>
                <label className="text-sm font-bold text-[#2D4539] block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={namaEdit}
                  onChange={e => setNamaEdit(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2D4539] block mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={telpEdit}
                  onChange={e => setTelpEdit(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" full onClick={() => setModalEdit(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" full>
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
