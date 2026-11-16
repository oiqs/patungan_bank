import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, ShieldCheck, KeyRound, Fingerprint, Smartphone, CheckCircle2 } from 'lucide-react'

export default function Keamanan() {
  const navigate = useNavigate()
  const { currentUser, toggleFingerprint, setPin } = useBankStore()

  const [modalGantiPin, setModalGantiPin] = useState(false)
  const [pinLama, setPinLama] = useState('')
  const [pinBaru, setPinBaru] = useState('')
  const [konfirmasiPin, setKonfirmasiPin] = useState('')
  const [pesanError, setPesanError] = useState('')
  const [suksesMsg, setSuksesMsg] = useState('')

  const handleSimpanPin = (e) => {
    e.preventDefault()
    setPesanError('')

    if (pinLama !== currentUser.pin) {
      setPesanError('PIN saat ini tidak sesuai!')
      return
    }
    if (pinBaru.length !== 6 || !/^\d+$/.test(pinBaru)) {
      setPesanError('PIN baru harus 6 digit angka!')
      return
    }
    if (pinBaru !== konfirmasiPin) {
      setPesanError('Konfirmasi PIN baru tidak cocok!')
      return
    }

    setPin(pinBaru)
    setSuksesMsg('PIN rahasia berhasil diperbarui!')
    setTimeout(() => {
      setModalGantiPin(false)
      setPinLama('')
      setPinBaru('')
      setKonfirmasiPin('')
      setSuksesMsg('')
    }, 1500)
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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Keamanan &amp; Privasi</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Banner Status Solid */}
        <div className="bg-[#1A6B4A] rounded-2xl p-4 text-white flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <ShieldCheck size={26} />
          </div>
          <div>
            <p className="font-bold text-base">Akun Terlindungi</p>
            <p className="text-white/90 text-xs mt-0.5">PIN transaksi &amp; otentikasi biometrik aktif</p>
          </div>
        </div>

        {/* Pengaturan PIN & Biometrik */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">Otentikasi Akun</h3>
          <Card className="divide-y divide-[#E2EBE7]">
            {/* Ganti PIN */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] text-[#1A6B4A] flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111F1A]">PIN 6 Digit</p>
                  <p className="text-xs text-[#5F7A6E]">Digunakan untuk konfirmasi transaksi</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setModalGantiPin(true)}>
                Ubah PIN
              </Button>
            </div>

            {/* Fingerprint */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8EEF9] text-[#2B5EA7] flex items-center justify-center">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111F1A]">Sidik Jari / Biometrik</p>
                  <p className="text-xs text-[#5F7A6E]">Login cepat &amp; otorisasi pembayaran</p>
                </div>
              </div>
              <button
                onClick={toggleFingerprint}
                className={`w-12 h-6 rounded-full transition-colors ${
                  currentUser.fingerprintAktif ? 'bg-[#1A6B4A]' : 'bg-[#C0CCC8]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform ${
                    currentUser.fingerprintAktif ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Perangkat Terdaftar */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">Perangkat Terhubung</h3>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-[#1A6B4A]">
                <Smartphone size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#111F1A] truncate">{currentUser.perangkat}</p>
                  <span className="text-xs bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2 py-0.5 rounded-full">Aktif</span>
                </div>
                <p className="text-xs text-[#5F7A6E] mt-0.5">Sesi aktif di Desa Tarunesha RT 05</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* MODAL GANTI PIN */}
      {modalGantiPin && (
        <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Ubah PIN Rahasia</h3>
              <button onClick={() => setModalGantiPin(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#5F7A6E] font-bold">✕</button>
            </div>

            {pesanError && (
              <div className="bg-[#FDEAEA] border border-[#E84040] text-[#E84040] text-xs font-bold p-3 rounded-xl">
                {pesanError}
              </div>
            )}
            {suksesMsg && (
              <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-xs font-bold p-3 rounded-xl">
                {suksesMsg}
              </div>
            )}

            <form onSubmit={handleSimpanPin} className="space-y-3">
              <div>
                <label className="text-xs text-[#2D4539] font-bold block mb-1">PIN Saat Ini (6 Digit)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinLama}
                  onChange={e => setPinLama(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#2D4539] font-bold block mb-1">PIN Baru (6 Digit Angka)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinBaru}
                  onChange={e => setPinBaru(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#2D4539] font-bold block mb-1">Ulangi PIN Baru</label>
                <input
                  type="password"
                  maxLength={6}
                  value={konfirmasiPin}
                  onChange={e => setKonfirmasiPin(e.target.value)}
                  className="w-full border border-[#D5E2DC] rounded-xl px-4 py-3 text-base font-bold bg-[#F4F7F5] focus:outline-none focus:border-[#1A6B4A]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" full onClick={() => setModalGantiPin(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="primary" full>
                  Simpan PIN
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
