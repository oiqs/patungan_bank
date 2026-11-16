import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBankStore, PRESET_USERS } from '../../store/useBankStore'

const NUMPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '👆', '0', '⌫']

export default function Login() {
  const navigate = useNavigate()
  const { loginUserByPin, loginAsPreset } = useBankStore()

  const [selectedRoleKey, setSelectedRoleKey] = useState('anggota')
  const [pin, setPin] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successInfo, setSuccessInfo] = useState(null)
  const [isBiometricScanning, setIsBiometricScanning] = useState(false)

  const activePreset = PRESET_USERS[selectedRoleKey] || PRESET_USERS.anggota

  // Handle ketika tombol numpad ditekan
  const handlePress = (key) => {
    setErrorMessage('')

    if (key === '⌫') {
      setPin(p => p.slice(0, -1))
    } else if (key === '👆') {
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
        navigate('/')
      }, 700)
    } else {
      setErrorMessage('PIN tidak cocok! Silakan cek PIN demo di bawah.')
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
      const user = loginAsPreset(selectedRoleKey)
      setSuccessInfo(user)
      setTimeout(() => {
        navigate('/')
      }, 700)
    }, 600)
  }

  // Ganti pilihan akun di header
  const handleSelectAccount = (key) => {
    setSelectedRoleKey(key)
    setPin([])
    setErrorMessage('')
    setSuccessInfo(null)
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-[#F4F7F5] select-none">

      {/* ── HEADER IDENTITAS AKUN ── */}
      <div className="bg-gradient-to-b from-[#0D4A33] via-[#1A6B4A] to-[#207552] text-white pt-12 pb-6 px-5 rounded-b-[32px] shadow-sm flex flex-col items-center">
        
        {/* App Title */}
        <div className="flex items-center gap-1.5 mb-3 bg-white/10 px-3 py-1 rounded-full border border-white/15">
          <span className="text-sm">🌱</span>
          <span className="text-[11px] font-bold tracking-wide uppercase text-white/90">
            Patungan Bank Tarunesha
          </span>
        </div>

        {/* Selected User Avatar */}
        <div className="relative mb-2">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
            {activePreset.avatar}
          </div>
          <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2 py-0.5 rounded-full shadow-sm border border-white">
            {activePreset.peran}
          </span>
        </div>

        <p className="text-base font-bold text-white tracking-tight">{activePreset.nama}</p>
        <p className="text-xs text-white/75">{activePreset.telepon}</p>

        {/* ── ROLE TAB SELECTOR (MEMBEDAKAN LOGIN SESUAI BAB 4.2) ── */}
        <div className="mt-3.5 w-full bg-black/20 p-1 rounded-xl flex items-center gap-1 backdrop-blur-sm">
          {Object.entries(PRESET_USERS).map(([key, u]) => (
            <button
              key={key}
              onClick={() => handleSelectAccount(key)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                selectedRoleKey === key
                  ? 'bg-white text-[#1A6B4A] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {u.peran}
            </button>
          ))}
        </div>
      </div>

      {/* ── AREA INPUT PIN ── */}
      <div className="px-5 py-4 flex flex-col items-center flex-1 justify-center">

        {/* Status Text / Error / Success Toast */}
        {successInfo ? (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A] text-[#1A6B4A] text-xs font-bold px-4 py-2 rounded-xl mb-3 flex items-center gap-2 animate-bounce">
            <span>✓</span>
            <span>Berhasil masuk sebagai {successInfo.peran}: {successInfo.nama}!</span>
          </div>
        ) : errorMessage ? (
          <div className="bg-[#FDEAEA] border border-[#E84040] text-[#E84040] text-xs font-semibold px-4 py-2 rounded-xl mb-3 animate-pulse">
            {errorMessage}
          </div>
        ) : isBiometricScanning ? (
          <div className="bg-[#FEF3DC] border border-[#A05C00] text-[#A05C00] text-xs font-semibold px-4 py-2 rounded-xl mb-3 flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            <span>Memindai Sidik Jari...</span>
          </div>
        ) : (
          <p className="text-xs font-semibold text-[#4A6358] mb-3 text-center">
            Masukkan 6 Digit PIN Pengamanan
          </p>
        )}

        {/* PIN 6 Dots */}
        <div className="flex gap-3.5 mb-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                i < pin.length
                  ? 'bg-[#1A6B4A] scale-125 shadow-[0_0_8px_rgba(26,107,74,0.4)]'
                  : 'bg-[#C8D9D2]'
              }`}
            />
          ))}
        </div>

        {/* Interactive Numpad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px]">
          {NUMPAD.map(key => (
            <button
              key={key}
              onClick={() => handlePress(key)}
              className={`h-12 rounded-xl text-lg font-bold flex items-center justify-center active:scale-90 transition-all ${
                key === '⌫' || key === '👆'
                  ? 'bg-white text-[#1A6B4A] border border-[#D5E2DC] shadow-sm'
                  : 'bg-white text-[#111F1A] border border-[#D5E2DC] shadow-sm hover:border-[#1A6B4A]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

      </div>

      {/* ── FOOTER HELP ── */}
      <div className="py-3 px-5 text-center flex flex-col gap-1 border-t border-[#E2EBE7] bg-white">
        <button
          onClick={() => alert(`Bantuan Tarunesha:\nHubungi Sekretariat RT 05 melalui WhatsApp di +62 812-9876-5432 untuk reset PIN.`)}
          className="text-xs text-[#1A6B4A] font-semibold active:underline"
        >
          Lupa PIN Pengamanan?
        </button>
        <p className="text-[10px] text-[#8FA89E]">
          Belum terdaftar?{' '}
          <button
            onClick={() => navigate('/daftar')}
            className="text-[#1A6B4A] font-bold underline"
          >
            Daftar Anggota Baru
          </button>
        </p>
      </div>

    </div>
  )
}
