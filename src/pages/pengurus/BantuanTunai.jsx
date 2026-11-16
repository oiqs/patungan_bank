import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function BantuanTunai() {
  const navigate = useNavigate()
  const { anggotaList, catatBantuanTunai } = useBankStore()

  const [selectedAnggota, setSelectedAnggota] = useState(anggotaList[0]?.id || '')
  const [jenisSetoran, setJenisSetoran] = useState('Iuran Wajib')
  const [nominal, setNominal] = useState(10000)
  const [keterangan, setKeterangan] = useState('Diserahkan langsung tunai saat pos ronda')
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
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Mode Bantuan Tunai</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Banner Penjelasan */}
        <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 text-xs text-[#7A5000] leading-relaxed flex gap-3">
          <span className="text-xl flex-shrink-0">🤝</span>
          <div>
            <strong className="block text-sm font-bold mb-0.5">Inklusi Digital Warga</strong>
            Khusus mencatat setoran uang tunai dari warga sepuh atau anggota yang belum memiliki smartphone/rekening. Saldo kas resmi akan bertambah otomatis.
          </div>
        </div>

        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <span className="text-6xl animate-bounce">💵</span>
            <h2 className="text-xl font-bold text-[#111F1A]">Setoran Tunai Tercatat!</h2>
            <p className="text-xs text-[#4A6358] max-w-xs">
              Uang tunai <strong>{rp(nominal)}</strong> dari <strong>{anggotaTerpilih?.nama}</strong> berhasil dibukukan ke kas Tarunesha dan status tagihannya otomatis lunas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSimpan} className="space-y-4">
            {/* Pilih Anggota */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Pilih Anggota Warga
              </label>
              <select
                value={selectedAnggota}
                onChange={e => setSelectedAnggota(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-xs bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                {anggotaList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nama} ({a.noHp}) - Status: {a.statusIuran}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Setoran */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Jenis Pembayaran Tunai
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Iuran Wajib', val: 10000 },
                  { label: 'Setoran Arisan', val: 50000 },
                  { label: 'Iuran Sukarela', val: 20000 },
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setJenisSetoran(item.label)
                      setNominal(item.val)
                    }}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all text-center ${
                      jenisSetoran === item.label
                        ? 'border-[#1A6B4A] bg-[#E8F4EE] text-[#1A6B4A] font-bold'
                        : 'border-[#E2EBE7] bg-white text-[#4A6358]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Tunai */}
            <Card className="p-4 space-y-2">
              <label className="text-xs text-[#4A6358] font-bold block">
                Nominal Diterima Fisik:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#1A6B4A]">Rp</span>
                <input
                  type="number"
                  value={nominal}
                  onChange={e => setNominal(Number(e.target.value))}
                  className="w-full text-2xl font-extrabold text-[#111F1A] focus:outline-none"
                  required
                />
              </div>
            </Card>

            {/* Keterangan */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Keterangan / Lokasi Penyerahan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={e => setKeterangan(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:border-[#1A6B4A]"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              full
              size="lg"
              className="mt-4"
            >
              Terima & Catat ke Kas Tunai 💵
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
