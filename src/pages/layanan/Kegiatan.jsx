import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp, shortRp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

const nominalCepat = [5000, 10000, 20000, 50000]

export default function Kegiatan() {
  const navigate = useNavigate()
  const {
    kegiatanList,
    sosialList,
    dompetSaldo,
    ikutPatunganKegiatan,
    donasiSosial
  } = useBankStore()

  const [tab, setTab] = useState('kegiatan')
  const [modalPatungan, setModalPatungan] = useState(null)
  const [nominalInput, setNominalInput] = useState(20000)
  const [pesanNotif, setPesanNotif] = useState('')

  const handleKirimPatungan = () => {
    if (nominalInput <= 0) return
    const success = ikutPatunganKegiatan(modalPatungan.id, nominalInput, 'dompet')
    if (success) {
      setPesanNotif(`Terima kasih! Patungan Rp ${nominalInput.toLocaleString('id-ID')} berhasil dipotong dari dompet.`)
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
      setPesanNotif(`Alhamdulillah! Donasi Rp ${nominalInput.toLocaleString('id-ID')} berhasil disalurkan.`)
      setTimeout(() => {
        setModalPatungan(null)
        setPesanNotif('')
      }, 1500)
    } else {
      setPesanNotif('Saldo dompet kurang! Silakan isi saldo dompet terlebih dahulu.')
    }
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Kegiatan & Dana Sosial</h1>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white px-5 flex gap-2 border-b border-[#E2EBE7]">
        {[
          { key: 'kegiatan', label: '🎉 Kegiatan Warga' },
          { key: 'sosial', label: '❤️ Dana Sosial' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-3 text-xs font-bold border-b-2 transition-all active:scale-95 flex-1 text-center ${
              tab === t.key
                ? 'border-[#1A6B4A] text-[#1A6B4A]'
                : 'border-transparent text-[#8FA89E]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {/* TAB KEGIATAN */}
        {tab === 'kegiatan' && (
          <>
            <div className="bg-[#E6F4EE] rounded-2xl p-4 text-xs text-[#1A6B4A] leading-relaxed">
              <strong>Transparansi Anggaran Kegiatan:</strong> Seluruh dana patungan kegiatan tercatat real-time lengkap dengan Rencana Anggaran Biaya (RAB) dan realisasi pengeluaran fisik.
            </div>

            {kegiatanList.map((k) => {
              const pct = Math.min(100, Math.round((k.terkumpul / k.target) * 100))
              return (
                <Card key={k.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#E6F4EE] flex items-center justify-center text-2xl flex-shrink-0">
                      {k.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111F1A] text-sm">{k.nama}</p>
                      <p className="text-xs text-[#8FA89E] mt-0.5">Panitia: {k.panitia}</p>
                      <p className="text-[11px] text-[#4A6358] mt-0.5">RAB Target: <strong>{rp(k.target)}</strong></p>
                    </div>
                    <span className="text-xs font-extrabold text-[#1A6B4A] bg-[#E6F4EE] px-2.5 py-1 rounded-full">
                      {pct}%
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-[#4A6358] mb-1.5 font-medium">
                      <span>Terkumpul: <strong>{rp(k.terkumpul)}</strong></span>
                      <span>Sisa: {shortRp(Math.max(0, k.target - k.terkumpul))}</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E2EBE7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A6B4A] to-[#4DB87F] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      full
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setModalPatungan({ ...k, type: 'kegiatan' })
                        setNominalInput(20000)
                      }}
                    >
                      🤝 Ikut Patungan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/kas')}
                    >
                      Nota RAB
                    </Button>
                  </div>
                </Card>
              )
            })}
          </>
        )}

        {/* TAB DANA SOSIAL */}
        {tab === 'sosial' && (
          <>
            <div className="bg-[#FAEAEA] rounded-2xl p-4 text-xs text-[#E84040] leading-relaxed">
              <strong>Solidaritas & Penjengukan Warga:</strong> Bantuan santunan cepat untuk warga Tarunesha yang sakit, melahirkan, atau mengalami duka cita keluarga.
            </div>

            {sosialList.map((d) => {
              const pct = Math.min(100, Math.round((d.terkumpul / d.target) * 100))
              return (
                <Card key={d.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {d.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111F1A] text-sm">{d.nama}</p>
                      <p className="text-xs text-[#8FA89E] mt-0.5">Penerima: {d.penerima}</p>
                      <p className="text-[11px] text-[#E84040] mt-1 bg-red-50 p-1.5 rounded-lg">
                        <strong>Keterangan:</strong> {d.alasan}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#4A6358] mb-1.5">
                      <span>Terkumpul: <strong>{rp(d.terkumpul)}</strong></span>
                      <span>Target: {rp(d.target)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E2EBE7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E84040] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    full
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setModalPatungan({ ...d, type: 'sosial' })
                      setNominalInput(10000)
                    }}
                  >
                    ❤️ Kirim Donasi Santunan
                  </Button>
                </Card>
              )
            })}
          </>
        )}
      </div>

      {/* MODAL NOMINAL PATUNGAN / DONASI */}
      {modalPatungan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111F1A]">
                {modalPatungan.type === 'kegiatan' ? 'Ikut Patungan' : 'Donasi Santunan'}
              </h3>
              <button onClick={() => setModalPatungan(null)} className="text-[#8FA89E] text-lg font-bold">✕</button>
            </div>

            <p className="text-xs text-[#4A6358] font-semibold">{modalPatungan.nama}</p>

            {pesanNotif && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center ${
                pesanNotif.includes('berhasil') || pesanNotif.includes('Terima') ? 'bg-green-50 text-[#1A6B4A]' : 'bg-red-50 text-[#E84040]'
              }`}>
                {pesanNotif}
              </div>
            )}

            <div>
              <p className="text-xs text-[#8FA89E] mb-2">Pilih nominal donasi:</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {nominalCepat.map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNominalInput(n)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      nominalInput === n
                        ? 'bg-[#1A6B4A] text-white border-[#1A6B4A]'
                        : 'bg-white text-[#4A6358] border-[#E2EBE7]'
                    }`}
                  >
                    {shortRp(n)}
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Nominal lainnya (Rp)"
                value={nominalInput}
                onChange={e => setNominalInput(Number(e.target.value))}
                className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-xs bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A] font-bold"
              />
            </div>

            <p className="text-[10px] text-[#8FA89E]">
              Akan dipotong dari Saldo Dompet Anda: <strong>{rp(dompetSaldo)}</strong>
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                full
                onClick={() => setModalPatungan(null)}
              >
                Batal
              </Button>
              <Button
                variant={modalPatungan.type === 'kegiatan' ? 'primary' : 'danger'}
                size="sm"
                full
                onClick={() => {
                  if (modalPatungan.type === 'kegiatan') {
                    handleKirimPatungan()
                  } else {
                    handleKirimDonasi(modalPatungan.id)
                  }
                }}
              >
                Konfirmasi Bayar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
