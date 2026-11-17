import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  User,
  Check,
  Pencil,
  ShieldCheck,
  Award,
  HelpCircle,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react'
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
    loginAsPreset,
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
          className="relative w-9 h-9 rounded-full bg-white border border-[#E2EBE7] flex items-center justify-center text-[#111F1A] active:scale-90 transition-transform shadow-xs"
          title="Notifikasi"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E84040] rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      <div className="px-4 space-y-4 pb-24">

        {/* ── PROFILE CARD ── */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A6B4A] to-[#4DB87F] flex items-center justify-center shadow-[0_4px_12px_rgba(26,107,74,0.3)] flex-shrink-0 text-white">
              <User className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-extrabold text-[#111F1A] tracking-tight truncate">{currentUser.nama}</p>
              <p className="text-xs text-[#8FA89E] mt-0.5">{currentUser.telepon}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 bg-[#E6F4EE] text-[#1A6B4A] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3 stroke-[2.5]" /> {currentUser.peran} · RT 05
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setNamaEdit(currentUser.nama)
                setTelpEdit(currentUser.telepon)
                setModalEdit(true)
              }}
              className="w-8 h-8 rounded-lg bg-[#F4F7F5] hover:bg-[#E2EBE7] flex items-center justify-center text-[#4A6358] flex-shrink-0 active:scale-90 transition-colors"
              title="Edit Data Diri"
            >
              <Pencil className="w-3.5 h-3.5 stroke-[2]" />
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
              <div className="w-9 h-9 bg-[#E6F4EE] text-[#1A6B4A] rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Data Diri & Alamat</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">{currentUser.alamat}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C0CCC8] stroke-[2]" />
            </button>

            <button
              onClick={() => navigate('/profil/keamanan')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#E8EEF9] text-[#2B6CB0] rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Keamanan Akun</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">PIN 6 digit, fingerprint biometrik</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C0CCC8] stroke-[2]" />
            </button>

            {/* Akses Pengurus */}
            <button
              onClick={() => navigate('/pengurus')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors bg-[#E6F4EE]/30"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#0D4A33] to-[#1A6B4A] text-[#F5A623] rounded-xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#111F1A]">Akses Panel Pengurus</p>
                  <span className="text-[10px] bg-[#F5A623] text-[#111F1A] font-extrabold px-1.5 py-0.5 rounded-full">
                    {currentUser?.peran || 'Pengurus'}
                  </span>
                </div>
                <p className="text-xs text-[#8FA89E] mt-0.5">Kelola kas, verifikasi iuran & acc pinjaman warga</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#1A6B4A] stroke-[2]" />
            </button>

            <button
              onClick={() => navigate('/notifikasi')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#FEF3DC] text-[#B7791F] rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 stroke-[2]" />
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
              <ChevronRight className="w-4 h-4 text-[#C0CCC8] stroke-[2]" />
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
              <div className="w-9 h-9 bg-[#E6F4EE] text-[#1A6B4A] rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Skor Kelayakan Saya</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">Faktor reputasi & kenaikan plafon</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C0CCC8] stroke-[2]" />
            </button>

            <button
              onClick={() => navigate('/profil/bantuan')}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#EEE8F9] text-[#7C3AED] rounded-xl flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111F1A]">Bantuan & Kontak Pengurus</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">FAQ, WhatsApp RT 05, informasi hukum</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C0CCC8] stroke-[2]" />
            </button>

            <button
              onClick={() => {
                if (confirm('Keluar dari akun aplikasi?')) {
                  navigate('/login')
                }
              }}
              className="w-full flex items-center gap-3 p-4 text-left active:bg-[#F4F7F5] transition-colors"
            >
              <div className="w-9 h-9 bg-[#FAEAEA] rounded-xl flex items-center justify-center flex-shrink-0 text-[#E84040]">
                <LogOut className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#E84040]">Keluar Akun</p>
                <p className="text-xs text-[#8FA89E] mt-0.5">Kunci sesi & logout</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#E84040] stroke-[2]" />
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
            className="text-xs text-[#8FA89E] hover:text-[#1A6B4A] underline active:text-[#111F1A] transition-colors"
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
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Ubah Data Diri</h3>
              <button
                onClick={() => setModalEdit(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F5] hover:bg-[#E2EBE7] flex items-center justify-center text-[#8FA89E] hover:text-[#111F1A] transition-colors"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
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
