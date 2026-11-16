import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, HandCoins, CheckCircle2, UserCheck } from 'lucide-react'

export default function BantuanTunai() {
  const navigate = useNavigate()
  const { anggotaList, catatBantuanTunai } = useBankStore()

  const [selectedAnggota, setSelectedAnggota] = useState(anggotaList[0]?.id || '')
  const [jenisSetoran, setJenisSetoran] = useState('Iuran Wajib')
  const [nominal, setNominal] = useState(10000)
  const [keterangan, setKeterangan] = useState('Diserahkan langsung tunai saat pertemuan warga')
  const [sukses, setSukses] = useState(false)

  const handleSimpan = (e) => {
    e.preventDefault()
    if (!selectedAnggota || nominal <= 0) return

    catatBantuanTunai(selectedAnggota, nominal, jenisSetoran)
    setSukses(true)
    setTimeout(() => {
      navigate('/pengurus')
    }, 1500)
  }

  const anggotaTerpilih = anggotaList.find(a => a.id === selectedAnggota)

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E2EBE7] flex items-center gap-2 sticky top-0 z-10 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Mode Bantuan Setoran Tunai</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Banner Penjelasan Inklusi Digital */}
        <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 text-xs text-[#7A5000] leading-relaxed flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0 text-[#A05C00]">
            <HandCoins size={20} />
          </div>
          <div>
            <strong className="block text-sm font-bold text-[#111F1A] mb-0.5">Inklusi Digital Warga Sepuh</strong>
            Layanan pengurus untuk mencatat setoran tunai dari warga yang belum memiliki smartphone/rekening. Saldo kas resmi RT akan otomatis bertambah.
          </div>
        </div>

        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-[#111F1A]">Setoran Tunai Tercatat!</h2>
            <p className="text-sm text-[#456355] max-w-xs">
              Uang tunai <strong>{rp(nominal)}</strong> dari <strong>{anggotaTerpilih?.nama}</strong> berhasil dibukukan ke kas RT 05 dan status tagihannya otomatis lunas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimpan} className="space-y-4">
            {/* Pilih Anggota */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Pilih Nama Warga Penyetor
              </label>
              <select
                value={selectedAnggota}
                onChange={e => setSelectedAnggota(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                {anggotaList.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nama} ({a.noHp})
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Setoran */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Jenis Setoran
              </label>
              <select
                value={jenisSetoran}
                onChange={e => setJenisSetoran(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                <option value="Iuran Wajib">Iuran Wajib RT 05 (Rp 10.000)</option>
                <option value="Setoran Arisan">Setoran Arisan Bulanan</option>
                <option value="Donasi Sosial">Donasi Kas Sosial / Duka</option>
                <option value="Angsuran Pinjaman">Angsuran Pinjaman Modal</option>
              </select>
            </div>

            {/* Nominal */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Nominal Uang Tunai Diterima (Rp)
              </label>
              <input
                type="number"
                value={nominal}
                onChange={e => setNominal(Number(e.target.value))}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                required
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Keterangan Penyerahan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={e => setKeterangan(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              />
            </div>

            <Button full size="lg" variant="primary" type="submit">
              Konfirmasi &amp; Terima Uang Tunai
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
