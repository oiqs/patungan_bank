import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  FileDown,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

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
    setDownloadMsg('Menyiapkan Dokumen Laporan_Kas_Tarunesha.pdf...')
    setTimeout(() => {
      setDownloadMsg('Laporan Keuangan PDF Berhasil Diunduh!')
      setTimeout(() => setDownloadMsg(''), 3000)
    }, 1200)
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Laporan Kas Transparan</h1>
        <select
          value={bulan}
          onChange={e => setBulan(e.target.value)}
          className="text-xs border border-[#E2EBE7] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#1A6B4A] bg-white font-semibold"
        >
          {bulanList.map(b => <option key={b}>{b}</option>)}
        </select>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {downloadMsg && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-xs font-bold p-3 rounded-2xl text-center flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            <span>{downloadMsg}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3">
            <p className="text-[10px] text-[#8FA89E] font-semibold uppercase">Total Masuk</p>
            <p className="text-sm font-extrabold text-[#1A6B4A] mt-0.5">{shortRp(kasBulanIniMasuk)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[10px] text-[#8FA89E] font-semibold uppercase">Total Keluar</p>
            <p className="text-sm font-extrabold text-[#E84040] mt-0.5">{shortRp(kasBulanIniKeluar)}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[10px] text-[#8FA89E] font-semibold uppercase">Saldo Kas</p>
            <p className="text-sm font-extrabold text-[#111F1A] mt-0.5">{shortRp(kasSaldo)}</p>
          </Card>
        </div>

        {/* Bar Chart Gotong Royong */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-[#111F1A] uppercase tracking-wider">Grafik Arus Kas (6 Bulan)</p>
            <span className="text-[10px] text-[#8FA89E]">Satuan Rupiah</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-36 pt-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-1 w-full h-24">
                  <div
                    title={`Masuk: ${rp(d.masuk)}`}
                    className="flex-1 bg-[#1A6B4A] rounded-t-sm transition-all"
                    style={{ height: `${(d.masuk / maxVal) * 100}%` }}
                  />
                  <div
                    title={`Keluar: ${rp(d.keluar)}`}
                    className="flex-1 bg-[#E84040] rounded-t-sm opacity-85 transition-all"
                    style={{ height: `${(d.keluar / maxVal) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#8FA89E] font-semibold">{months[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-[#E2EBE7] justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#1A6B4A]" />
              <span className="text-xs text-[#4A6358] font-semibold">Kas Masuk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#E84040]" />
              <span className="text-xs text-[#4A6358] font-semibold">Kas Keluar (Nota)</span>
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
            Buku Jurnal Kas {bulan}
          </p>
          <Card className="divide-y divide-[#F4F7F5]">
            {kasTransaksi.map((t, i) => (
              <div key={t.id || i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  t.jenis === 'masuk' ? 'bg-[#E6F4EE] text-[#1A6B4A]' : 'bg-[#FAEAEA] text-[#E84040]'
                }`}>
                  {t.jenis === 'masuk' ? (
                    <ArrowDownLeft className="w-4 h-4 stroke-[2.2]" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111F1A] truncate">{t.judul}</p>
                  <p className="text-[10px] text-[#8FA89E] mt-0.5">{t.kategori} · {t.tgl} · {t.oleh}</p>
                </div>
                <p className={`text-xs font-extrabold flex-shrink-0 ${t.jenis === 'masuk' ? 'text-[#1A6B4A]' : 'text-[#E84040]'}`}>
                  {t.jenis === 'masuk' ? '+' : '-'}{rp(t.nominal)}
                </p>
              </div>
            ))}
          </Card>
        </div>

        {/* Export Button */}
        <Button
          full
          size="md"
          variant="outline"
          className="mt-2 flex items-center justify-center gap-2"
          onClick={handleEksporPDF}
        >
          <FileDown className="w-4 h-4 stroke-[2]" />
          Ekspor Laporan Bulanan (PDF Resmi RT 05)
        </Button>
      </div>
    </div>
  )
}
