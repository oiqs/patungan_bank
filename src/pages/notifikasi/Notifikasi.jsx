import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import { useBankStore } from '../../store/useBankStore'

export default function Notifikasi() {
  const navigate = useNavigate()
  const { notifikasi, markAllNotifAsRead } = useBankStore()

  const unreadCount = notifikasi.filter(n => !n.dibaca).length

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Topbar */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#1A6B4A] font-bold active:scale-95 transition-transform">←</button>
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
          <div className="text-center py-16">
            <span className="text-4xl">🔔</span>
            <p className="text-sm font-bold text-[#111F1A] mt-2">Belum ada notifikasi</p>
            <p className="text-xs text-[#8FA89E] mt-1">Pemberitahuan tagihan dan info rapat akan muncul di sini</p>
          </div>
        ) : (
          notifikasi.map((item) => (
            <Card
              key={item.id}
              onClick={() => {
                if (item.link) navigate(item.link)
              }}
              className={`p-4 transition-all ${!item.dibaca ? 'bg-[#EBF7F1]/50 border-l-4 border-l-[#1A6B4A]' : 'bg-white'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-[#111F1A]">{item.judul}</p>
                <span className="text-[10px] text-[#8FA89E] whitespace-nowrap">{item.tgl}</span>
              </div>
              <p className="text-xs text-[#4A6358] mt-1 leading-relaxed">{item.pesan}</p>
              {item.link && (
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#1A6B4A]">
                  Lihat detail <span>→</span>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
