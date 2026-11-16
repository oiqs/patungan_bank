import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, ArrowRight, Clock, Megaphone, Dices, CheckCircle2, FileText } from 'lucide-react'
import Card from '../../components/Card'
import { useBankStore } from '../../store/useBankStore'

export default function Notifikasi() {
  const navigate = useNavigate()
  const { notifikasi, markAllNotifAsRead } = useBankStore()

  const unreadCount = notifikasi.filter(n => !n.dibaca).length

  const getNotifMeta = (judul = '') => {
    const j = judul.toLowerCase()
    if (j.includes('iuran') || j.includes('tagihan')) {
      return { icon: Clock, bg: 'bg-[#FEF3DC]', color: 'text-[#D97706]' }
    }
    if (j.includes('rapat') || j.includes('undangan')) {
      return { icon: Megaphone, bg: 'bg-[#E8EEF9]', color: 'text-[#2B6CB0]' }
    }
    if (j.includes('arisan')) {
      return { icon: Dices, bg: 'bg-[#FEF3DC]', color: 'text-[#B45309]' }
    }
    if (j.includes('verifikasi') || j.includes('lunas') || j.includes('berhasil')) {
      return { icon: CheckCircle2, bg: 'bg-[#E6F4EE]', color: 'text-[#1A6B4A]' }
    }
    if (j.includes('pinjaman')) {
      return { icon: FileText, bg: 'bg-[#E8EEF9]', color: 'text-[#2B6CB0]' }
    }
    return { icon: Bell, bg: 'bg-[#E6F4EE]', color: 'text-[#1A6B4A]' }
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Topbar */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[#1A6B4A] active:scale-95 transition-transform"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-[#111F1A] font-bold text-base">Notifikasi</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotifAsRead}
            className="text-xs text-[#1A6B4A] font-semibold active:scale-95 transition-transform"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="p-4 space-y-3">
        {notifikasi.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <Bell className="w-12 h-12 text-[#8FA89E] opacity-40 stroke-[1.5]" />
            <p className="text-sm font-bold text-[#111F1A] mt-2">Belum ada notifikasi</p>
            <p className="text-xs text-[#8FA89E] mt-1">Pemberitahuan tagihan dan info rapat akan muncul di sini</p>
          </div>
        ) : (
          notifikasi.map((item) => {
            const meta = getNotifMeta(item.judul)
            const IconComponent = meta.icon
            return (
              <Card
                key={item.id}
                onClick={() => {
                  if (item.link) navigate(item.link)
                }}
                className={`p-4 transition-all ${!item.dibaca ? 'bg-[#EBF7F1]/50 border-l-4 border-l-[#1A6B4A]' : 'bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center ${meta.color} flex-shrink-0 mt-0.5`}>
                    <IconComponent className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-[#111F1A]">{item.judul}</p>
                      <span className="text-[10px] text-[#8FA89E] whitespace-nowrap">{item.tgl}</span>
                    </div>
                    <p className="text-xs text-[#4A6358] mt-1 leading-relaxed">{item.pesan}</p>
                    {item.link && (
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#1A6B4A]">
                        Lihat detail <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
