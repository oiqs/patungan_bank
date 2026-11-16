import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Download, TrendingUp, TrendingDown, FileText } from 'lucide-react'

const months = ['Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov']
const chartData = [
  { masuk: 850000, keluar: 320000 },
  { masuk: 920000, keluar: 410000 },
  { masuk: 780000, keluar: 280000 },
  { masuk: 1100000, keluar: 530000 },
  { masuk: 960000, keluar: 400000 },
  { masuk: 870000, keluar: 350000 },
]
const maxVal = Math.max(...chartData.flatMap(d => [d.masuk, d.keluar]))
const bulanList = ['November 2026', 'Oktober 2026', 'September 2026', 'Agustus 2026']

export default function LaporanKas() {
  const navigate = useNavigate()
  const { kasSaldo, kasBulanIniMasuk, kasBulanIniKeluar, kasTransaksi } = useBankStore()
  const [bulan, setBulan] = useState(bulanList[0])
  const [downloadMsg, setDownloadMsg] = useState('')

  const handleEksporPDF = () => {
    setDownloadMsg('Menyiapkan Dokumen Laporan_Kas_Tarunesha_Nov2026.pdf...')
    setTimeout(() => {
      setDownloadMsg('✓ Laporan Keuangan PDF Berhasil Diunduh!')
      setTimeout(() => setDownloadMsg(''), 3000)
    }, 1200)
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Laporan Kas Transparan</h1>
        <select
          value={bulan}
          onChange={e => setBulan(e.target.value)}
          className="text-xs border border-[#D5E2DC] rounded-xl px-3 py-2 focus:outline-none focus:border-[#1A6B4A] bg-white font-bold text-[#2D4539]"
        >
          {bulanList.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="px-4 py-4 space-y-4">
        {downloadMsg && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-xs font-bold p-3.5 rounded-2xl text-center animate-fade-in">
            {downloadMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3">
            <p className="text-xs text-[#5F7A6E] font-semibold">Total Masuk</p>
            <p className="text-base font-extrabold text-[#1A6B4A] mt-0.5">+{shortRp(kasBulanIniMasuk)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-[#5F7A6E] font-semibold">Total Keluar</p>
            <p className="text-base font-extrabold text-[#E84040] mt-0.5">-{shortRp(kasBulanIniKeluar)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-[#5F7A6E] font-semibold">Saldo Kas</p>
            <p className="text-base font-black text-[#111F1A] mt-0.5">{shortRp(kasSaldo)}</p>
          </Card>
        </div>

        {/* Bar Chart */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111F1A]">Tren Kas 6 Bulan Terakhir</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-[#1A6B4A] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1A6B4A]" /> Masuk
              </span>
              <span className="flex items-center gap-1 text-[#E84040] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E84040]" /> Keluar
              </span>
            </div>
          </div>

          <div className="flex items-end justify-between h-36 pt-4 pb-1 px-1">
            {chartData.map((d, i) => {
              const hMasuk = Math.round((d.masuk / maxVal) * 100)
              const hKeluar = Math.round((d.keluar / maxVal) * 100)
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="flex items-end gap-1 w-full justify-center h-28">
                    <div
                      className="w-3 rounded-t-sm bg-[#1A6B4A] transition-all duration-300"
                      style={{ height: `${hMasuk}%` }}
                      title={`Masuk: ${rp(d.masuk)}`}
                    />
                    <div
                      className="w-3 rounded-t-sm bg-[#E84040] transition-all duration-300"
                      style={{ height: `${hKeluar}%` }}
                      title={`Keluar: ${rp(d.keluar)}`}
                    />
                  </div>
                  <span className="text-xs text-[#5F7A6E] font-bold">{months[i]}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Pos Alokasi */}
        <Card className="p-4 space-y-3">
          <h3 className="text-sm font-bold text-[#111F1A]">Alokasi Pengeluaran Kas RT</h3>
          <div className="space-y-2.5">
            {[
              { pos: 'Honor Satpam & Pos Keamanan', pct: 40, nominal: 140000 },
              { pos: 'Operasional Kebersihan Lingkungan', pct: 30, nominal: 105000 },
              { pos: 'Perbaikan Lampu Jalan & Fasilitas', pct: 20, nominal: 70000 },
              { pos: 'Kas Dana Cadangan Darurat', pct: 10, nominal: 35000 },
            ].map((p, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#2D4539]">
                  <span>{p.pos}</span>
                  <span>{rp(p.nominal)} ({p.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-[#E2EBE7] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1A6B4A] rounded-full" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ekspor Laporan Button */}
        <Button full size="md" variant="primary" onClick={handleEksporPDF}>
          <Download size={18} /> Unduh Laporan Lengkap (PDF)
        </Button>
      </div>
    </div>
  )
}
