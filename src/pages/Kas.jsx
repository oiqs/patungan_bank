import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Clock,
  AlertCircle,
  Gift,
  HeartHandshake,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  X,
  Wallet,
  QrCode,
  ArrowRight,
} from 'lucide-react'
import { rp, shortRp } from '../lib/format'
import Card from '../components/Card'
import Button from '../components/Button'
import { useBankStore } from '../store/useBankStore'

const tabs = ['Iuran Wajib', 'Iuran Sukarela', 'Kas Masuk', 'Kas Keluar', 'Laporan']

const StatusPill = ({ status }) => {
  if (status === 'lunas') {
    return (
      <span className="bg-[#E6F4EE] text-[#1A6B4A] text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
        <Check className="w-3 h-3 stroke-[2.5]" /> Lunas
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="bg-[#FEF3DC] text-[#A05C00] text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
        <Clock className="w-3 h-3 stroke-[2.2]" /> Proses
      </span>
    )
  }
  return (
    <span className="bg-[#FDEAEA] text-[#E84040] text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap flex items-center gap-1">
      <AlertCircle className="w-3 h-3 stroke-[2.2]" /> {status === 'telat' ? 'Telat' : 'Belum'}
    </span>
  )
}

export default function Kas() {
  const navigate = useNavigate()
  const {
    tagihanIuran,
    kasTransaksi,
    dompetSaldo,
    bayarIuranWajib,
    bayarIuranSukarela,
  } = useBankStore()

  const [activeTab, setActiveTab] = useState(0)

  // State untuk modal bayar iuran wajib
  const [modalBayar, setModalBayar] = useState(null)
  const [bayarNotif, setBayarNotif] = useState('')

  // State untuk form iuran sukarela
  const [sukarelaNominal, setSukarelaNominal] = useState('')
  const [sukarelaTujuan, setSukarelaTujuan] = useState('Kas Umum')
  const [sukarelaCatatan, setSukarelaCatatan] = useState('')
  const [sukarelaSukses, setSukarelaSukses] = useState(false)

  const lunasCount = tagihanIuran.filter(d => d.status === 'lunas').length
  const belumCount = tagihanIuran.filter(d => d.status !== 'lunas').length

  const handleEksekusiBayarDompet = (tagihanId) => {
    const success = bayarIuranWajib(tagihanId, 'dompet')
    if (success) {
      setBayarNotif('Pembayaran berhasil dipotong dari dompet!')
      setTimeout(() => {
        setModalBayar(null)
        setBayarNotif('')
      }, 1200)
    } else {
      setBayarNotif('Saldo dompet tidak cukup! Silakan top-up atau pilih QRIS.')
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

  return (
    <div className="w-full">

      {/* ── HEADER ── */}
      <div className="bg-[#F4F7F5] pt-12 pb-2 px-5">
        <h1 className="text-xl font-extrabold text-[#111F1A] tracking-tight">Kas Tarunesha</h1>
        <p className="text-xs text-[#8FA89E] mt-0.5">Iuran anggota & pembukuan kas transparan</p>
      </div>

      {/* ── TAB SCROLL ── */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full transition-all flex-shrink-0 ${
              activeTab === i
                ? 'bg-[#1A6B4A] text-white shadow-[0_4px_12px_rgba(26,107,74,0.3)]'
                : 'bg-white border border-[#E2EBE7] text-[#4A6358]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4 pb-20">

        {/* ════ TAB 0: IURAN WAJIB ════ */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {/* Summary pills */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3">
                <p className="text-[10px] text-[#8FA89E] font-semibold uppercase tracking-wider mb-1">Lunas</p>
                <p className="text-base font-extrabold text-[#1A6B4A]">{lunasCount} bln</p>
              </Card>
              <Card className="p-3">
                <p className="text-[10px] text-[#8FA89E] font-semibold uppercase tracking-wider mb-1">Belum</p>
                <p className="text-base font-extrabold text-[#E84040]">{belumCount} bln</p>
              </Card>
              <Card className="p-3">
                <p className="text-[10px] text-[#8FA89E] font-semibold uppercase tracking-wider mb-1">Terkumpul</p>
                <p className="text-base font-extrabold text-[#111F1A]">{shortRp(lunasCount * 10000)}</p>
              </Card>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {tagihanIuran.map((item) => (
                <Card key={item.id} className="p-4 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                    item.telat ? 'bg-[#FDEAEA]' : 'bg-[#F4F7F5]'
                  }`}>
                    <span className={`text-[11px] font-bold uppercase ${item.telat ? 'text-[#E84040]' : 'text-[#4A6358]'}`}>
                      {item.bln}
                    </span>
                    <span className="text-[9px] text-[#8FA89E]">{item.thn}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111F1A] truncate">{item.judul}</p>
                    <p className="text-xs text-[#8FA89E] mt-0.5">
                      {rp(item.nominal)} · {item.status === 'lunas' ? 'Lunas' : `Jatuh tempo: ${item.jatuhTempo}`}
                    </p>
                  </div>

                  {item.status === 'lunas' || item.status === 'pending' ? (
                    <StatusPill status={item.status} />
                  ) : (
                    <Button
                      variant={item.telat ? 'danger' : 'primary'}
                      size="sm"
                      onClick={() => setModalBayar(item)}
                    >
                      Bayar
                    </Button>
                  )}
                </Card>
              ))}
            </div>

            {/* Shortcut ke Iuran Sukarela */}
            <Card
              onClick={() => setActiveTab(1)}
              className="p-4 flex items-center gap-4 cursor-pointer hover:bg-[#F9FAF9] transition-all"
            >
              <div className="w-11 h-11 bg-[#FEF3DC] text-[#B7791F] rounded-xl flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#111F1A]">Iuran Sukarela</p>
                <p className="text-xs text-[#8FA89E]">Sumbangan sukarela nominal bebas</p>
              </div>
              <span className="text-[#1A6B4A] font-bold text-sm flex items-center gap-1">
                Buka <ArrowRight className="w-4 h-4 stroke-[2]" />
              </span>
            </Card>
          </div>
        )}

        {/* ════ TAB 1: IURAN SUKARELA ════ */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 text-xs text-[#7A5000] leading-relaxed flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 text-[#7A5000] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Gift className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <strong className="block font-bold text-sm mb-1">Sumbangan Bebas & Transparan</strong>
                Iuran tidak wajib dapat disalurkan secara sukarela untuk penambahan kas umum, konsumsi kegiatan gotong royong, atau dana sosial warga yang tertimpa musibah.
              </div>
            </div>

            {sukarelaSukses ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-[#E2EBE7]">
                <div className="w-12 h-12 rounded-full bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center mx-auto mb-2">
                  <HeartHandshake className="w-6 h-6 stroke-[2]" />
                </div>
                <p className="font-bold text-[#111F1A] mt-2">Terima kasih atas kontribusi Anda!</p>
                <p className="text-xs text-[#4A6358] mt-1">Sumbangan telah dicatat secara resmi ke buku kas.</p>
              </div>
            ) : (
              <form onSubmit={handleKirimSukarela} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1.5 px-1">
                    Pilihan Alokasi Tujuan
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Kas Umum', 'Kegiatan', 'Dana Sosial'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSukarelaTujuan(t)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          sukarelaTujuan === t
                            ? 'border-[#1A6B4A] bg-[#E8F4EE] text-[#1A6B4A]'
                            : 'border-[#E2EBE7] bg-white text-[#4A6358]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1.5 px-1">
                    Nominal Sumbangan (Bebas)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[20000, 50000, 100000].map(nom => (
                      <button
                        key={nom}
                        type="button"
                        onClick={() => setSukarelaNominal(nom.toString())}
                        className={`py-2 rounded-xl border text-xs font-semibold ${
                          sukarelaNominal === nom.toString()
                            ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                            : 'bg-white text-[#111F1A] border-[#E2EBE7]'
                        }`}
                      >
                        {shortRp(nom)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Atau masukkan nominal bebas (Rp)"
                    value={sukarelaNominal}
                    onChange={e => setSukarelaNominal(e.target.value)}
                    className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3 text-sm font-bold bg-white focus:outline-none focus:border-[#1A6B4A]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest block mb-1 px-1">
                    Catatan / Pesan Singkat (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Titipan untuk konsumsi kerja bakti"
                    value={sukarelaCatatan}
                    onChange={e => setSukarelaCatatan(e.target.value)}
                    className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#1A6B4A]"
                  />
                </div>

                <Button type="submit" variant="primary" full size="lg" className="flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                  Salurkan Sumbangan Kas
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ════ TAB 2: KAS MASUK ════ */}
        {activeTab === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">Pemasukan Kas Tercatat</p>
              <span className="text-xs text-[#1A6B4A] font-bold">Real-time</span>
            </div>
            <Card>
              {kasTransaksi
                .filter(k => k.jenis === 'masuk')
                .map((item, i, arr) => (
                  <div
                    key={item.id || i}
                    className={`p-4 flex items-center gap-3 ${i < arr.length - 1 ? 'border-b border-[#F4F7F5]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A]">
                      <ArrowDownLeft className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111F1A] truncate">{item.judul}</p>
                      <p className="text-xs text-[#8FA89E]">{item.tgl} · Oleh: {item.oleh}</p>
                    </div>
                    <p className="text-sm font-bold text-[#1A6B4A]">
                      +{rp(item.nominal)}
                    </p>
                  </div>
                ))}
            </Card>
          </div>
        )}

        {/* ════ TAB 3: KAS KELUAR ════ */}
        {activeTab === 3 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">Pengeluaran Wajib Nota</p>
              <span className="text-xs text-[#E84040] font-bold">Diawasi Bersama</span>
            </div>
            <Card>
              {kasTransaksi
                .filter(k => k.jenis === 'keluar')
                .map((item, i, arr) => (
                  <div
                    key={item.id || i}
                    className={`p-4 flex items-center gap-3 ${i < arr.length - 1 ? 'border-b border-[#F4F7F5]' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#FAEAEA] flex items-center justify-center text-[#E84040]">
                      <ArrowUpRight className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111F1A] truncate">{item.judul}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#8FA89E]">{item.tgl}</span>
                        {item.nota && (
                          <span className="text-[10px] bg-[#E2EBE7] text-[#4A6358] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                            <FileText className="w-3 h-3 stroke-[2]" /> {item.nota}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#E84040]">
                      -{rp(item.nominal)}
                    </p>
                  </div>
                ))}
            </Card>
          </div>
        )}

        {/* ════ TAB 4: LAPORAN ════ */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-[#1A6B4A] to-[#2D8B63] rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70 font-semibold uppercase tracking-wider">Laporan Keuangan Resmi</p>
                <h3 className="text-lg font-extrabold mt-1">Buku Kas Periode 2026</h3>
                <p className="text-xs text-white/80 mt-1">Dapat diunduh dalam format PDF resmi RT 05</p>
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => navigate('/kas/laporan')}
              >
                Buka Grafik & Unduh PDF
              </Button>
            </div>

            <Card className="p-4 space-y-3">
              <p className="text-sm font-bold text-[#111F1A]">Ringkasan Arus Kas Bulan Berjalan</p>
              <div className="flex justify-between text-xs text-[#4A6358] py-1 border-b border-[#E2EBE7]">
                <span>Total Pemasukan:</span>
                <strong className="text-[#1A6B4A]">+{rp(650000)}</strong>
              </div>
              <div className="flex justify-between text-xs text-[#4A6358] py-1 border-b border-[#E2EBE7]">
                <span>Total Pengeluaran:</span>
                <strong className="text-[#E84040]">-{rp(320000)}</strong>
              </div>
              <div className="flex justify-between text-xs text-[#111F1A] font-bold py-1">
                <span>Surplus Kas Bersih:</span>
                <strong className="text-[#1A6B4A] font-extrabold">{rp(330000)}</strong>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* ── MODAL PILIHAN PEMBAYARAN IURAN WAJIB ── */}
      {modalBayar && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">{modalBayar.judul}</h3>
              <button
                onClick={() => setModalBayar(null)}
                className="w-8 h-8 rounded-full bg-[#F4F7F5] hover:bg-[#E2EBE7] flex items-center justify-center text-[#8FA89E] hover:text-[#111F1A] transition-colors"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            <div className="bg-[#F4F7F5] rounded-2xl p-4 text-center">
              <p className="text-xs text-[#8FA89E]">Total Tagihan</p>
              <p className="text-2xl font-extrabold text-[#111F1A] mt-0.5">{rp(modalBayar.nominal)}</p>
              <p className="text-[11px] text-[#4A6358] mt-1">Jatuh tempo: {modalBayar.jatuhTempo}</p>
            </div>

            {bayarNotif && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${
                bayarNotif.includes('berhasil') ? 'bg-green-50 text-[#1A6B4A]' : 'bg-red-50 text-[#E84040]'
              }`}>
                {bayarNotif}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest px-1">Pilih Cara Bayar</p>

              {/* Bayar via Dompet */}
              <button
                type="button"
                onClick={() => handleEksekusiBayarDompet(modalBayar.id)}
                className="w-full p-3.5 bg-white border border-[#E2EBE7] hover:border-[#1A6B4A] rounded-2xl flex items-center justify-between text-left active:scale-98 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A]">
                    <Wallet className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111F1A]">Potong Saldo Dompet</p>
                    <p className="text-[10px] text-[#8FA89E]">Saldo Anda: {rp(dompetSaldo)}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1A6B4A]">Bayar Langsung</span>
              </button>

              {/* Bayar via QRIS */}
              <button
                type="button"
                onClick={() => {
                  setModalBayar(null)
                  navigate('/kas/qris')
                }}
                className="w-full p-3.5 bg-white border border-[#E2EBE7] hover:border-[#1A6B4A] rounded-2xl flex items-center justify-between text-left active:scale-98 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EBF7F1] flex items-center justify-center text-[#1A6B4A]">
                    <QrCode className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111F1A]">Scan QRIS Dinamis</p>
                    <p className="text-[10px] text-[#8FA89E]">BCA, GoPay, OVO, ShopeePay, dll</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#1A6B4A]">Tampilkan QR</span>
              </button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setModalBayar(null)}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
