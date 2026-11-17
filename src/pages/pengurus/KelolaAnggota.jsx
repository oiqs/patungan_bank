import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Check,
  MoreVertical,
  Banknote,
  UserCheck,
  UserX,
  UserPlus,
  X,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'

const filters = ['Semua', 'Aktif', 'Nonaktif', 'Pengurus']

const peranColor = {
  Ketua: 'bg-amber-50 text-[#F5A623]',
  Bendahara: 'bg-blue-50 text-blue-500',
  Sekretaris: 'bg-purple-50 text-purple-600',
  Anggota: 'bg-[#E6F4EE] text-[#1A6B4A]',
}

export default function KelolaAnggota() {
  const navigate = useNavigate()
  const { anggotaList = [], toggleAnggotaAktif, tambahAnggota } = useBankStore()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [menuOpen, setMenuOpen] = useState(null)
  const [modalTambah, setModalTambah] = useState(false)

  // Form Tambah
  const [namaBaru, setNamaBaru] = useState('')
  const [noHpBaru, setNoHpBaru] = useState('')
  const [peranBaru, setPeranBaru] = useState('Anggota')

  const listWarga = anggotaList || []
  const filtered = listWarga.filter(a => {
    const matchSearch = (a.nama || '').toLowerCase().includes(search.toLowerCase()) || (a.noHp || '').includes(search)
    if (filter === 'Aktif') return matchSearch && a.aktif
    if (filter === 'Nonaktif') return matchSearch && !a.aktif
    if (filter === 'Pengurus') return matchSearch && ['Ketua', 'Bendahara', 'Sekretaris'].includes(a.peran)
    return matchSearch
  })

  const handleSimpanAnggota = (e) => {
    e.preventDefault()
    if (!namaBaru.trim()) return

    tambahAnggota({
      nama: namaBaru,
      noHp: noHpBaru || '0812-xxxx-xxxx',
      peran: peranBaru,
    })

    setNamaBaru('')
    setNoHpBaru('')
    setModalTambah(false)
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex flex-col gap-3 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1A6B4A] active:scale-95 transition-transform"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-[#111F1A] font-bold text-base flex-1">Kelola Data Anggota</h1>
          <span className="text-xs bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2.5 py-1 rounded-full">
            {listWarga.length} Warga
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F4F7F5] border border-[#E2EBE7] rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-[#8FA89E] stroke-[2]" />
          <input
            type="text"
            placeholder="Cari nama atau nomor HP warga..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs focus:outline-none text-[#111F1A] placeholder-[#8FA89E]"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white px-5 py-2.5 flex gap-2 border-b border-[#E2EBE7] overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              filter === f
                ? 'bg-[#1A6B4A] text-white shadow-sm'
                : 'bg-[#F4F7F5] text-[#4A6358] border border-[#E2EBE7]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-2.5">
        {filtered.map((a) => (
          <Card key={a.id} className="flex items-center gap-3 p-3.5 relative">
            <div className="w-10 h-10 rounded-full bg-[#E6F4EE] flex items-center justify-center text-sm font-bold text-[#1A6B4A] flex-shrink-0">
              {a.nama.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-[#111F1A] truncate">{a.nama}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${peranColor[a.peran] || 'bg-gray-100 text-gray-700'}`}>
                  {a.peran}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8FA89E]">
                <span>{a.noHp}</span>
                <span>•</span>
                <span className={`font-semibold flex items-center gap-1 ${a.statusIuran === 'lunas' ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {a.statusIuran === 'lunas' ? (
                    <>
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Iuran Lunas</span>
                    </>
                  ) : (
                    '! Belum Lunas'
                  )}
                </span>
              </div>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(menuOpen === a.id ? null : a.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F4F7F5] text-[#4A6358] active:scale-90"
              >
                <MoreVertical className="w-4 h-4 stroke-[2]" />
              </button>
              {menuOpen === a.id && (
                <div
                  className="absolute right-0 top-9 bg-white border border-[#E2EBE7] rounded-2xl shadow-xl z-20 w-44 overflow-hidden py-1 animate-scale-up"
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(null)
                      navigate('/pengurus/bantuan-tunai')
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#111F1A] hover:bg-[#F4F7F5] font-semibold flex items-center gap-2"
                  >
                    <Banknote className="w-4 h-4 text-[#1A6B4A] stroke-[2]" />
                    <span>Catat Bayar Tunai</span>
                  </button>
                  <button
                    onClick={() => {
                      toggleAnggotaAktif(a.id)
                      setMenuOpen(null)
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#111F1A] hover:bg-[#F4F7F5] flex items-center gap-2"
                  >
                    {a.aktif ? (
                      <>
                        <UserX className="w-4 h-4 text-[#E84040] stroke-[2]" />
                        <span>Nonaktifkan</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-[#1A6B4A] stroke-[2]" />
                        <span>Aktifkan Akun</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-2 text-center">
            <Search className="w-12 h-12 text-[#8FA89E] opacity-40 stroke-[1.5]" />
            <p className="text-xs text-[#8FA89E]">Data anggota tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* FAB Tambah Anggota */}
      <button
        onClick={() => setModalTambah(true)}
        className="fixed bottom-24 right-5 z-40 bg-[#1A6B4A] hover:bg-[#2D8B63] text-white px-5 h-12 rounded-full shadow-lg flex items-center gap-2 font-bold text-xs active:scale-95 transition-transform"
        style={{ boxShadow: '0 4px 14px rgba(26,107,74,0.4)' }}
      >
        <UserPlus className="w-4 h-4 stroke-[2]" />
        <span>Tambah Anggota</span>
      </button>

      {/* MODAL TAMBAH ANGGOTA */}
      {modalTambah && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Tambah Anggota Warga</h3>
              <button
                onClick={() => setModalTambah(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F5] hover:bg-[#E2EBE7] flex items-center justify-center text-[#8FA89E] hover:text-[#111F1A] transition-colors"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSimpanAnggota} className="space-y-3">
              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Slamet"
                  value={namaBaru}
                  onChange={e => setNamaBaru(e.target.value)}
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={noHpBaru}
                  onChange={e => setNoHpBaru(e.target.value)}
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                />
              </div>

              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Peran dalam Komunitas</label>
                <select
                  value={peranBaru}
                  onChange={e => setPeranBaru(e.target.value)}
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                >
                  <option value="Anggota">Anggota Warga</option>
                  <option value="Sekretaris">Sekretaris RT</option>
                  <option value="Bendahara">Bendahara RT</option>
                  <option value="Ketua">Ketua RT</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" full onClick={() => setModalTambah(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" full>
                  Simpan Anggota
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
