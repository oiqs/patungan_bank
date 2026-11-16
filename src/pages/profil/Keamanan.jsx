import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { useBankStore } from '../../store/useBankStore'

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
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Keamanan & Privasi</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Banner Status */}
        <div className="bg-gradient-to-r from-[#1A6B4A] to-[#2D8B63] rounded-2xl p-4 text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <div>
            <p className="font-bold text-sm">Akun Terlindungi</p>
            <p className="text-white/80 text-xs mt-0.5">PIN transaksi & otentikasi biometrik aktif</p>
          </div>
        </div>

        {/* Pengaturan PIN & Biometrik */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">Otentikasi</p>
          <Card className="divide-y divide-[#E2EBE7]">
            {/* Ganti PIN */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔢</span>
                <div>
                  <p className="text-sm font-semibold text-[#111F1A]">PIN 6 Digit</p>
                  <p className="text-xs text-[#8FA89E]">Digunakan untuk konfirmasi transaksi</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => setModalGantiPin(true)}>
                Ubah PIN
              </Button>
            </div>

            {/* Fingerprint */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">👆</span>
                <div>
                  <p className="text-sm font-semibold text-[#111F1A]">Fingerprint / Biometrik</p>
                  <p className="text-xs text-[#8FA89E]">Login cepat & otorisasi pembayaran</p>
                </div>
              </div>
              <button
                onClick={toggleFingerprint}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  currentUser.fingerprintAktif ? 'bg-[#1A6B4A]' : 'bg-[#C0CCC8]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    currentUser.fingerprintAktif ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </Card>
        </div>

        {/* Perangkat Terdaftar */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">Perangkat Terhubung</p>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-xl text-[#1A6B4A]">
                📱
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#111F1A] truncate">{currentUser.perangkat}</p>
                  <span className="text-[10px] bg-[#E6F4EE] text-[#1A6B4A] font-bold px-2 py-0.5 rounded-full">Aktif</span>
                </div>
                <p className="text-xs text-[#8FA89E] mt-0.5">Sesi aktif · Login terakhir 16 Nov 2026, 12:05</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edukasi Keamanan */}
        <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-xl flex-shrink-0">💡</span>
          <div className="text-xs text-[#7A5000] leading-relaxed">
            <strong className="block mb-0.5">Tips Keamanan Tarunesha:</strong>
            Jangan pernah membagikan 6 digit PIN Anda kepada siapa pun, termasuk pengurus RT atau bendahara. Setiap transaksi keuangan memiliki bukti referensi digital otomatis.
          </div>
        </div>
      </div>

      {/* MODAL GANTI PIN */}
      {modalGantiPin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#111F1A]">Ubah PIN Transaksi</h3>
              <button onClick={() => setModalGantiPin(false)} className="text-[#8FA89E] text-lg font-bold">✕</button>
            </div>

            {pesanError && (
              <div className="bg-red-50 text-[#E84040] text-xs p-3 rounded-xl border border-red-200">
                {pesanError}
              </div>
            )}

            {suksesMsg && (
              <div className="bg-green-50 text-[#1A6B4A] text-xs p-3 rounded-xl border border-green-200 font-bold">
                {suksesMsg}
              </div>
            )}

            <form onSubmit={handleSimpanPin} className="space-y-3">
              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">PIN Saat Ini</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinLama}
                  onChange={(e) => setPinLama(e.target.value)}
                  placeholder="6 digit PIN lama"
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A6B4A] bg-[#F4F7F5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">PIN Baru (6 Digit)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={pinBaru}
                  onChange={(e) => setPinBaru(e.target.value)}
                  placeholder="6 digit PIN baru"
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A6B4A] bg-[#F4F7F5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-[#4A6358] font-semibold block mb-1">Konfirmasi PIN Baru</label>
                <input
                  type="password"
                  maxLength={6}
                  value={konfirmasiPin}
                  onChange={(e) => setKonfirmasiPin(e.target.value)}
                  placeholder="Ulangi PIN baru"
                  className="w-full border border-[#E2EBE7] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1A6B4A] bg-[#F4F7F5]"
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
