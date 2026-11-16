import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

export default function Daftar() {
  const navigate = useNavigate()
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [kode, setKode] = useState('')
  const [setuju, setSetuju] = useState(false)

  const isValid = nama.trim() && hp.trim() && kode.trim() && setuju

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-[#E2EBE7]">
        <button
          onClick={() => navigate(-1)}
          className="text-[#1A6B4A] text-lg font-bold active:scale-95 transition-transform mb-3"
        >
          ← Kembali
        </button>
        <h1 className="text-[#111F1A] text-2xl font-bold">Buat Akun</h1>
        <p className="text-[#4A6358] text-sm">Bergabung dengan Tarunesha</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-5">
        {/* Nama Lengkap */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#111F1A]">Nama Lengkap</label>
          <input
            type="text"
            placeholder="Masukkan nama lengkap"
            value={nama}
            onChange={e => setNama(e.target.value)}
            className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1A6B4A] bg-white"
          />
        </div>

        {/* No. HP */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#111F1A]">No. HP</label>
          <div className="flex items-center border border-[#E2EBE7] rounded-xl bg-white overflow-hidden focus-within:border-[#1A6B4A]">
            <span className="px-4 py-3.5 text-sm text-[#4A6358] font-semibold border-r border-[#E2EBE7]">+62</span>
            <input
              type="tel"
              placeholder="812-xxxx-xxxx"
              value={hp}
              onChange={e => setHp(e.target.value)}
              className="flex-1 px-4 py-3.5 text-sm focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Kode Undangan */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#111F1A]">Kode Undangan</label>
          <input
            type="text"
            placeholder="Masukkan kode undangan"
            value={kode}
            onChange={e => setKode(e.target.value)}
            className="w-full border border-[#E2EBE7] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#1A6B4A] bg-white"
          />
          <p className="text-xs text-[#8FA89E]">Minta kode undangan dari pengurus RT</p>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={setuju}
            onChange={e => setSetuju(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#1A6B4A] rounded"
          />
          <span className="text-sm text-[#4A6358]">
            Saya menyetujui{' '}
            <span className="text-[#1A6B4A] font-semibold">penggunaan data pribadi</span> sesuai ketentuan Tarunesha
          </span>
        </label>

        {/* Submit */}
        <div className="mt-2">
          <Button
            full
            size="lg"
            disabled={!isValid}
            onClick={() => navigate('/otp')}
          >
            Kirim OTP →
          </Button>
        </div>
      </div>
    </div>
  )
}
