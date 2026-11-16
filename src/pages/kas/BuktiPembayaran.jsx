import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { rp } from '../../lib/format'
import Button from '../../components/Button'
import { CheckCircle2, Share2, Home } from 'lucide-react'

export default function BuktiPembayaran() {
  const navigate = useNavigate()
  const location = useLocation()
  const customData = location.state || {}
  const [toast, setToast] = useState('')

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
      setToast('✓ Bukti pembayaran disalin ke clipboard.')
      setTimeout(() => setToast(''), 2500)
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#F4F7F5] overflow-y-auto no-scrollbar pt-12 px-5 py-6 gap-4 pb-20">
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-full bg-[#E6F4EE] border-4 border-[#1A6B4A]/20 flex items-center justify-center text-[#1A6B4A] shadow-xs animate-scale-up">
        <CheckCircle2 size={36} />
      </div>

      <div className="text-center">
        <h1 className="text-[#111F1A] text-2xl font-black tracking-tight">Pembayaran Berhasil!</h1>
        <p className="text-[#456355] text-sm mt-1 max-w-xs leading-relaxed">
          Terima kasih. Dana telah masuk ke kas RT Tarunesha dan tercatat di buku kas digital.
        </p>
      </div>

      {toast && (
        <div className="w-full bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-xs font-bold p-3 rounded-xl text-center animate-fade-in">
          {toast}
        </div>
      )}

      {/* Detail Card Struk */}
      <div className="w-full bg-white rounded-3xl border border-[#E2EBE7] overflow-hidden shadow-xs divide-y divide-[#E2EBE7]">
        <div className="bg-[#1A6B4A] text-white p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-white/90">Kuitansi Resmi Digital</p>
          <p className="text-base font-black mt-0.5">PATUNGAN BANK TARUNESHA RT 05</p>
        </div>

        {details.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3.5 text-sm"
          >
            <span className="text-[#5F7A6E] font-medium">{d.label}</span>
            <span className="font-bold text-[#111F1A] text-right">{d.value}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2 pt-2">
        <Button
          variant="outline"
          full
          size="md"
          onClick={handleShare}
        >
          <Share2 size={16} /> Bagikan Kuitansi
        </Button>
        <Button
          variant="primary"
          full
          size="md"
          onClick={() => navigate('/')}
        >
          <Home size={16} /> Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
