import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Search, Plus, UserPlus, MoreVertical, CheckCircle2, AlertCircle } from 'lucide-react'

const filters = ['Semua', 'Aktif', 'Nonaktif', 'Pengurus']

const peranColor = {
  Ketua: 'bg-amber-50 text-[#A05C00]',
  Bendahara: 'bg-blue-50 text-blue-600',
  Sekretaris: 'bg-purple-50 text-purple-600',
  Anggota: 'bg-[#E6F4EE] text-[#1A6B4A]',
}

export default function KelolaAnggota() {
  const navigate = useNavigate()
  const { anggotaList, toggleAnggotaAktif, tambahAnggota } = useBankStore()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [menuOpen, setMenuOpen] = useState(null)
  const [modalTambah, setModalTambah] = useState(false)

  // Form Tambah
  const [namaBaru, setNamaBaru] = useState('')
  const [noHpBaru, setNoHpBaru] = useState('')
  const [peranBaru, setPeranBaru] = useState('Anggota')

  const filtered = anggotaList.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(search.toLowerCase()) || a.noHp.includes(search)
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
      noHp: noHpBaru || '+62 812-0000-0000',
      peran: peranBaru,
    })

    setModalTambah(false)
    setNamaBaru('')
    setNoHpBaru('')
    setPeranBaru('Anggota')
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-28">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E2EBE7] sticky top-0 z-10 pt-12">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[#111F1A] font-bold text-base flex-1">Kelola Data Anggota</h1>
          <span className="text-xs bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2.5 py-1 rounded-full">
            {anggotaList.length} Warga
          </span>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 bg-[#F4F7F5] border border-[#D5E2DC] rounded-xl px-3.5 py-2.5">
          <Search size={18} className="text-[#5F7A6E]" />
          <input
            type="text"
            placeholder="Cari nama atau nomor HP warga..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-base focus:outline-none text-[#111F1A] placeholder-[#5F7A6E]"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white px-4 py-2.5 flex gap-2 border-b border-[#E2EBE7] overflow-x-auto no-scrollbar">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              filter === f
                ? 'bg-[#1A6B4A] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#2D4539] border border-[#E2EBE7]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List Anggota */}
      <div className="px-4 py-4 space-y-2.5">
        {filtered.map((a) => (
          <Card key={a.id} className="flex items-center gap-3 p-3.5 relative">
            <div className="w-11 h-11 rounded-full bg-[#E6F4EE] flex items-center justify-center text-sm font-bold text-[#1A6B4A] flex-shrink-0">
              {a.nama.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-[#111F1A] truncate">{a.nama}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${peranColor[a.peran] || 'bg-gray-100 text-gray-700'}`}>
                  {a.peran}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[#5F7A6E]">
                <span>{a.noHp}</span>
                <span>•</span>
                <span className={`font-bold ${a.statusIuran === 'lunas' ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {a.statusIuran === 'lunas' ? '✓ Iuran Lunas' : 'Belum Lunas'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleAnggotaAktif(a.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                a.aktif
                  ? 'border-[#1A6B4A] text-[#1A6B4A] bg-[#E6F4EE]'
                  : 'border-[#D5E2DC] text-[#5F7A6E] bg-white'
              }`}
            >
              {a.aktif ? 'Aktif' : 'Nonaktif'}
            </button>
          </Card>
        ))}
      </div>

      {/* Floating Add Member Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setModalTambah(true)}
          className="bg-[#1A6B4A] text-white p-4 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold active:scale-95 transition-transform"
        >
          <UserPlus size={20} />
          <span>+ Tambah Warga</span>
        </button>
      </div>

      {/* MODAL TAMBAH ANGGOTA */}
      {modalTambah && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Tambah Anggota Warga Baru</h3>
              <button onClick={() => setModalTambah(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F7A6E] font-bold">✕</button>
            </div>

            <form onSubmit={handleSimpanAnggota} className="space-y-3.5">
              <div>
                <label className="text-sm font-bold text-[#2D4539] block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Supriyadi"
                  value={namaBaru}
                  onChange={e => setNamaBaru(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2D4539] block mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  placeholder="+62 812-xxxx-xxxx"
                  value={noHpBaru}
                  onChange={e => setNoHpBaru(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-[#2D4539] block mb-1">Peran dalam Komunitas</label>
                <select
                  value={peranBaru}
                  onChange={e => setPeranBaru(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
                >
                  <option value="Anggota">Anggota Warga</option>
                  <option value="Bendahara">Bendahara RT</option>
                  <option value="Sekretaris">Sekretaris RT</option>
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
