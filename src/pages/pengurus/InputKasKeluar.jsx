import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Camera, Sparkles, CheckCircle2, Receipt } from 'lucide-react'

export default function InputKasKeluar() {
  const navigate = useNavigate()
  const { kasSaldo, inputKasKeluar } = useBankStore()

  const [keperluan, setKeperluan] = useState('')
  const [kategori, setKategori] = useState('Operasional')
  const [nominal, setNominal] = useState('')
  const [kegiatanTerkait, setKegiatanTerkait] = useState('Kas Umum RT 05')
  const [fotoNota, setFotoNota] = useState(null)
  const [isScanningAI, setIsScanningAI] = useState(false)
  const [aiDetectedInfo, setAiDetectedInfo] = useState('')
  const [sukses, setSukses] = useState(false)

  const handleScanNotaAI = () => {
    setIsScanningAI(true)
    setAiDetectedInfo('')

    setTimeout(() => {
      setIsScanningAI(false)
      setKeperluan('Belanja Cat Tembok, Kuas & Perlengkapan Pos Ronda (Toko Makmur)')
      setNominal('85000')
      setKategori('Pemeliharaan')
      setKegiatanTerkait('Kas Umum RT 05')
      setFotoNota('Struk-Toko-Makmur-Scan.jpg')
      setAiDetectedInfo('Berhasil membaca nota fisik Toko Makmur Abadi! Nominal Rp 85.000 & rincian belanja otomatis terisi.')
    }, 1100)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!keperluan.trim() || !nominal || Number(nominal) <= 0) return

    inputKasKeluar({
      keperluan,
      kategori,
      nominal: Number(nominal),
      kegiatanTerkait,
      nota: fotoNota || 'Nota-Fisik-Terlampir.jpg',
    })

    setSukses(true)
    setTimeout(() => {
      navigate('/pengurus')
    }, 1500)
  }

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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Pencatatan Kas Keluar</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-[#111F1A]">Pengeluaran Berhasil Dicatat!</h2>
            <p className="text-sm text-[#456355]">
              Kas keluar sebesar <strong>{rp(Number(nominal))}</strong> telah dibukukan dan otomatis terintegrasi ke buku kas transparan.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Saldo Kas RT Saat Ini */}
            <Card className="p-4 bg-white border border-[#D5E2DC]">
              <span className="text-xs font-bold text-[#5F7A6E]">Saldo Kas RT Tersedia:</span>
              <p className="text-2xl font-black text-[#1A6B4A] mt-0.5">{rp(kasSaldo)}</p>
            </Card>

            {/* Smart OCR Scan Nota Box */}
            <div className="bg-[#EBF7F1] border border-[#1A6B4A]/30 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#1A6B4A]">
                  <Sparkles size={18} />
                  <span className="text-sm font-bold">Pindai Nota dengan patuAI</span>
                </div>
                <button
                  type="button"
                  onClick={handleScanNotaAI}
                  disabled={isScanningAI}
                  className="bg-[#1A6B4A] hover:bg-[#207e58] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <Camera size={15} />
                  <span>{isScanningAI ? 'Membaca Nota...' : 'Foto Struk'}</span>
                </button>
              </div>
              <p className="text-xs text-[#456355] leading-relaxed">
                Ambil foto nota/struk belanja fisik. patuAI akan otomatis membaca nominal dan keperluan belanja.
              </p>
              {aiDetectedInfo && (
                <div className="bg-white p-3 rounded-xl border border-[#4DB87F]/40 text-xs text-[#1A6B4A] font-bold animate-fade-in">
                  ✓ {aiDetectedInfo}
                </div>
              )}
            </div>

            {/* Keperluan Belanja */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Uraian / Keperluan Pengeluaran
              </label>
              <input
                type="text"
                placeholder="Contoh: Pembelian lampu jalan LED 3 unit"
                value={keperluan}
                onChange={e => setKeperluan(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                required
              />
            </div>

            {/* Nominal */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Nominal Nota (Rp)
              </label>
              <input
                type="number"
                placeholder="Contoh: 85000"
                value={nominal}
                onChange={e => setNominal(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                required
              />
            </div>

            {/* Kategori Pos Kas */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Kategori Pos Alokasi
              </label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                <option value="Operasional">Operasional RT &amp; Kebersihan</option>
                <option value="Pemeliharaan">Pemeliharaan Sarana &amp; Pos Ronda</option>
                <option value="Kegiatan Warga">Kegiatan Warga &amp; Peringatan</option>
                <option value="Santunan Sosial">Santunan Sosial &amp; Warga Sakit</option>
              </select>
            </div>

            <Button full size="lg" variant="primary" type="submit">
              Simpan &amp; Bukukan Kas Keluar
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
