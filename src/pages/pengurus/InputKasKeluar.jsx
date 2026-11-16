import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ScanLine,
  Loader2,
  Check,
  FileText,
  Save,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

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

  // Fitur AI Vision OCR Nota Otomatis
  const handleScanNotaAI = () => {
    setIsScanningAI(true)
    setAiDetectedInfo('')

    setTimeout(() => {
      setIsScanningAI(false)
      setKeperluan('Belanja Cat Tembok, Kuas & Perlengkapan Pos Ronda (Toko Makmur)')
      setNominal('85000')
      setKategori('Pemeliharaan')
      setKegiatanTerkait('Kas Umum RT 05')
      setFotoNota('Struk-Toko-Makmur-AI-Scan.jpg')
      setAiDetectedInfo('Berhasil membaca nota fisik Toko Makmur Abadi! Nominal Rp 85.000 & item barang otomatis terisi (Akurasi 98.9%).')
    }, 1200)
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Input Kas Keluar</h1>
      </div>

      <div className="p-4 space-y-4">
        {sukses ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A] shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
            <h2 className="text-xl font-bold text-[#111F1A]">Pengeluaran Kas Terbukukan!</h2>
            <p className="text-xs text-[#4A6358] max-w-xs">
              Pengeluaran sebesar <strong>{rp(Number(nominal))}</strong> untuk {keperluan} berhasil dibukukan dan memotong saldo kas Tarunesha.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Saldo Kas Banner */}
            <div className="bg-gradient-to-r from-[#1A6B4A] to-[#2D8B63] rounded-2xl p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 font-semibold">Saldo Kas Tarunesha</p>
                <p className="text-2xl font-extrabold mt-0.5">{rp(kasSaldo)}</p>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                Bendahara
              </span>
            </div>

            {/* AI OCR SCANNER CARD */}
            <div className="bg-[#EBF7F1] border border-[#1A6B4A]/30 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1A6B4A]/10 flex items-center justify-center text-[#1A6B4A]">
                    <Sparkles className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A6B4A]">Fitur AI OCR Nota Otomatis</p>
                    <p className="text-[11px] text-[#4A6358]">Foto nota warung, AI otomatis mengisi form</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleScanNotaAI}
                  disabled={isScanningAI}
                  className="bg-[#1A6B4A] hover:bg-[#237c56] text-white text-xs font-bold px-3 py-2 rounded-xl active:scale-95 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ScanLine className="w-3.5 h-3.5 stroke-[2]" />
                  <span>{isScanningAI ? 'Scanning...' : 'Pindai AI'}</span>
                </button>
              </div>

              {isScanningAI && (
                <div className="mt-3 flex items-center gap-2 text-xs text-[#1A6B4A] font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2]" />
                  <span>AI sedang memproses & membaca teks nota belanja...</span>
                </div>
              )}

              {aiDetectedInfo && (
                <div className="mt-2.5 bg-white p-2.5 rounded-xl border border-[#4DB87F] text-[11px] text-[#1A6B4A] font-medium leading-relaxed flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#1A6B4A] stroke-[2.5] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>AI Vision:</strong> {aiDetectedInfo}
                  </div>
                </div>
              )}
            </div>

            {/* Keperluan */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Keperluan Pengeluaran
              </label>
              <input
                type="text"
                placeholder="Contoh: Belanja Cat & Kuas Gapura RW"
                value={keperluan}
                onChange={e => setKeperluan(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-xs bg-white focus:outline-none focus:border-[#1A6B4A]"
                required
              />
            </div>

            {/* Nominal */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Nominal Nota (Rp)
              </label>
              <input
                type="number"
                placeholder="0"
                value={nominal}
                onChange={e => setNominal(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-base font-bold bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1.5 px-1">
                Kategori Anggaran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Operasional', 'Pemeliharaan', 'Konsumsi'].map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKategori(k)}
                    className={`py-2 rounded-xl border text-xs font-semibold transition-all ${
                      kategori === k
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#4A6358] border-[#E2EBE7]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Alokasi Kegiatan Terkait */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Alokasi Buku Kas Terkait
              </label>
              <select
                value={kegiatanTerkait}
                onChange={e => setKegiatanTerkait(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                <option value="Kas Umum RT 05">Kas Umum RT 05</option>
                <option value="Pentas Seni & Bazar 17 Agustus">Pentas Seni & Bazar 17 Agustus</option>
                <option value="Bakti Sosial & Santunan Lansia">Bakti Sosial & Santunan Lansia</option>
              </select>
            </div>

            {/* Unggah Foto Struk */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Unggah Foto Struk / Nota Fisik
              </label>
              <Card className="p-4 border-2 border-dashed border-[#E2EBE7] text-center flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#F4F7F5] flex items-center justify-center text-[#4A6358]">
                  <FileText className="w-6 h-6 stroke-[1.8]" />
                </div>
                <p className="text-xs text-[#4A6358] flex items-center gap-1">
                  {fotoNota ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1A6B4A] stroke-[2.5]" />
                      <span>Foto struk terlampir ({fotoNota})</span>
                    </>
                  ) : (
                    'Wajib melampirkan foto nota pengeluaran'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setFotoNota('Struk-Toko-Makmur-Fisik.jpg')}
                  className="text-xs text-[#1A6B4A] font-bold underline"
                >
                  {fotoNota ? 'Ganti Foto' : '+ Ambil Foto Nota'}
                </button>
              </Card>
            </div>

            <Button
              type="submit"
              variant="primary"
              full
              size="lg"
              className="mt-4 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4 stroke-[2]" />
              Simpan & Potong Saldo Kas
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
