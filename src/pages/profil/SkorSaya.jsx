import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function SkorSaya() {
  const navigate = useNavigate()
  const { currentUser } = useBankStore()

  const faktorList = [
    { nama: 'Kedisiplinan Iuran Wajib', bobot: '35%', skor: 95, status: 'Sangat Baik', desc: '9 dari 11 bulan terbayar tepat waktu sebelum tanggal 20.' },
    { nama: 'Partisipasi Arisan & Patungan', bobot: '25%', skor: 90, status: 'Aktif', desc: 'Rutin ikut serta arisan bulanan dan sumbangan dana sosial.' },
    { nama: 'Riwayat Cicilan Pinjaman', bobot: '25%', skor: 85, status: 'Lancar', desc: 'Pinjaman Pertanian berjalan 2 kali cicilan tanpa keterlambatan.' },
    { nama: 'Kehadiran Musyawarah & Gotong Royong', bobot: '15%', skor: 60, status: 'Perlu Ditingkatkan', desc: 'Menghadiri 2 dari 4 agenda rapat rutin Tarunesha.' },
  ]

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Skor Kelayakan Saya</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Score Hero Card */}
        <div className="bg-gradient-to-br from-[#1A6B4A] via-[#2D8B63] to-[#4DB87F] rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />

          <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-2">Indeks Reputasi Tarunesha</p>

          <div className="w-24 h-24 rounded-full bg-white/15 border-4 border-white/50 mx-auto flex flex-col items-center justify-center my-3 backdrop-blur-sm shadow-inner">
            <span className="text-3xl font-extrabold leading-none">{currentUser.skor}</span>
            <span className="text-[10px] text-white/80 font-bold tracking-wider mt-0.5">DARI 100</span>
          </div>

          <span className="inline-block bg-white/20 text-white font-bold text-xs px-3.5 py-1 rounded-full mb-3">
            ⭐ Kategori: Anggota Terpercaya
          </span>

          <div className="bg-white/10 rounded-2xl p-3 border border-white/20 mt-2">
            <p className="text-xs text-white/80">Plafon Pembiayaan Aktif</p>
            <p className="text-xl font-extrabold text-white mt-0.5">{rp(currentUser.plafonTersedia)}</p>
          </div>
        </div>

        {/* AI CREDIT SCORING INSIGHT */}
        <div className="bg-[#EBF7F1] border border-[#1A6B4A]/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <p className="text-xs font-bold text-[#1A6B4A] uppercase tracking-wider">Analisis AI Reputasi Warga</p>
          </div>
          <p className="text-xs text-[#4A6358] leading-relaxed">
            Algoritma AI memprediksi tingkat probabilitas pengembalian pinjaman Anda sebesar <strong>96.4% (Tinggi)</strong>. Pola pembayaran iuran Anda sangat konsisten setiap awal bulan.
          </p>
          <div className="bg-white p-3 rounded-xl border border-[#4DB87F]/40 flex items-center justify-between text-xs">
            <span className="text-[#1A6B4A] font-bold">Rekomendasi AI:</span>
            <span className="bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2 py-0.5 rounded-full text-[11px]">
              Layak Naik Plafon ke Rp 3.5 Juta
            </span>
          </div>
        </div>

        {/* Rincian Faktor Penilaian */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-3 px-1">Rincian Faktor Penilaian</p>
          <div className="space-y-2.5">
            {faktorList.map((f, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-sm font-bold text-[#111F1A]">{f.nama}</p>
                    <span className="text-[10px] text-[#8FA89E] font-semibold">Bobot: {f.bobot}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    f.skor >= 90 ? 'bg-[#E6F4EE] text-[#1A6B4A]' : f.skor >= 75 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {f.skor} · {f.status}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#E2EBE7] rounded-full overflow-hidden my-2">
                  <div
                    className={`h-full rounded-full transition-all ${
                      f.skor >= 90 ? 'bg-[#1A6B4A]' : f.skor >= 75 ? 'bg-[#2D8B63]' : 'bg-[#F5A623]'
                    }`}
                    style={{ width: `${f.skor}%` }}
                  />
                </div>

                <p className="text-xs text-[#4A6358] leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Saran Peningkatan Plafon */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-3 px-1">Saran Menaikkan Plafon</p>
          <Card className="p-4 space-y-3 border-l-4 border-l-[#F5A623]">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <p className="text-sm font-bold text-[#111F1A]">Target Plafon: Rp 5.000.000</p>
                <p className="text-xs text-[#4A6358] mt-1 leading-relaxed">
                  Tingkatkan skor Anda menjadi <strong>90 poin</strong> dengan:
                </p>
                <ul className="text-xs text-[#4A6358] list-disc list-inside mt-2 space-y-1">
                  <li>Lunasi tagihan Iuran Wajib November sebelum tanggal 20.</li>
                  <li>Hadir pada rapat koordinasi Tarunesha Jumat mendatang.</li>
                  <li>Selesaikan cicilan pinjaman berjalan secara tepat waktu.</li>
                </ul>
              </div>
            </div>

            <Button full size="sm" variant="primary" onClick={() => navigate('/kas')}>
              Bayar Iuran Sekarang
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
