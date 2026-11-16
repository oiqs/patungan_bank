import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, CheckCircle2, Sprout, Fish, UserCheck, ShieldCheck } from 'lucide-react'

export default function AjukanPinjaman() {
  const navigate = useNavigate()
  const { currentUser, ajukanPinjaman } = useBankStore()

  const [jenis, setJenis] = useState('Pertanian')
  const [nominal, setNominal] = useState(1000000)
  const [tenor, setTenor] = useState(6)
  const [tujuan, setTujuan] = useState('')
  const [penjamin, setPenjamin] = useState('Siti Rahayu (RT 05)')
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
      fotoLahan: 'lampiran_lahan.jpg',
    })

    setBerhasil(true)
    setTimeout(() => {
      navigate('/layanan')
    }, 2000)
  }

  const sektorList = [
    { label: 'Pertanian', icon: Sprout },
    { label: 'Perikanan', icon: Fish },
    { label: 'Pribadi/Darurat', icon: UserCheck },
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Form Pengajuan Pembiayaan</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {berhasil ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-4 my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-[#111F1A]">Pengajuan Berhasil Dikirim!</h2>
            <p className="text-sm text-[#456355] leading-relaxed max-w-xs">
              Permohonan pembiayaan modal usaha sebesar <strong>{rp(nominal)}</strong> telah masuk ke antrean verifikasi Bendahara dan Ketua RT 05 Tarunesha.
            </p>
            <span className="text-xs text-[#1A6B4A] font-bold bg-[#E6F4EE] px-4 py-2 rounded-full">
              Status: Menunggu Persetujuan
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plafon Info */}
            <div className="bg-[#1A6B4A] rounded-2xl p-4 text-white flex items-center justify-between shadow-xs">
              <div>
                <p className="text-xs text-white/90 font-medium">Batas Plafon Tersedia</p>
                <p className="text-2xl font-black mt-0.5">{rp(currentUser.plafonTersedia)}</p>
              </div>
              <span className="text-xs bg-white/20 px-3 py-1.5 rounded-xl font-bold">
                Skor: {currentUser.skor}
              </span>
            </div>

            {/* Pilihan Sektor Usaha */}
            <div>
              <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
                Pilih Sektor Usaha
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {sektorList.map(item => {
                  const Icon = item.icon
                  const isSelected = jenis === item.label
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setJenis(item.label)}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 text-center transition-all ${
                        isSelected
                          ? 'border-[#1A6B4A] bg-[#E6F4EE] font-bold text-[#1A6B4A]'
                          : 'border-[#E2EBE7] bg-white text-[#5F7A6E]'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nominal & Slider */}
            <Card className="p-4 space-y-3">
              <label className="text-sm text-[#2D4539] font-bold block">
                Nominal Pinjaman: <strong className="text-[#1A6B4A] text-xl ml-1">{rp(nominal)}</strong>
              </label>
              <input
                type="range"
                min={200000}
                max={currentUser.plafonTersedia}
                step={100000}
                value={nominal}
                onChange={e => setNominal(Number(e.target.value))}
                className="w-full accent-[#1A6B4A] h-2 bg-gray-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-[#5F7A6E]">
                <span>Min: Rp 200.000</span>
                <span>Maks: {shortRp(currentUser.plafonTersedia)}</span>
              </div>
            </Card>

            {/* Pilihan Tenor */}
            <div>
              <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">
                Jangka Waktu Cicilan (Tenor)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[3, 6, 12].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all ${
                      tenor === t
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#2D4539] border-[#D5E2DC]'
                    }`}
                  >
                    {t} Bulan
                  </button>
                ))}
              </div>
            </div>

            {/* Ringkasan Simulasi */}
            <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 space-y-2">
              <p className="text-sm font-bold text-[#7A5000]">Perhitungan Angsuran</p>
              <div className="flex justify-between text-sm text-[#7A5000]">
                <span>Cicilan per Bulan:</span>
                <strong className="text-base text-[#111F1A]">{rp(cicilanPerBulan)} / bln</strong>
              </div>
              <div className="flex justify-between text-sm text-[#7A5000]">
                <span>Total Pengembalian:</span>
                <strong>{rp(totalBayar)}</strong>
              </div>
              <div className="flex justify-between text-xs text-[#9A6A10] pt-1 border-t border-[#F5A623]/20">
                <span>Jasa Kas Gotong Royong:</span>
                <span>1.5% per bulan</span>
              </div>
            </div>

            {/* Tujuan Penggunaan */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Rincian Penggunaan Modal Usaha
              </label>
              <textarea
                rows={3}
                value={tujuan}
                onChange={e => setTujuan(e.target.value)}
                placeholder="Contoh: Pembelian bibit cabai, pupuk NPK 2 karung untuk lahan sawah blok timur..."
                className="w-full border border-[#D5E2DC] rounded-2xl p-4 text-base focus:outline-none focus:border-[#1A6B4A] bg-white leading-relaxed text-[#111F1A]"
                required
              />
            </div>

            {/* Penjamin Warga */}
            <div>
              <label className="text-sm font-bold text-[#111F1A] block mb-1 px-1">
                Warga Penjamin Gotong Royong
              </label>
              <select
                value={penjamin}
                onChange={e => setPenjamin(e.target.value)}
                className="w-full border border-[#D5E2DC] rounded-2xl px-4 py-3 text-base focus:outline-none focus:border-[#1A6B4A] bg-white text-[#111F1A]"
              >
                <option value="Siti Rahayu (RT 05)">Siti Rahayu (Bendahara RT 05)</option>
                <option value="Hendra Pratama (RT 05)">Hendra Pratama (Sekretaris RT 05)</option>
                <option value="Ahmad Fauzi (RT 05)">Ahmad Fauzi (Warga RT 05)</option>
              </select>
            </div>

            {/* Syarat & Ketentuan */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-2xl border border-[#E2EBE7]">
              <input
                id="syarat"
                type="checkbox"
                checked={setujuSyarat}
                onChange={e => setSetujuSyarat(e.target.checked)}
                className="w-5 h-5 mt-0.5 accent-[#1A6B4A] rounded"
              />
              <label htmlFor="syarat" className="text-xs text-[#456355] leading-relaxed cursor-pointer">
                Saya menyatakan bahwa data ini benar dan bersedia mengembalikan pinjaman secara disiplin demi keberlanjutan kas gotong royong warga.
              </label>
            </div>

            <Button
              full
              size="lg"
              variant="primary"
              disabled={!tujuan.trim() || !setujuSyarat}
              type="submit"
            >
              Kirim Pengajuan Pembiayaan
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
