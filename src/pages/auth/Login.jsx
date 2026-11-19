import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Fingerprint,
  Delete,
  Sprout,
  Check,
  Loader2,
} from 'lucide-react'
import { useBankStore } from '../../store/useBankStore'

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'bio', '0', 'del']

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, loginUserByPin, loginAsPreset } = useBankStore()

  const [pin, setPin] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successInfo, setSuccessInfo] = useState(null)
  const [isBiometricScanning, setIsBiometricScanning] = useState(false)

  // Handle ketika tombol numpad ditekan
  const handlePress = (key) => {
    setErrorMessage('')

    if (key === 'del') {
      setPin(p => p.slice(0, -1))
    } else if (key === 'bio') {
      triggerBiometricLogin()
    } else if (pin.length < 6) {
      const nextPin = [...pin, key]
      setPin(nextPin)

      if (nextPin.length === 6) {
        verifyPin(nextPin.join(''))
      }
    }
  }

  // Verifikasi PIN
  const verifyPin = (enteredPin) => {
    const result = loginUserByPin(enteredPin)

    if (result.success) {
      setSuccessInfo(result.user)
      setTimeout(() => {
        navigate('/beranda')
      }, 700)
    } else {
      setErrorMessage('PIN tidak sesuai! Silakan coba lagi.')
      setTimeout(() => {
        setPin([])
      }, 900)
    }
  }

  // Simulasi Biometrik (Fingerprint / Face ID)
  const triggerBiometricLogin = () => {
    setIsBiometricScanning(true)
    setErrorMessage('')
    setTimeout(() => {
      setIsBiometricScanning(false)
      const user = currentUser?.id ? currentUser : loginAsPreset('anggota')
      setSuccessInfo(user)
      setTimeout(() => {
        navigate('/beranda')
      }, 700)
    }, 600)
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-white select-none">

      {/* ── HEADER IDENTITAS BANK (PUTIH DENGAN LOGO & TEKS HIJAU) ── */}
      <div className="pt-20 sm:pt-24 pb-3 px-5 flex flex-col items-center">
        
        {/* Logo Bank (Sprout Warna Hijau Khas Bank) */}
        <div className="mb-2.5 flex items-center justify-center">
          <Sprout className="w-14 h-14 text-[#1A6B4A] stroke-[2.2]" />
        </div>

        {/* Nama Bank Warna Hijau */}
        <h1 className="text-2xl tracking-tight flex items-center justify-center">
          <span className="font-extrabold text-[#1A6B4A]">Patungan</span>
          <span className="font-light text-[#2D8B63] ml-1.5">Bank</span>
        </h1>
        <p className="text-xs text-[#5A7569] mt-0.5 font-medium tracking-wide">
          Komunitas Tarunesha
        </p>
      </div>

      {/* ── AREA INPUT PIN ── */}
      <div className="px-5 py-2 flex flex-col items-center flex-1 justify-center">

        {/* Status Text / Error / Success Toast */}
        {successInfo ? (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] shadow-sm text-xs font-bold px-4 py-2.5 rounded-xl mb-3 flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Berhasil masuk sebagai {successInfo.peran}: {successInfo.nama}!</span>
          </div>
        ) : errorMessage ? (
          <div className="bg-[#FDEAEA] border border-[#E84040]/30 text-[#E84040] text-xs font-semibold px-4 py-2.5 rounded-xl mb-3 animate-pulse">
            {errorMessage}
          </div>
        ) : isBiometricScanning ? (
          <div className="bg-[#FEF3DC] border border-[#A05C00]/30 text-[#A05C00] text-xs font-semibold px-4 py-2.5 rounded-xl mb-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />
            <span>Memindai Sidik Jari...</span>
          </div>
        ) : (
          <p className="text-xs font-semibold text-[#4A6358] mb-3 text-center">
            Masukkan 6 Digit PIN Pengamanan
          </p>
        )}

        {/* PIN 6 Dots */}
        <div className="flex gap-3.5 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                i < pin.length
                  ? 'bg-[#1A6B4A] scale-125 shadow-[0_0_8px_rgba(26,107,74,0.4)]'
                  : 'bg-[#D5E2DC]'
              }`}
            />
          ))}
        </div>

        {/* Interactive Numpad dengan Tombol Bulat */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[270px] justify-items-center">
          {NUMPAD.map(key => (
            <button
              key={key}
              onClick={() => handlePress(key)}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full text-xl font-bold flex items-center justify-center active:scale-90 transition-all ${
                key === 'del' || key === 'bio'
                  ? 'bg-white text-[#1A6B4A] border border-[#D8E3DE] shadow-sm hover:border-[#1A6B4A] hover:bg-[#F4FBF7] active:bg-[#E6F4EE]'
                  : 'bg-white text-[#111F1A] border border-[#D8E3DE] shadow-sm hover:border-[#1A6B4A] hover:bg-[#F4FBF7] active:bg-[#E6F4EE]'
              }`}
            >
              {key === 'bio' ? (
                <Fingerprint className="w-6 h-6 text-[#1A6B4A] stroke-[2]" />
              ) : key === 'del' ? (
                <Delete className="w-6 h-6 text-[#4A6358] stroke-[2]" />
              ) : (
                key
              )}
            </button>
          ))}
        </div>

      </div>

      {/* ── FOOTER HELP ── */}
      <div className="py-4 px-5 text-center flex flex-col gap-1 border-t border-[#EDF2EF] bg-white">
        <button
          onClick={() => alert(`Bantuan Tarunesha:\nHubungi Sekretariat RT 05 melalui WhatsApp di +62 812-9876-5432 untuk reset PIN.`)}
          className="text-xs text-[#1A6B4A] hover:text-[#0D4A33] font-semibold active:underline transition-colors"
        >
          Lupa PIN Pengamanan?
        </button>
        <p className="text-[10px] text-[#718B80]">
          Belum terdaftar?{' '}
          <button
            onClick={() => navigate('/daftar')}
            className="text-[#1A6B4A] font-bold underline hover:text-[#0D4A33] transition-colors"
          >
            Daftar Anggota Baru
          </button>
        </p>
      </div>

    </div>
  )
}
