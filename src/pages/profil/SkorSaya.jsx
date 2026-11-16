import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Sparkles, CheckCircle2, Target } from 'lucide-react'

export default function SkorSaya() {
  const navigate = useNavigate()
  const { currentUser } = useBankStore()

  // Perhitungan bobot matematis yang akurat menghasilkan skor 82:
  // (85*0.35) + (80*0.25) + (85*0.25) + (73*0.15) = 29.75 + 20.0 + 21.25 + 10.95 = 81.95 => 82
  const faktorList = [
    {
      nama: 'Kedisiplinan Iuran Wajib',
      bobot: '35%',
      skor: 85,
      status: 'Sangat Baik',
      desc: '5 dari 6 bulan terbayar tepat waktu sebelum tanggal 20.'
    },
    {
      nama: 'Partisipasi Arisan & Kas',
      bobot: '25%',
      skor: 80,
      status: 'Aktif',
      desc: 'Rutin ikut serta arisan bulanan dan sumbangan dana sosial.'
    },
    {
      nama: 'Riwayat Cicilan Pinjaman',
      bobot: '25%',
      skor: 85,
      status: 'Lancar',
      desc: 'Cicilan pembiayaan usaha berjalan tertib tanpa keterlambatan.'
    },
    {
      nama: 'Kehadiran Musyawarah Warga',
      bobot: '15%',
      skor: 73,
      status: 'Cukup Baik',
      desc: 'Menghadiri rapat rutin dan agenda gotong royong Tarunesha.'
    },
  ]

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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Skor Kelayakan Anggota</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Score Hero Card (Solid background for high readability) */}
        <div className="bg-[#1A6B4A] rounded-3xl p-6 text-white text-center shadow-md">
          <p className="text-xs uppercase tracking-wider text-white/90 font-bold mb-2">
            Indeks Reputasi Tarunesha RT 05
          </p>

          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/60 mx-auto flex flex-col items-center justify-center my-3 shadow-inner">
            <span className="text-4xl font-black leading-none">{currentUser.skor}</span>
            <span className="text-xs text-white/90 font-bold tracking-wider mt-0.5">DARI 100</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-xs px-3.5 py-1.5 rounded-full mb-3">
            <CheckCircle2 size={14} />
            <span>Kategori: Anggota Terpercaya</span>
          </div>

          <div className="bg-[#124E35] rounded-2xl p-3.5 border border-white/20 mt-2">
            <p className="text-xs text-white/90">Batas Plafon Pembiayaan Saat Ini</p>
            <p className="text-2xl font-black text-white mt-0.5">{rp(currentUser.plafonTersedia)}</p>
          </div>
        </div>

        {/* AI CREDIT SCORING INSIGHT (Disederhanakan tanpa angka probabilitas teknis yang membingungkan) */}
        <div className="bg-[#EBF7F1] border border-[#1A6B4A]/30 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[#1A6B4A]">
            <Sparkles size={18} />
            <h3 className="text-sm font-bold">Catatan Reputasi patuAI</h3>
          </div>
          <p className="text-sm text-[#2D4539] leading-relaxed">
            Pembayaran iuran dan cicilan Anda sangat lancar. Berdasarkan catatan gotong royong yang aktif, Anda memenuhi syarat untuk kenaikan batas pembiayaan.
          </p>
          <div className="bg-white p-3 rounded-xl border border-[#4DB87F]/40 flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A6B4A]">Rekomendasi Plafon:</span>
            <span className="bg-[#E6F4EE] text-[#1A6B4A] font-bold px-3 py-1 rounded-full text-xs">
              Layak Naik ke Rp 3.500.000
            </span>
          </div>
        </div>

        {/* Rincian Faktor Penilaian */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2.5 px-1">
            Rincian Faktor Penilaian
          </h3>
          <div className="space-y-2.5">
            {faktorList.map((f, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-sm font-bold text-[#111F1A]">{f.nama}</p>
                    <span className="text-xs text-[#5F7A6E]">Bobot nilai: {f.bobot}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    f.skor >= 85 ? 'bg-[#E6F4EE] text-[#1A6B4A]' : 'bg-[#FEF3DC] text-[#A05C00]'
                  }`}>
                    {f.skor} · {f.status}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#E2EBE7] rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      f.skor >= 85 ? 'bg-[#1A6B4A]' : 'bg-[#F5A623]'
                    }`}
                    style={{ width: `${f.skor}%` }}
                  />
                </div>

                <p className="text-xs text-[#5F7A6E] leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Target Peningkatan Plafon (Konsisten ke Rp 3.500.000) */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
            Langkah Menaikkan Plafon
          </h3>
          <Card className="p-4 space-y-3 border-l-4 border-l-[#1A6B4A]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center flex-shrink-0">
                <Target size={20} />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-[#111F1A]">Target Plafon: Rp 3.500.000</p>
                <p className="text-xs text-[#5F7A6E] mt-0.5 leading-relaxed">
                  Tingkatkan skor Anda menjadi <strong>90 poin</strong> dengan:
                </p>
                <ul className="text-xs text-[#2D4539] list-disc list-inside mt-2 space-y-1">
                  <li>Lunasi tagihan Iuran Wajib Oktober sebelum akhir bulan.</li>
                  <li>Hadir pada rapat koordinasi Tarunesha Jumat mendatang.</li>
                  <li>Selesaikan cicilan pinjaman berjalan secara tepat waktu.</li>
                </ul>
              </div>
            </div>

            <Button full size="md" variant="primary" onClick={() => navigate('/kas')}>
              Bayar Tagihan Iuran Sekarang
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
