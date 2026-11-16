import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'

export default function Profil() {
  const navigate = useNavigate()
  const {
    currentUser,
    setPeran,
    tagihanIuran,
    pinjamanList,
    notifikasi,
    resetStateKeAwal,
  } = useBankStore()

  const [modalEdit, setModalEdit] = useState(false)
  const [namaEdit, setNamaEdit] = useState(currentUser.nama)
  const [telpEdit, setTelpEdit] = useState(currentUser.telepon)

  const unreadCount = notifikasi.filter(n => !n.dibaca).length
  const lunasCount = tagihanIuran.filter(t => t.status === 'lunas').length

  const handleSimpanEdit = (e) => {
    e.preventDefault()
    useBankStore.getState().updateProfil({ nama: namaEdit, telepon: telpEdit })
    setModalEdit(false)
  }

  return (
    <div className="w-full">

      {/* ── HEADER ── */}
      <div className="bg-[#F4F7F5] pt-12 pb-3 px-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">Profil Anggota</h1>
        <button
          onClick={() => navigate('/notifikasi')}
          className="relative text-lg p-2 active:scale-90"
        >
          🔔
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E84040] rounded-full" />
          )}
        </button>
      </div>

      <div className="px-4 space-y-4 pb-24">

        {/* ── PROFILE CARD ── */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A6B4A] to-[#4DB87F] flex items-center justify-center text-3xl shadow-[0_4px_12px_rgba(26,107,74,0.3)] flex-shrink-0 text-white">
              {currentUser.avatar || '👤'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-extrabold text-[#111F1A] tracking-tight truncate">{currentUser.nama}</p>
              <p className="text-xs text-[#8FA89E] mt-0.5">{currentUser.telepon}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-[#E6F4EE] text-[#1A6B4A] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  ✓ {currentUser.peran} · RT 05
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setNamaEdit(currentUser.nama)
                setTelpEdit(currentUser.telepon)
                setModalEdit(true)
              }}
              className="w-8 h-8 rounded-lg bg-[#F4F7F5] flex items-center justify-center text-sm flex-shrink-0 active:scale-90"
            >
              ✏️
            </button>
          </div>
        </Card>

        {/* ── STATS STRIP ── */}
        <div className="grid grid-cols-3 divide-x divide-[#E2EBE7] bg-white border border-[#E2EBE7] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div
            onClick={() => navigate('/profil/skor')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9]"
          >
            <p className="text-xl font-extrabold text-[#111F1A]">{currentUser.skor}</p>
            <p className="text-[10px] text-[#8FA89E] font-semibold mt-0.5">Skor Saya</p>
          </div>
          <div
            onClick={() => navigate('/kas')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9]"
          >
            <p className="text-xl font-extrabold text-[#111F1A]">{lunasCount}/{tagihanIuran.length}</p>
            <p className="text-[10px] text-[#8FA89E] font-semibold mt-0.5">Iuran Lunas</p>
          </div>
          <div
            onClick={() => navigate('/layanan')}
            className="flex flex-col items-center py-4 cursor-pointer hover:bg-[#F9FAF9]"
          >
            <p className="text-xl font-extrabold text-[#111F1A]">{pinjamanList.length}</p>
            <p className="text-[10px] text-[#8FA89E] font-semibold mt-0.5">Pinjaman</p>
          </div>
        </div>

        {/* ── MENU SECTIONS ── */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
            Akun & Keamanan
          </p>
          <Card className="divide-y divide-[#F4F7F5]">
            <button
              onClick={() => setModalEdit(true)}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#E6F4EE] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Data Diri & Alamat</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">{currentUser.alamat}</p>
              </div>
              <span className="text-sm text-[#C0CCC8]">›</span>
            </button>

            <button
              onClick={() => navigate('/profil/keamanan')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#E8EEF9] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🔒
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Keamanan Akun</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">PIN 6 digit, fingerprint biometrik</p>
              </div>
              <span className="text-sm text-[#C0CCC8]">›</span>
            </button>

            <button
              onClick={() => navigate('/notifikasi')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#FEF3DC] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🔔
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Notifikasi & Pengingat</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">Tagihan iuran, hasil arisan, info rapat</p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-[#E84040] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-1">
                  {unreadCount}
                </span>
              )}
              <span className="text-sm text-[#C0CCC8]">›</span>
            </button>
          </Card>
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
            Bantuan & Info
          </p>
          <Card className="divide-y divide-[#F4F7F5]">
            <button
              onClick={() => navigate('/profil/skor')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#E6F4EE] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                📊
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Skor Kelayakan Saya</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">Faktor reputasi & kenaikan plafon</p>
              </div>
              <span className="text-sm text-[#C0CCC8]">›</span>
            </button>

            <button
              onClick={() => navigate('/profil/bantuan')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#EEE8F9] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                ❓
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Bantuan & Kontak Pengurus</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">FAQ, WhatsApp RT 05, informasi hukum</p>
              </div>
              <span className="text-sm text-[#C0CCC8]">›</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Keluar dari akun aplikasi?')) {
                  navigate('/login')
                }
              }}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#FAEAEA] rounded-xl flex items-center justify-center text-lg flex-shrink-0 text-[#E84040]">
                🚪
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#E84040]">Keluar Akun</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">Kunci sesi & logout</p>
              </div>
              <span className="text-sm text-[#E84040]">›</span>
            </button>
          </Card>
        </div>

        {/* Tombol Reset Data Demo */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              if (confirm('Reset seluruh data simulasi ke awal?')) {
                resetStateKeAwal()
              }
            }}
            className="text-xs text-[#8FA89E] underline active:text-[#111F1A]"
          >
            Reset Semua Data Simulasi ke Default
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-[#8FA89E] leading-relaxed pb-4 px-4">
          Patungan Bank bukan bank umum. Dana dikelola bersama secara transparan oleh pengurus Tarunesha RT 05.
        </p>

      </div>

      {/* MODAL EDIT DATA DIRI */}
      {modalEdit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Ubah Data Diri</h3>
              <button onClick={() => setModalEdit(false)} className="text-[#8FA89E] text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleSimpanEdit} className="space-y-3">
              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={namaEdit}
                  onChange={e => setNamaEdit(e.target.value)}
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Nomor Telepon</label>
                <input
                  type="text"
                  value={telpEdit}
                  onChange={e => setTelpEdit(e.target.value)}
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" full onClick={() => setModalEdit(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" full>
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
