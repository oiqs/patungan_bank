import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Bell, ChevronRight, CheckCheck } from 'lucide-react'

export default function Notifikasi() {
  const navigate = useNavigate()
  const { notifikasi, markAllNotifAsRead } = useBankStore()

  const unreadCount = notifikasi.filter(n => !n.dibaca).length

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-y-auto no-scrollbar pb-24">
      {/* Topbar */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E2EBE7] flex items-center justify-between sticky top-0 z-10 pt-12">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-[#111F1A] font-bold text-base">Notifikasi</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotifAsRead}
            className="text-xs text-[#1A6B4A] font-bold flex items-center gap-1 active:scale-95 transition-transform"
          >
            <CheckCheck size={16} /> Tandai Dibaca
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-3">
        {notifikasi.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2EBE7] flex items-center justify-center mx-auto text-[#5F7A6E]">
              <Bell size={28} />
            </div>
            <p className="text-base font-bold text-[#111F1A] mt-3">Belum ada pemberitahuan</p>
            <p className="text-xs text-[#5F7A6E] mt-1">Pemberitahuan tagihan dan info rapat warga akan muncul di sini</p>
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
                <span className="text-xs text-[#5F7A6E] whitespace-nowrap">{item.tgl}</span>
              </div>
              <p className="text-xs text-[#456355] mt-1 leading-relaxed">{item.pesan}</p>
              {item.link && (
                <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-[#1A6B4A]">
                  <span>Buka Menu Terkait</span>
                  <ChevronRight size={14} />
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
