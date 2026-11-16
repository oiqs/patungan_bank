import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { rp } from '../../lib/format'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Download, Share2, Sparkles, CheckCircle2 } from 'lucide-react'

function QRPattern() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1,0],
    [0,1,1,0,0,1,0,0,1,0,0,1,0,1,1,0,1,0,1],
    [1,0,1,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,0,1,0,0,1,1,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,1,0,1,0],
  ]
  return (
    <div className="inline-grid gap-0" style={{ gridTemplateColumns: `repeat(${pattern[0].length}, 1fr)` }}>
      {pattern.map((row, ri) =>
        row.map((cell, ci) => (
          <div
            key={`${ri}-${ci}`}
            className={`w-3.5 h-3.5 ${cell ? 'bg-[#111F1A]' : 'bg-white'}`}
          />
        ))
      )}
    </div>
  )
}

export default function PembayaranQRIS() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tagihanId = searchParams.get('id') || 't-okt26'

  const { tagihanIuran, bayarIuranWajib, isDemoMode } = useBankStore()
  const targetTagihan = tagihanIuran.find(t => t.id === tagihanId) || {
    judul: 'Iuran Wajib Tarunesha RT 05',
    nominal: 10000,
  }

  const [seconds, setSeconds] = useState(300)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [seconds])

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleEksekusiBayar = () => {
    bayarIuranWajib(tagihanId, 'qris')
    navigate('/kas/bukti', {
      state: {
        judul: targetTagihan.judul,
        nominal: targetTagihan.nominal,
        metode: 'QRIS Nasional (BCA/GoPay/OVO)',
      }
    })
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E2EBE7] px-4 py-3.5 flex items-center gap-2 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-[#111F1A] font-bold text-base">QRIS Dinamis Tarunesha</h1>
          <p className="text-xs text-[#5F7A6E]">Standar Pembayaran Nasional (ASPI / BI)</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 py-6 gap-4">
        {toastMessage && (
          <div className="w-full bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-xs font-bold p-3 rounded-2xl text-center animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Nominal Tagihan */}
        <div className="text-center">
          <p className="text-[#5F7A6E] text-sm font-semibold">{targetTagihan.judul}</p>
          <p className="text-[#111F1A] text-4xl font-black mt-1">{rp(targetTagihan.nominal)}</p>
          <p className="text-xs text-[#5F7A6E] mt-1">Bebas Biaya Admin · Transaksi Resmi RT 05</p>
        </div>

        {/* QR Box */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2EBE7] flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[#E84040]">QRIS</span>
            <span className="text-xs text-[#5F7A6E]">|</span>
            <span className="text-xs text-[#2D4539] font-bold">PEMBAYARAN RESMI</span>
          </div>
          <div className="p-3 border-2 border-[#E2EBE7] rounded-2xl bg-white shadow-inner">
            <QRPattern />
          </div>
          <p className="text-sm font-bold text-[#111F1A]">KAS PAGUYUBAN TARUNESHA RT 05</p>
        </div>

        {/* Countdown */}
        <div className={`text-center px-6 py-2.5 rounded-full ${seconds < 60 ? 'bg-red-50 text-[#E84040]' : 'bg-[#E6F4EE] text-[#1A6B4A]'}`}>
          <p className="font-extrabold text-base">
            ⏱ Sisa Waktu: {fmt(seconds)}
          </p>
          <p className="text-xs opacity-90">Selesaikan scan sebelum kode QR kedaluwarsa</p>
        </div>

        {/* Action Share / Simpan */}
        <div className="flex gap-2.5 w-full">
          <button
            onClick={() => {
              setToastMessage('✓ Gambar kode QR berhasil disimpan ke galeri.')
              setTimeout(() => setToastMessage(''), 2500)
            }}
            className="flex-1 min-h-[44px] py-2.5 border border-[#D5E2DC] rounded-xl text-sm font-bold text-[#2D4539] bg-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Download size={16} /> Simpan QR
          </button>
          <button
            onClick={() => {
              setToastMessage('✓ Tautan tagihan pembayaran disalin ke clipboard.')
              setTimeout(() => setToastMessage(''), 2500)
            }}
            className="flex-1 min-h-[44px] py-2.5 border border-[#D5E2DC] rounded-xl text-sm font-bold text-[#2D4539] bg-white active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Share2 size={16} /> Bagikan
          </button>
        </div>

        {/* Tombol Konfirmasi Pembayaran Warga */}
        <div className="w-full pt-1">
          <Button
            variant="primary"
            full
            size="lg"
            onClick={handleEksekusiBayar}
          >
            Saya Sudah Membayar
          </Button>
        </div>

        {/* Simulasi Trigger (Hanya tampil jika Mode Demo diaktifkan di Profil) */}
        {isDemoMode && (
          <div className="w-full p-4 bg-[#FEF3DC] border border-[#F5A623] rounded-2xl animate-fade-in text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#A05C00]">
              <Sparkles size={16} /> Mode Demo Penguji Aktif
            </div>
            <button
              onClick={handleEksekusiBayar}
              className="w-full py-2.5 bg-[#F5A623] hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Simulasi Webhook Pembayaran Berhasil (Instan)
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
