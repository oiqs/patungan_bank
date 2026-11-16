import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import { rp } from '../../lib/format'
import { useBankStore } from '../../store/useBankStore'

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

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Arisan Digital Tarunesha 🎲</h1>
      </div>

      <div className="flex-1 px-4 py-4 flex flex-col gap-4">
        {notifBayar && (
          <div className="bg-[#E6F4EE] border border-[#1A6B4A]/30 text-[#1A6B4A] text-xs font-bold p-3 rounded-2xl text-center">
            {notifBayar}
          </div>
        )}

        {/* Arisan Card */}
        <Card className="p-5 bg-gradient-to-br from-[#1A6B4A] via-[#237c56] to-[#2D8B63] text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-xs mb-1 font-semibold uppercase tracking-wider">Periode Berjalan</p>
              <h2 className="text-white font-extrabold text-lg">{arisan.judul}</h2>
              <p className="text-white/80 text-xs mt-0.5">{arisan.periode} · Setoran {rp(arisan.nominalSetoran)}/orang</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs mb-1 font-semibold uppercase tracking-wider">Total Pot Dana</p>
              <p className="text-white font-extrabold text-2xl">{rp(arisan.pot)}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-white/90">
              👥 {arisan.peserta.filter(p => p.lunas).length} dari {arisan.peserta.length} sudah setor
            </span>
            <Button
              variant="accent"
              size="sm"
              onClick={handleUndian}
            >
              🎲 Kocok Undian
            </Button>
          </div>
        </Card>

        {/* Daftar Peserta */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest">
              Status Setoran Peserta ({arisan.peserta.length})
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {arisan.peserta.map((p, i) => (
              <Card key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#E6F4EE] flex items-center justify-center text-sm font-bold text-[#1A6B4A]">
                  {p.nama.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#111F1A] truncate">{p.nama}</p>
                  <p className="text-[10px] text-[#8FA89E]">Setoran {rp(arisan.nominalSetoran)}</p>
                </div>
                {p.lunas ? (
                  <span className="text-xs font-bold text-[#1A6B4A] bg-[#E6F4EE] px-3 py-1 rounded-full">
                    ✓ Lunas
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => handleSetor(p.nama)}
                  >
                    Setor Sekarang
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Pemenang Sebelumnya */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-2 px-1">
            Riwayat Pemenang Undian
          </p>
          <Card className="overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F4F7F5] border-b border-[#E2EBE7]">
                  <th className="px-4 py-2.5 text-left text-[#4A6358] font-bold">Nama Pemenang</th>
                  <th className="px-4 py-2.5 text-left text-[#4A6358] font-bold">Periode</th>
                  <th className="px-4 py-2.5 text-right text-[#4A6358] font-bold">Pot Diterima</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EBE7]">
                {arisan.riwayatPemenang.map((pw, i) => (
                  <tr key={i} className="hover:bg-[#F9FAF9]">
                    <td className="px-4 py-3 text-[#111F1A] font-bold">{pw.nama}</td>
                    <td className="px-4 py-3 text-[#4A6358]">{pw.bulan}</td>
                    <td className="px-4 py-3 text-right text-[#1A6B4A] font-extrabold">
                      {typeof pw.jumlah === 'number' ? rp(pw.jumlah) : pw.jumlah}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {/* Undian Overlay Modal */}
      {showUndian && (
        <div
          className="fixed inset-0 bg-black/75 flex flex-col items-center justify-center z-50 px-6 backdrop-blur-sm"
          onClick={() => { if (!spinning) setShowUndian(false) }}
        >
          <div
            className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 w-full max-w-sm shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[#4A6358] text-xs font-bold uppercase tracking-wider">
              {spinning ? 'Mengundi Nama Pemenang...' : '🎉 Pemenang Terpilih!'}
            </p>

            <div className={`text-6xl ${spinning ? 'animate-spin' : 'animate-bounce'}`}>
              {spinning ? '🎲' : '🏆'}
            </div>

            <p className="text-[#111F1A] text-2xl font-extrabold text-center min-h-[36px]">
              {displayName}
            </p>

            {!spinning && winner && (
              <div className="text-center bg-[#E6F4EE] p-3 rounded-2xl w-full">
                <p className="text-[#1A6B4A] font-bold text-sm">Selamat kepada {winner}!</p>
                <p className="text-xs text-[#4A6358] mt-0.5">Berhak menerima dana pot sebesar <strong>{rp(arisan.pot)}</strong>.</p>
              </div>
            )}

            {!spinning && (
              <Button full size="md" variant="primary" onClick={() => setShowUndian(false)}>
                Tutup & Simpan Hasil
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
