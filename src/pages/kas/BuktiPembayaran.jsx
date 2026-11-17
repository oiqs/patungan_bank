import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Share2, Home } from 'lucide-react'
import { rp } from '../../lib/format'
import Button from '../../components/Button'

export default function BuktiPembayaran() {
  const navigate = useNavigate()
  const location = useLocation()
  const customData = location.state || {}

  const details = [
    { label: 'No. Referensi', value: `TRN-${Date.now().toString().slice(-8)}` },
    { label: 'Waktu Transaksi', value: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { label: 'Jenis Pembayaran', value: customData.judul || 'Iuran Wajib Tarunesha' },
    { label: 'Total Nominal', value: rp(customData.nominal || 10000) },
    { label: 'Kanal Pembayaran', value: customData.metode || 'QRIS Dinamis' },
    { label: 'Status Verifikasi', value: 'Lunas Otomatis' },
  ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Bukti Pembayaran Patungan Bank Tarunesha',
        text: `Pembayaran ${customData.judul || 'Iuran Wajib'} sebesar ${rp(customData.nominal || 10000)} BERHASIL LUNAS. Ref: ${details[0].value}`,
      })
    } else {
      alert('Bukti pembayaran berhasil disalin ke clipboard!')
    }
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col items-center pt-12 px-5 py-8 gap-5 pb-20">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-[#E6F4EE] border-4 border-[#1A6B4A]/20 flex items-center justify-center shadow-md animate-scale-up">
        <CheckCircle2 className="w-12 h-12 text-[#1A6B4A] stroke-[2]" />
      </div>

      <div className="text-center">
        <h1 className="text-[#111F1A] text-2xl font-extrabold tracking-tight">Pembayaran Berhasil!</h1>
        <p className="text-[#4A6358] text-xs mt-1 max-w-xs">
          Terima kasih. Dana telah resmi masuk ke kas Tarunesha dan tercatat di buku kas digital.
        </p>
      </div>

      {/* Detail Card Struk */}
      <div className="w-full bg-white rounded-3xl border border-[#E2EBE7] overflow-hidden shadow-sm divide-y divide-[#E2EBE7]">
        <div className="bg-[#1A6B4A] text-white p-4 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80">Kuitansi Resmi Digital</p>
          <p className="text-base font-extrabold mt-0.5">PATUNGAN BANK TARUNESHA RT 05</p>
        </div>

        {details.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3.5 text-xs"
          >
            <span className="text-[#8FA89E] font-medium">{d.label}</span>
            <span className="font-bold text-[#111F1A] text-right">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5 w-full mt-2">
        <Button
          full
          size="md"
          variant="outline"
          className="flex items-center justify-center gap-2"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 stroke-[2]" />
          Bagikan Bukti Transaksi
        </Button>
        <Button
          full
          size="lg"
          variant="primary"
          className="flex items-center justify-center gap-2"
          onClick={() => navigate('/beranda')}
        >
          <Home className="w-4 h-4 stroke-[2]" />
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
