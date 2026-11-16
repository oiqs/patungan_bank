import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'
import {
  CreditCard,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Heart,
  QrCode,
  Wallet
} from 'lucide-react'

const TABS = [
  { id: 'iuran',   label: 'Iuran Saya',   icon: CreditCard },
  { id: 'kas_rt',  label: 'Uang Kas RT',  icon: Users },
  { id: 'laporan', label: 'Laporan',      icon: FileText },
]

export default function Kas() {
  const navigate = useNavigate()
  const {
    tagihanIuran,
    kasTransaksi,
    kasSaldo,
    kasBulanIniMasuk,
    kasBulanIniKeluar,
    dompetSaldo,
    bayarIuranWajib,
    bayarIuranSukarela,
  } = useBankStore()

  const [activeTab, setActiveTab] = useState('iuran')

  // Sub-filter di dalam Iuran Saya
  const [iuranSubTab, setIuranSubTab] = useState('wajib') // 'wajib' | 'sukarela'

  // Sub-filter di dalam Kas RT
  const [kasFilter, setKasFilter] = useState('semua') // 'semua' | 'masuk' | 'keluar'

  // Modal bayar iuran
  const [modalBayar, setModalBayar] = useState(null)
  const [bayarNotif, setBayarNotif] = useState('')

  // Form iuran sukarela
  const [sukarelaNominal, setSukarelaNominal] = useState('')
  const [sukarelaTujuan, setSukarelaTujuan] = useState('Kas Umum RT')
  const [sukarelaCatatan, setSukarelaCatatan] = useState('')
  const [sukarelaSukses, setSukarelaSukses] = useState(false)

  const handleEksekusiBayarDompet = (tagihanId) => {
    const success = bayarIuranWajib(tagihanId, 'dompet')
    if (success) {
      setBayarNotif('Pembayaran berhasil dipotong dari saldo dompet!')
      setTimeout(() => {
        setModalBayar(null)
        setBayarNotif('')
      }, 1200)
    } else {
      setBayarNotif('Saldo dompet tidak cukup! Silakan isi saldo atau bayar via QRIS.')
    }
  }

  const handleKirimSukarela = (e) => {
    e.preventDefault()
    if (!sukarelaNominal || Number(sukarelaNominal) <= 0) return

    bayarIuranSukarela(Number(sukarelaNominal), sukarelaTujuan, sukarelaCatatan)
    setSukarelaSukses(true)
    setTimeout(() => {
      setSukarelaSukses(false)
      setSukarelaNominal('')
      setSukarelaCatatan('')
    }, 1500)
  }

  // Filter transaksi kas RT
  const filteredKas = kasTransaksi.filter(t => {
    if (kasFilter === 'masuk') return t.type === 'in'
    if (kasFilter === 'keluar') return t.type === 'out'
    return true
  })

  return (
    <div className="w-full pb-24">

      {/* ── HEADER HALAMAN ── */}
      <div className="bg-white border-b border-[#E2EBE7] pt-12 pb-3 px-5">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">
          Kas &amp; Iuran RT 05
        </h1>
        <p className="text-sm text-[#5F7A6E] mt-0.5">
          Pembukuan gotong royong warga Desa Tarunesha
        </p>
      </div>

      {/* ── 3 TAB UTAMA (MUDAH DILIHAT & TIDAK TERPOTONG) ── */}
      <div className="bg-white px-4 py-2.5 border-b border-[#E2EBE7]">
        <div className="grid grid-cols-3 gap-1.5 bg-[#F4F7F5] p-1 rounded-2xl">
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-[#1A6B4A] text-white shadow-xs'
                    : 'text-[#456355] hover:text-[#111F1A]'
                }`}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ════════════ TAB 1: IURAN SAYA ════════════ */}
        {activeTab === 'iuran' && (
          <div className="space-y-4">
            
            {/* Sub-toggle: Wajib vs Sukarela */}
            <div className="flex gap-2">
              <button
                onClick={() => setIuranSubTab('wajib')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${
                  iuranSubTab === 'wajib'
                    ? 'bg-[#E6F4EE] border-[#1A6B4A] text-[#1A6B4A]'
                    : 'bg-white border-[#E2EBE7] text-[#5F7A6E]'
                }`}
              >
                Iuran Wajib Bulanan
              </button>
              <button
                onClick={() => setIuranSubTab('sukarela')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all border ${
                  iuranSubTab === 'sukarela'
                    ? 'bg-[#E6F4EE] border-[#1A6B4A] text-[#1A6B4A]'
                    : 'bg-white border-[#E2EBE7] text-[#5F7A6E]'
                }`}
              >
                Iuran Sukarela &amp; Donasi
              </button>
            </div>

            {/* Sub Tab: Iuran Wajib */}
            {iuranSubTab === 'wajib' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-[#111F1A]">Daftar Tagihan Iuran</h3>
                  <span className="text-xs text-[#5F7A6E]">Rp 10.000 / bulan</span>
                </div>

                <div className="space-y-2.5">
                  {tagihanIuran.map((t) => {
                    const isLunas = t.status === 'lunas'
                    const isPending = t.status === 'pending'
                    const isTelat = t.telat && !isLunas && !isPending

                    return (
                      <Card key={t.id} className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {isLunas ? (
                                <span className="bg-[#E6F4EE] text-[#1A6B4A] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle2 size={13} /> Lunas
                                </span>
                              ) : isPending ? (
                                <span className="bg-[#FEF3DC] text-[#A05C00] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Clock size={13} /> Sedang Diverifikasi
                                </span>
                              ) : isTelat ? (
                                <span className="bg-[#FDEAEA] text-[#E84040] text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle size={13} /> Terlambat
                                </span>
                              ) : (
                                <span className="bg-[#FEF3DC] text-[#A05C00] text-xs font-bold px-2.5 py-0.5 rounded-full">
                                  Belum Dibayar
                                </span>
                              )}
                              <span className="text-xs text-[#5F7A6E]">
                                Tempo: {t.jatuhTempo}
                              </span>
                            </div>

                            <p className="text-base font-bold text-[#111F1A]">{t.judul}</p>
                            <p className="text-lg font-black text-[#1A6B4A] mt-0.5">{rp(t.nominal)}</p>
                          </div>

                          {!isLunas && !isPending && (
                            <Button
                              variant={isTelat ? 'danger' : 'primary'}
                              size="sm"
                              onClick={() => setModalBayar(t)}
                              className="self-center"
                            >
                              Bayar
                            </Button>
                          )}

                          {isLunas && (
                            <button
                              onClick={() => navigate('/kas/bukti', { state: { tagihan: t } })}
                              className="self-center text-xs text-[#1A6B4A] font-bold underline p-1"
                            >
                              Lihat Bukti
                            </button>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sub Tab: Iuran Sukarela */}
            {iuranSubTab === 'sukarela' && (
              <Card className="p-4 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#111F1A]">Kirim Iuran Sukarela / Infak</h3>
                  <p className="text-sm text-[#5F7A6E] mt-0.5">
                    Sumbangan sukarela warga untuk kas kebersihan, keamanan, atau sarana RT.
                  </p>
                </div>

                {sukarelaSukses && (
                  <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-sm font-bold p-3 rounded-xl text-center">
                    ✓ Terima kasih! Iuran sukarela berhasil dikirim.
                  </div>
                )}

                <form onSubmit={handleKirimSukarela} className="space-y-3.5">
                  <div>
                    <label className="text-sm font-bold text-[#2D4539] block mb-1">
                      Pilih Pos Kas
                    </label>
                    <select
                      value={sukarelaTujuan}
                      onChange={e => setSukarelaTujuan(e.target.value)}
                      className="w-full bg-[#F4F7F5] border border-[#D5E2DC] rounded-xl px-4 py-3 text-base text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                    >
                      <option value="Kas Umum RT">Kas Umum RT 05</option>
                      <option value="Dana Kebersihan & Sampah">Dana Kebersihan &amp; Sampah</option>
                      <option value="Pos Satpam & Keamanan">Pos Satpam &amp; Keamanan</option>
                      <option value="Perbaikan Jalan & Fasilitas">Perbaikan Sarana &amp; Fasilitas</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#2D4539] block mb-1">
                      Nominal Donasi (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 25000"
                      value={sukarelaNominal}
                      onChange={e => setSukarelaNominal(e.target.value)}
                      className="w-full bg-[#F4F7F5] border border-[#D5E2DC] rounded-xl px-4 py-3 text-base text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#2D4539] block mb-1">
                      Catatan / Doa (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Semoga bermanfaat untuk lingkungan"
                      value={sukarelaCatatan}
                      onChange={e => setSukarelaCatatan(e.target.value)}
                      className="w-full bg-[#F4F7F5] border border-[#D5E2DC] rounded-xl px-4 py-3 text-base text-[#111F1A] focus:outline-none focus:border-[#1A6B4A]"
                    />
                  </div>

                  <Button full size="md" variant="primary" type="submit">
                    Kirim Iuran Sukarela
                  </Button>
                </form>
              </Card>
            )}

          </div>
        )}

        {/* ════════════ TAB 2: UANG KAS RT (GABUNG MASUK & KELUAR DENGAN FILTER) ════════════ */}
        {activeTab === 'kas_rt' && (
          <div className="space-y-4">
            
            {/* Ringkasan Kas */}
            <Card className="p-4 bg-white border border-[#D5E2DC]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#5F7A6E]">Total Saldo Kas RT 05</span>
                <span className="text-xs font-bold text-[#1A6B4A] bg-[#E6F4EE] px-2.5 py-0.5 rounded-full">
                  Diawasi Warga
                </span>
              </div>
              <p className="text-2xl font-black text-[#111F1A]">{rp(kasSaldo)}</p>

              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#E2EBE7]">
                <div>
                  <p className="text-xs text-[#5F7A6E]">Total Pemasukan</p>
                  <p className="text-sm font-bold text-[#1A6B4A] mt-0.5">+{shortRp(kasBulanIniMasuk)}</p>
                </div>
                <div>
                  <p className="text-xs text-[#5F7A6E]">Total Pengeluaran</p>
                  <p className="text-sm font-bold text-[#E84040] mt-0.5">-{shortRp(kasBulanIniKeluar)}</p>
                </div>
              </div>
            </Card>

            {/* Filter Pills */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#111F1A]">Catatan Transaksi Kas</h3>
              <div className="flex gap-1 bg-[#F4F7F5] p-1 rounded-xl">
                {['semua', 'masuk', 'keluar'].map(f => (
                  <button
                    key={f}
                    onClick={() => setKasFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      kasFilter === f
                        ? 'bg-white text-[#1A6B4A] shadow-xs'
                        : 'text-[#5F7A6E]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* List Transaksi Kas RT */}
            <div className="space-y-2.5">
              {filteredKas.map((t) => (
                <Card key={t.id} className="p-3.5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    t.type === 'in' ? 'bg-[#E6F4EE] text-[#1A6B4A]' : 'bg-[#FDEAEA] text-[#E84040]'
                  }`}>
                    {t.type === 'in' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#111F1A] truncate">{t.keterangan}</p>
                    <p className="text-xs text-[#5F7A6E] mt-0.5">
                      {t.tanggal} · {t.kategori}
                    </p>
                  </div>
                  <p className={`text-base font-extrabold flex-shrink-0 ${
                    t.type === 'in' ? 'text-[#1A6B4A]' : 'text-[#E84040]'
                  }`}>
                    {t.type === 'in' ? '+' : '-'}{shortRp(Math.abs(t.nominal))}
                  </p>
                </Card>
              ))}
            </div>

          </div>
        )}

        {/* ════════════ TAB 3: LAPORAN ════════════ */}
        {activeTab === 'laporan' && (
          <div className="space-y-4">
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#111F1A]">Rekapitulasi Kas Bulan Ini</h3>
                <span className="text-xs bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2.5 py-0.5 rounded-full">
                  November 2026
                </span>
              </div>
              <p className="text-sm text-[#5F7A6E]">
                Laporan resmi transparansi keuangan gotong royong RT 05 Desa Tarunesha.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E2EBE7]">
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[#5F7A6E]">Saldo Kas Awal Bulan</span>
                  <span className="font-bold text-[#111F1A]">{rp(4490000)}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[#1A6B4A] font-semibold">+ Pemasukan Iuran &amp; Donasi</span>
                  <span className="font-bold text-[#1A6B4A]">+{rp(kasBulanIniMasuk)}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-[#E84040] font-semibold">- Pengeluaran Sarana &amp; Kebersihan</span>
                  <span className="font-bold text-[#E84040]">-{rp(kasBulanIniKeluar)}</span>
                </div>
                <div className="flex justify-between text-base font-black py-2 border-t border-[#E2EBE7]">
                  <span className="text-[#111F1A]">Saldo Kas Akhir Berjalan</span>
                  <span className="text-[#1A6B4A]">{rp(kasSaldo)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  full
                  size="md"
                  variant="primary"
                  onClick={() => navigate('/kas/laporan')}
                >
                  <FileText size={18} /> Buka Laporan Grafik Lengkap &amp; Unduh PDF
                </Button>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-[#111F1A]">Kepatuhan Iuran Warga</h3>
              <p className="text-xs text-[#5F7A6E]">
                Sebanyak 42 dari 48 kepala keluarga telah melunasi iuran wajib bulan ini (87.5% disiplin).
              </p>
              <div className="w-full h-3 bg-[#E2EBE7] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#1A6B4A] rounded-full" style={{ width: '87.5%' }} />
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* ── MODAL PILIH CARA BAYAR IURAN WAJIB ── */}
      {modalBayar && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E2EBE7] flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111F1A]">Pembayaran Iuran</h3>
              <button
                onClick={() => setModalBayar(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F7A6E] hover:bg-gray-100 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#F4F7F5] rounded-2xl p-4 border border-[#E2EBE7]">
              <p className="text-xs text-[#5F7A6E]">Tagihan</p>
              <p className="text-base font-bold text-[#111F1A] mt-0.5">{modalBayar.judul}</p>
              <p className="text-2xl font-black text-[#1A6B4A] mt-1">{rp(modalBayar.nominal)}</p>
            </div>

            {bayarNotif && (
              <div className="p-3 bg-[#FEF3DC] border border-[#F5A623] text-[#A05C00] text-xs font-bold rounded-xl text-center">
                {bayarNotif}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => handleEksekusiBayarDompet(modalBayar.id)}
                className="w-full p-3.5 rounded-2xl border border-[#1A6B4A] bg-[#E6F4EE] hover:bg-[#d8efe3] flex items-center justify-between text-left active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A6B4A] text-white flex items-center justify-center">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A6B4A]">Potong Saldo Dompet</p>
                    <p className="text-xs text-[#5F7A6E]">Saldo tersedia: {rp(dompetSaldo)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#1A6B4A]">Pilih →</span>
              </button>

              <button
                onClick={() => {
                  const item = modalBayar
                  setModalBayar(null)
                  navigate('/kas/qris', { state: { tagihan: item } })
                }}
                className="w-full p-3.5 rounded-2xl border border-[#D5E2DC] bg-white hover:bg-gray-50 flex items-center justify-between text-left active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF3DC] text-[#A05C00] flex items-center justify-center">
                    <QrCode size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111F1A]">Bayar via QRIS</p>
                    <p className="text-xs text-[#5F7A6E]">Gopay, OVO, Dana, BCA, Livin</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#111F1A]">Pilih →</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
