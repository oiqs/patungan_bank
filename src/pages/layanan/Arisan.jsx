import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Shuffle, CheckCircle2, Trophy, Clock } from 'lucide-react'

export default function Arisan() {
  const navigate = useNavigate()
  const { arisan, currentUser, bayarArisan, simpanPemenangArisan } = useBankStore()

  const [showUndian, setShowUndian] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [notifBayar, setNotifBayar] = useState('')

  const allNames = arisan.peserta.map(p => p.nama)

  const handleUndian = () => {
    setShowUndian(true)
    setSpinning(true)
    setWinner('')
    let count = 0
    const interval = setInterval(() => {
      setDisplayName(allNames[Math.floor(Math.random() * allNames.length)])
      count++
      if (count > 18) {
        clearInterval(interval)
        const finalWinner = allNames[Math.floor(Math.random() * allNames.length)]
        setWinner(finalWinner)
        setDisplayName(finalWinner)
        setSpinning(false)
        simpanPemenangArisan(finalWinner, arisan.pot)
      }
    }, 110)
  }

  const handleSetor = (nama) => {
    bayarArisan(nama)
    setNotifBayar(`Setoran arisan atas nama ${nama} berhasil dibukukan!`)
    setTimeout(() => setNotifBayar(''), 2000)
  }

  const lunasCount = arisan.peserta.filter(p => p.lunas).length

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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Arisan Digital RT 05</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {notifBayar && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-xs font-bold p-3.5 rounded-2xl text-center animate-fade-in">
            {notifBayar}
          </div>
        )}

        {/* Arisan Pot Card (Solid primary) */}
        <div className="p-5 bg-[#1A6B4A] rounded-3xl text-white shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Periode Berjalan</p>
              <h2 className="text-white font-extrabold text-lg mt-0.5">{arisan.judul}</h2>
              <p className="text-white/80 text-xs mt-0.5">{arisan.periode} · {rp(arisan.nominalSetoran)} / orang</p>
            </div>
            <div className="text-right">
              <p className="text-white/90 text-xs font-bold uppercase tracking-wider">Total Pot Dana</p>
              <p className="text-white font-black text-2xl mt-0.5">{rp(arisan.pot)}</p>
            </div>
          </div>

          <div className="bg-[#124E35] rounded-2xl p-3 border border-white/15 flex items-center justify-between text-xs text-white/90">
            <span>Status Setoran Peserta:</span>
            <span className="font-bold text-[#4DB87F]">
              {lunasCount} dari {arisan.peserta.length} Sudah Menyetor
            </span>
          </div>

          <Button
            full
            size="lg"
            variant="accent"
            onClick={handleUndian}
            className="shadow-md"
          >
            <Shuffle size={18} /> Kocok Undian Digital
          </Button>
        </div>

        {/* Modal / Overlay Kocokan Undian */}
        {showUndian && (
          <div className="bg-white border-2 border-[#F5A623] rounded-3xl p-6 text-center space-y-4 shadow-md animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3DC] text-[#A05C00] flex items-center justify-center mx-auto">
              <Trophy size={28} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-[#111F1A]">
                {spinning ? 'Mengocok Nama Pemenang...' : 'Selamat Kepada Pemenang!'}
              </h3>
              <p className="text-xs text-[#5F7A6E] mt-1">Undian acak transparan sistem Patungan Bank</p>
            </div>

            <div className={`p-4 rounded-2xl border-2 ${spinning ? 'bg-[#FEF3DC] border-[#F5A623] animate-pulse' : 'bg-[#E6F4EE] border-[#1A6B4A]'}`}>
              <p className={`text-2xl font-black ${spinning ? 'text-[#A05C00]' : 'text-[#1A6B4A]'}`}>
                {displayName || 'Menyiapkan...'}
              </p>
              {winner && (
                <p className="text-xs text-[#1A6B4A] font-bold mt-1">
                  Mendapatkan Pot Arisan Senilai {rp(arisan.pot)}
                </p>
              )}
            </div>

            {!spinning && (
              <Button
                full
                size="md"
                variant="primary"
                onClick={() => setShowUndian(false)}
              >
                Tutup Layar Undian
              </Button>
            )}
          </div>
        )}

        {/* Daftar Peserta Arisan */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-[#111F1A] px-1">
            Daftar Setoran Peserta ({arisan.peserta.length} Warga)
          </h3>
          <Card className="divide-y divide-[#F4F7F5]">
            {arisan.peserta.map((p, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F4F7F5] flex items-center justify-center text-xs font-bold text-[#2D4539]">
                    {p.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111F1A]">{p.nama}</p>
                    <p className="text-xs text-[#5F7A6E]">Nomor Undian: #{i + 1}</p>
                  </div>
                </div>

                <div>
                  {p.lunas ? (
                    <span className="text-xs font-bold text-[#1A6B4A] bg-[#E6F4EE] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={13} /> Lunas
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetor(p.nama)}
                      className="text-xs font-bold bg-[#1A6B4A] text-white px-3 py-1.5 rounded-xl active:scale-95 shadow-xs"
                    >
                      Setor ({shortRp(arisan.nominalSetoran)})
                    </button>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Riwayat Pemenang Sebelumnya */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#111F1A] px-1">Riwayat Pemenang Putaran Lalu</h3>
          <Card className="p-4 space-y-2.5">
            {arisan.riwayatPemenang.map((r, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-[#111F1A] text-sm">{r.nama}</p>
                  <p className="text-[#5F7A6E]">{r.periode}</p>
                </div>
                <span className="font-bold text-[#1A6B4A] text-sm">{rp(r.hadiah)}</span>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </div>
  )
}
