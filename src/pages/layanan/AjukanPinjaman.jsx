import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Sprout,
  Waves,
  AlertCircle,
  Calculator,
  Camera,
  Check,
  Send,
} from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function AjukanPinjaman() {
  const navigate = useNavigate()
  const { currentUser, ajukanPinjamanBaru } = useBankStore()

  const [jenis, setJenis] = useState('Pertanian')
  const [nominal, setNominal] = useState(1000000)
  const [tenor, setTenor] = useState(6)
  const [tujuan, setTujuan] = useState('')
  const [fotoLahan, setFotoLahan] = useState(null)
  const [penjamin, setPenjamin] = useState('Siti Rahayu (RT 05)')
  const [setujuSyarat, setSetujuSyarat] = useState(false)
  const [berhasil, setBerhasil] = useState(false)

  const cicilanPerBulan = Math.round(nominal * (1 + (tenor * 0.015)) / tenor)
  const totalBayar = cicilanPerBulan * tenor

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!setujuSyarat) return

    ajukanPinjamanBaru({
      judul: `Modal Usaha ${jenis}`,
      nominal,
      tenorBulan: tenor,
      bungaPersen: 1.5,
      tujuan,
      penjamin,
      fotoLahan: fotoLahan || 'foto_lahan_default.jpg',
    })

    setBerhasil(true)
    setTimeout(() => {
      navigate('/layanan')
    }, 2000)
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Form Pengajuan Pembiayaan</h1>
      </div>

      <div className="p-4 space-y-4">
        {berhasil ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A] shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>
            <h2 className="text-xl font-bold text-[#111F1A]">Pengajuan Berhasil Dikirim!</h2>
            <p className="text-xs text-[#4A6358] leading-relaxed max-w-xs">
              Pengajuan pembiayaan Anda sebesar <strong>{rp(nominal)}</strong> telah masuk ke antrean verifikasi Bendahara dan Ketua Tarunesha.
            </p>
            <span className="text-xs text-[#1A6B4A] font-bold bg-[#E6F4EE] px-4 py-1.5 rounded-full">
              Status: Menunggu Persetujuan
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plafon Info */}
            <div className="bg-gradient-to-r from-[#1A6B4A] to-[#2D8B63] rounded-2xl p-4 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 font-semibold">Plafon Maksimal Anda</p>
                <p className="text-xl font-extrabold mt-0.5">{rp(currentUser.plafonTersedia)}</p>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">
                Skor: {currentUser.skor}
              </span>
            </div>

            {/* Pilihan Jenis */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-2 px-1">
                Pilih Sektor Usaha
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Pertanian', icon: Sprout, color: 'text-[#1A6B4A]' },
                  { label: 'Perikanan', icon: Waves, color: 'text-[#2B6CB0]' },
                  { label: 'Pribadi/Darurat', icon: AlertCircle, color: 'text-[#E84040]' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setJenis(item.label)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                        jenis === item.label
                          ? 'border-[#1A6B4A] bg-[#E8F4EE] font-bold text-[#1A6B4A]'
                          : 'border-[#E2EBE7] bg-white text-[#4A6358]'
                      }`}
                    >
                      <div className={item.color}>
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-xs">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nominal Slider & Preset */}
            <div>
              <div className="flex justify-between items-center mb-1.5 px-1">
                <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">
                  Nominal Pengajuan
                </label>
                <span className="text-base font-extrabold text-[#1A6B4A]">{rp(nominal)}</span>
              </div>
              <input
                type="range"
                min={300000}
                max={currentUser.plafonTersedia}
                step={100000}
                value={nominal}
                onChange={e => setNominal(Number(e.target.value))}
                className="w-full accent-[#1A6B4A] mb-2"
              />
              <div className="flex justify-between text-[10px] text-[#8FA89E] mb-3">
                <span>Rp 300rb</span>
                <span>Maks: {shortRp(currentUser.plafonTersedia)}</span>
              </div>
            </div>

            {/* Pilihan Tenor */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1.5 px-1">
                Jangka Waktu Cicilan (Tenor)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      tenor === t
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#4A6358] border-[#E2EBE7]'
                    }`}
                  >
                    {t} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Ringkasan Simulasi */}
            <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-bold text-[#7A5000] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 stroke-[2]" />
                Simulasi Pengembalian
              </p>
              <div className="flex justify-between text-xs text-[#7A5000]">
                <span>Cicilan per Bulan:</span>
                <strong>{rp(cicilanPerBulan)} / bln</strong>
              </div>
              <div className="flex justify-between text-xs text-[#7A5000]">
                <span>Total Pengembalian:</span>
                <strong>{rp(totalBayar)}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-[#9A6A10]">
                <span>Jasa Kas Gotong Royong:</span>
                <span>1.5% per bulan</span>
              </div>
            </div>

            {/* Tujuan Penggunaan */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Tujuan Penggunaan Modal
              </label>
              <textarea
                rows={3}
                value={tujuan}
                onChange={e => setTujuan(e.target.value)}
                placeholder="Contoh: Pembelian bibit cabai, pupuk NPK 2 karung untuk lahan sawah blok kidul..."
                className="w-full border border-[#E2EBE7] rounded-2xl p-3.5 text-xs focus:outline-none focus:border-[#1A6B4A] bg-white leading-relaxed"
                required
              />
            </div>

            {/* Unggah Foto Lahan / Kolam */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Upload Foto Lahan / Kolam Pendukung
              </label>
              <div className="border-2 border-dashed border-[#E2EBE7] rounded-2xl p-4 text-center bg-white flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#F4F7F5] flex items-center justify-center text-[#4A6358]">
                  <Camera className="w-6 h-6 stroke-[1.8]" />
                </div>
                <p className="text-xs font-semibold text-[#4A6358] flex items-center gap-1">
                  {fotoLahan ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1A6B4A] stroke-[2.5]" />
                      <span>Foto lahan terlampir</span>
                    </>
                  ) : (
                    'Ambil foto lahan sawah / kolam usaha'
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setFotoLahan('foto_lahan_terverifikasi.jpg')}
                  className="text-xs text-[#1A6B4A] font-bold underline"
                >
                  {fotoLahan ? 'Ganti Foto' : '+ Pilih Foto Pendukung'}
                </button>
              </div>
            </div>

            {/* Penjamin */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                Anggota Penjamin Warga
              </label>
              <select
                value={penjamin}
                onChange={e => setPenjamin(e.target.value)}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-xs bg-white text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
              >
                <option value="Siti Rahayu (RT 05)">Siti Rahayu (RT 05)</option>
                <option value="Ahmad Fauzi (RT 05)">Ahmad Fauzi (RT 05)</option>
                <option value="Dewi Lestari (RT 05)">Dewi Lestari (RT 05)</option>
                <option value="Roni Wijaya (RT 05)">Roni Wijaya (RT 05)</option>
              </select>
            </div>

            {/* Checkbox Persetujuan */}
            <label className="flex items-start gap-2.5 px-1 cursor-pointer">
              <input
                type="checkbox"
                checked={setujuSyarat}
                onChange={e => setSetujuSyarat(e.target.checked)}
                className="mt-0.5 rounded accent-[#1A6B4A] w-4 h-4"
              />
              <span className="text-xs text-[#4A6358] leading-relaxed">
                Saya menyatakan data di atas benar dan bersedia mengembalikan pinjaman sesuai jadwal cicilan musyawarah.
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              full
              disabled={!setujuSyarat || !tujuan.trim()}
              className="mt-2 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2]" />
              Kirim Pengajuan Pinjaman
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
