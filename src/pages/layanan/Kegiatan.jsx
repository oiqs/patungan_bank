import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Calendar, Heart, CheckCircle2, Users } from 'lucide-react'

const nominalCepat = [10000, 20000, 50000, 100000]

export default function Kegiatan() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'sosial' ? 'sosial' : 'kegiatan'

  const {
    kegiatanList,
    sosialList,
    dompetSaldo,
    ikutPatunganKegiatan,
    donasiSosial
  } = useBankStore()

  const [tab, setTab] = useState(initialTab)
  const [modalPatungan, setModalPatungan] = useState(null)
  const [nominalInput, setNominalInput] = useState(20000)
  const [pesanNotif, setPesanNotif] = useState('')

  const handleKirimPatungan = () => {
    if (nominalInput <= 0) return
    const success = ikutPatunganKegiatan(modalPatungan.id, nominalInput, 'dompet')
    if (success) {
      setPesanNotif(`Terima kasih! Patungan ${rp(nominalInput)} berhasil dipotong dari dompet.`)
      setTimeout(() => {
        setModalPatungan(null)
        setPesanNotif('')
      }, 1500)
    } else {
      setPesanNotif('Saldo dompet kurang! Silakan isi saldo dompet terlebih dahulu.')
    }
  }

  const handleKirimDonasi = (sosialId) => {
    const success = donasiSosial(sosialId, nominalInput, 'dompet')
    if (success) {
      setPesanNotif(`Alhamdulillah! Donasi ${rp(nominalInput)} berhasil disalurkan.`)
      setTimeout(() => {
        setModalPatungan(null)
        setPesanNotif('')
      }, 1500)
    } else {
      setPesanNotif('Saldo dompet kurang! Silakan isi saldo dompet terlebih dahulu.')
    }
  }

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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">
          {tab === 'kegiatan' ? 'Kegiatan & Gotong Royong' : 'Dana Sosial & Santunan'}
        </h1>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white px-4 flex gap-2 border-b border-[#E2EBE7]">
        {[
          { key: 'kegiatan', label: 'Kegiatan Warga', icon: Calendar },
          { key: 'sosial', label: 'Dana Sosial & Duka', icon: Heart },
        ].map(t => {
          const Icon = t.icon
          const isActive = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`py-3 text-sm font-bold border-b-2 transition-all flex-1 text-center flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'border-[#1A6B4A] text-[#1A6B4A]'
                  : 'border-transparent text-[#5F7A6E] hover:text-[#111F1A]'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* TAB KEGIATAN */}
        {tab === 'kegiatan' && (
          <div className="space-y-3.5">
            <div className="bg-[#E6F4EE] border border-[#1A6B4A]/20 rounded-2xl p-4 text-sm text-[#1A6B4A] leading-relaxed">
              <strong>Transparansi Anggaran Kegiatan:</strong> Seluruh dana patungan kegiatan tercatat real-time lengkap dengan Rencana Anggaran Biaya (RAB) dan realisasi pengeluaran fisik.
            </div>

            {kegiatanList.map((k) => {
              const pct = Math.min(100, Math.round((k.terkumpul / k.target) * 100))
              return (
                <Card key={k.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#E6F4EE] flex items-center justify-center text-2xl flex-shrink-0">
                      {k.emoji || '🎉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111F1A] text-base">{k.nama}</p>
                      <p className="text-xs text-[#5F7A6E] mt-0.5">Panitia: {k.panitia}</p>
                      <p className="text-sm text-[#2D4539] mt-0.5">RAB Target: <strong>{rp(k.target)}</strong></p>
                    </div>
                    <span className="text-xs font-black text-[#1A6B4A] bg-[#E6F4EE] px-2.5 py-1 rounded-full">
                      {pct}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-[#5F7A6E] mb-1.5 font-medium">
                      <span>Terkumpul: <strong className="text-[#1A6B4A]">{rp(k.terkumpul)}</strong></span>
                      <span>Sisa: {shortRp(Math.max(0, k.target - k.terkumpul))}</span>
                    </div>
                    <div className="w-full h-3 bg-[#E2EBE7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A6B4A] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      full
                      size="md"
                      variant="primary"
                      onClick={() => {
                        setNominalInput(20000)
                        setModalPatungan({ ...k, type: 'kegiatan' })
                      }}
                    >
                      Ikut Patungan ({shortRp(20000)})
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* TAB SOSIAL */}
        {tab === 'sosial' && (
          <div className="space-y-3.5">
            <div className="bg-[#FAEAEA] border border-[#E84040]/20 rounded-2xl p-4 text-sm text-[#C93535] leading-relaxed">
              <strong>Dana Santunan Sosial:</strong> Disalurkan langsung kepada keluarga warga yang mengalami musibah sakit, kecelakaan, atau duka cita.
            </div>

            {sosialList.map((d) => (
              <Card key={d.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAEAEA] flex items-center justify-center text-2xl flex-shrink-0">
                    {d.emoji || '❤️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#E84040] bg-[#FDEAEA] px-2 py-0.5 rounded-full inline-block mb-1">
                      {d.kategori}
                    </span>
                    <p className="font-bold text-[#111F1A] text-base">{d.nama}</p>
                    <p className="text-sm text-[#5F7A6E] mt-0.5">{d.deskripsi}</p>
                  </div>
                </div>

                <div className="bg-[#F4F7F5] rounded-xl p-3 flex justify-between items-center text-sm">
                  <span className="text-[#5F7A6E]">Terkumpul Saat Ini:</span>
                  <span className="font-black text-[#1A6B4A]">{rp(d.terkumpul)}</span>
                </div>

                <Button
                  full
                  size="md"
                  variant="danger"
                  onClick={() => {
                    setNominalInput(20000)
                    setModalPatungan({ ...d, type: 'sosial' })
                  }}
                >
                  Kirim Santunan Donasi
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* MODAL INPUT PATUNGAN / DONASI */}
      {modalPatungan && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">
                {modalPatungan.type === 'kegiatan' ? 'Ikut Patungan Kegiatan' : 'Kirim Donasi Santunan'}
              </h3>
              <button onClick={() => setModalPatungan(null)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F7A6E] font-bold">✕</button>
            </div>

            <div className="bg-[#F4F7F5] rounded-2xl p-3 border border-[#E2EBE7]">
              <p className="text-xs text-[#5F7A6E]">Program</p>
              <p className="text-sm font-bold text-[#111F1A] mt-0.5">{modalPatungan.nama}</p>
            </div>

            {pesanNotif && (
              <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-sm font-bold p-3 rounded-xl text-center">
                {pesanNotif}
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-[#2D4539] block mb-1.5">
                Nominal Patungan (Rp)
              </label>
              <input
                type="number"
                value={nominalInput}
                onChange={e => setNominalInput(Math.max(0, +e.target.value))}
                className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-lg font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] text-[#111F1A]"
              />
            </div>

            {/* Quick chips */}
            <div className="grid grid-cols-4 gap-2">
              {nominalCepat.map((n) => (
                <button
                  key={n}
                  onClick={() => setNominalInput(n)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    nominalInput === n
                      ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                      : 'bg-white border-[#D5E2DC] text-[#2D4539]'
                  }`}
                >
                  {shortRp(n)}
                </button>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setModalPatungan(null)}
                className="flex-1 py-3 border border-[#D5E2DC] rounded-xl text-sm font-bold text-[#5F7A6E] active:scale-95"
              >
                Batal
              </button>
              <Button
                variant={modalPatungan.type === 'kegiatan' ? 'primary' : 'danger'}
                size="md"
                className="flex-1"
                onClick={() => {
                  if (modalPatungan.type === 'kegiatan') {
                    handleKirimPatungan()
                  } else {
                    handleKirimDonasi(modalPatungan.id)
                  }
                }}
              >
                Kirim ({shortRp(nominalInput)})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
