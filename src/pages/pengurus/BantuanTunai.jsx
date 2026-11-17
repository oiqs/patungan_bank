import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Handshake,
  CheckCircle2,
  Banknote,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function BantuanTunai() {
  const navigate = useNavigate()
  const { anggotaList = [], catatBantuanTunai } = useBankStore()
  const listWarga = anggotaList || []

  const [selectedAnggota, setSelectedAnggota] = useState(listWarga[0]?.id || 'u1')
  const [nominal, setNominal] = useState(10000)
  const [jenisSetoran, setJenisSetoran] = useState('Iuran Wajib')
  const [keterangan, setKeterangan] = useState('Uang tunai diserahkan langsung di Pos Ronda RT 05')
  const [sukses, setSukses] = useState(false)

  const anggotaTerpilih = listWarga.find(a => a.id === selectedAnggota)

  const handleSimpan = (e) => {
    e.preventDefault()
    if (!nominal || nominal <= 0) return

    catatBantuanTunai(selectedAnggota, nominal, jenisSetoran)
    setSukses(true)
    setTimeout(() => {
      navigate('/pengurus')
    }, 1800)
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="text-[#1A6B4A] active:scale-95 transition-transform"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Mode Bantuan Tunai</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Banner Penjelasan */}
        <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 text-xs text-[#7A5000] leading-relaxed flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0 text-[#7A5000]">
            <Handshake className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <strong className="block text-sm font-bold mb-0.5">Inklusi Digital Warga</strong>
            Khusus mencatat setoran uang tunai dari warga sepuh atau anggota yang belum memiliki smartphone/rekening. Saldo kas resmi akan bertambah otomatis.
          </div>
        </div>

        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A] shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
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
                {listWarga.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.nama} ({a.noHp}) - Status: {a.statusIuran}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Setoran */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1.5 px-1">
                Jenis Penerimaan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Iuran Wajib', 'Iuran Sukarela', 'Arisan'].map(j => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setJenisSetoran(j)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                      jenisSetoran === j
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#4A6358] border-[#E2EBE7]'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal Setoran Tunai */}
            <Card className="p-4 space-y-2">
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block px-1">
                Nominal Uang Fisik yang Diterima
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[10000, 20000, 50000].map(nom => (
                  <button
                    key={nom}
                    type="button"
                    onClick={() => setNominal(nom)}
                    className={`py-2 rounded-xl border text-xs font-bold ${
                      nominal === nom
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#111F1A] border-[#E2EBE7]'
                    }`}
                  >
                    {shortRp(nom)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-[#F4F7F5] border border-[#E2EBE7] rounded-xl px-4 py-2.5">
                <span className="font-bold text-[#1A6B4A] text-sm">Rp</span>
                <input
                  type="number"
                  value={nominal}
                  onChange={e => setNominal(Number(e.target.value))}
                  className="flex-1 bg-transparent text-base font-extrabold text-[#111F1A] focus:outline-none"
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
              className="mt-4 flex items-center justify-center gap-2"
            >
              <Banknote className="w-4 h-4 stroke-[2]" />
              Terima & Catat ke Kas Tunai
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
