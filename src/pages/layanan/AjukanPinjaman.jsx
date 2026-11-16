import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

export default function AjukanPinjaman() {
  const navigate = useNavigate()
  const { currentUser, ajukanPinjaman } = useBankStore()

  const [jenis, setJenis] = useState('Pertanian')
  const [nominal, setNominal] = useState(1000000)
  const [tenor, setTenor] = useState(6)
  const [tujuan, setTujuan] = useState('')
  const [penjamin, setPenjamin] = useState('Siti Rahayu (RT 05)')
  const [fotoLahan, setFotoLahan] = useState(null)
  const [setujuSyarat, setSetujuSyarat] = useState(false)
  const [berhasil, setBerhasil] = useState(false)

  // Perhitungan bunga gotong royong 1.5% per bulan
  const totalBunga = nominal * (0.015 * tenor)
  const totalBayar = nominal + totalBunga
  const cicilanPerBulan = Math.round(totalBayar / tenor)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!tujuan.trim() || !setujuSyarat) return

    ajukanPinjaman({
      jenis,
      nominal,
      tenor,
      tujuan,
      penjamin,
      fotoLahan: fotoLahan || 'lampiran_lahan.jpg',
    })

    setBerhasil(true)
    setTimeout(() => {
      navigate('/layanan')
    }, 2000)
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Form Pengajuan Pembiayaan</h1>
      </div>

      <div className="p-4 space-y-4">
        {berhasil ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-sm">
            <span className="text-6xl animate-bounce">📋</span>
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
                  { label: 'Pertanian', icon: '🌾' },
                  { label: 'Perikanan', icon: '🐟' },
                  { label: 'Pribadi/Darurat', icon: '🧑' },
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setJenis(item.label)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 text-center transition-all ${
                      jenis === item.label
                        ? 'border-[#1A6B4A] bg-[#E8F4EE] font-bold text-[#1A6B4A]'
                        : 'border-[#E2EBE7] bg-white text-[#4A6358]'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nominal & Slider */}
            <Card className="p-4 space-y-3">
              <label className="text-xs text-[#4A6358] font-bold block">
                Nominal Pinjaman: <strong className="text-[#1A6B4A] text-lg">{rp(nominal)}</strong>
              </label>
              <input
                type="range"
                min={200000}
                max={currentUser.plafonTersedia}
                step={100000}
                value={nominal}
                onChange={e => setNominal(Number(e.target.value))}
                className="w-full accent-[#1A6B4A]"
              />
              <div className="flex justify-between text-[10px] text-[#8FA89E]">
                <span>Min: Rp 200rb</span>
                <span>Maks: {shortRp(currentUser.plafonTersedia)}</span>
              </div>
            </Card>

            {/* Pilihan Tenor */}
            <div>
              <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-2 px-1">
                Jangka Waktu (Tenor)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${
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
              <p className="text-xs font-bold text-[#7A5000]">📊 Simulasi Pengembalian</p>
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
                <span className="text-3xl">📷</span>
                <p className="text-xs font-semibold text-[#4A6358]">
                  {fotoLahan ? '✓ Foto lahan terlampir' : 'Ambil foto lahan sawah / kolam usaha'}
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
              className="mt-2"
            >
              Kirim Pengajuan Pinjaman 🚀
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
