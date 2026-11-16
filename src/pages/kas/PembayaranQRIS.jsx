import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { rp } from '../../lib/format'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'

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
  const tagihanId = searchParams.get('id') || 't-nov26'

  const { tagihanIuran, bayarIuranWajib } = useBankStore()
  const targetTagihan = tagihanIuran.find(t => t.id === tagihanId) || {
    judul: 'Iuran Wajib Tarunesha',
    nominal: 10000,
  }

  const [seconds, setSeconds] = useState(300)
  const [tersimpan, setTersimpan] = useState(false)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setInterval(() => setSeconds(s => s - 1), 1000)
    return () => clearInterval(t)
  }, [seconds])

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSimulasiBayarBerhasil = () => {
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
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-20">
      {/* Header */}
      <div className="bg-[#111F1A] px-5 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-lg active:scale-95 transition-transform"
        >
          ←
        </button>
        <h1 className="text-white font-bold text-base">QRIS Dinamis Tarunesha</h1>
        <span className="text-white/60 text-xs">RT 05</span>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 py-6 gap-5">
        {/* Nominal */}
        <div className="text-center">
          <p className="text-[#4A6358] text-xs font-semibold mb-0.5">{targetTagihan.judul}</p>
          <p className="text-[#111F1A] text-4xl font-extrabold">{rp(targetTagihan.nominal)}</p>
          <p className="text-[11px] text-[#8FA89E] mt-1">NMID: ID102026110992 · Bebas Biaya Admin</p>
        </div>

        {/* QR Box */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-[#E2EBE7] flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E84040]">QRIS</span>
            <span className="text-xs text-[#8FA89E]">|</span>
            <span className="text-[10px] text-[#4A6358] font-bold tracking-widest uppercase">PEMBAYARAN RESMI</span>
          </div>
          <div className="p-3 border-2 border-[#E2EBE7] rounded-2xl bg-white shadow-inner">
            <QRPattern />
          </div>
          <p className="text-xs font-bold text-[#111F1A]">KAS PAGUYUBAN TARUNESHA</p>
        </div>

        {/* Countdown */}
        <div className={`text-center px-6 py-2.5 rounded-full ${seconds < 60 ? 'bg-red-50 text-[#E84040]' : 'bg-[#E6F4EE] text-[#1A6B4A]'}`}>
          <p className="font-extrabold text-base">
            ⏱ {fmt(seconds)}
          </p>
          <p className="text-[10px] opacity-80">Selesaikan scan sebelum batas waktu habis</p>
        </div>

        {/* Status Animation */}
        <div className="flex items-center gap-2 text-[#4A6358] text-xs font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623] animate-pulse" />
          Menunggu verifikasi sistem pembayaran...
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 w-full">
          <button
            onClick={() => {
              setTersimpan(true)
              setTimeout(() => setTersimpan(false), 2000)
            }}
            className="flex-1 py-3 border border-[#E2EBE7] rounded-2xl text-xs font-bold text-[#4A6358] bg-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            {tersimpan ? '✓ Tersimpan di Galeri' : '💾 Simpan QR'}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'QRIS Iuran Tarunesha', text: 'Scan untuk bayar iuran Tarunesha' })
              } else {
                alert('Tautan pembayaran disalin!')
              }
            }}
            className="flex-1 py-3 border border-[#E2EBE7] rounded-2xl text-xs font-bold text-[#4A6358] bg-white active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            📤 Bagikan
          </button>
        </div>

        {/* Simulasi Trigger (Untuk demo wireframe & alur interaktif) */}
        <div className="w-full pt-2">
          <Button
            variant="primary"
            full
            size="lg"
            onClick={handleSimulasiBayarBerhasil}
          >
            Simulasi Pembayaran Berhasil (Otomatis) ⚡
          </Button>
          <p className="text-[10px] text-center text-[#8FA89E] mt-1.5">
            Klik tombol di atas untuk simulasi webhook pembayaran QRIS berhasil
          </p>
        </div>
      </div>
    </div>
  )
}
