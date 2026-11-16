import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  Calculator,
  Users,
  Zap,
  Mic,
  Send,
} from 'lucide-react'
import { rp, shortRp } from '../../lib/format'
import Card from '../../components/Card'
import Button from '../../components/Button'
import NailongAvatar from '../../components/NailongAvatar'
import { useBankStore } from '../../store/useBankStore'

export default function AsistenAI() {
  const navigate = useNavigate()
  const {
    currentUser,
    tagihanIuran,
    kasSaldo,
    kasBulanIniMasuk,
    kasBulanIniKeluar,
    dompetSaldo,
    arisan,
    bayarIuranWajib,
  } = useBankStore()

  const [inputPesan, setInputPesan] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Halo ${currentUser.nama}! Aku patuAI, asisten pintar Patungan Bank Tarunesha. Aku siap membantu Anda mengecek tagihan iuran, menghitung simulasi pinjaman, memantau transparansi kas RT, atau jadwal arisan!`,
      time: '12:00',
    }
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const quickPrompts = [
    { label: 'Status Iuran Saya', icon: CreditCard, query: 'Apakah iuran wajib saya sudah lunas?' },
    { label: 'Kas RT Tarunesha', icon: Landmark, query: 'Berapa saldo kas Tarunesha saat ini?' },
    { label: 'Simulasi Pinjaman Tani', icon: Calculator, query: 'Berapa cicilan pinjaman modal tani Rp 1.500.000?' },
    { label: 'Kapan Undian Arisan?', icon: Users, query: 'Berapa total pot arisan bulan ini?' },
  ]

  const handleSend = (text) => {
    const query = text || inputPesan
    if (!query.trim()) return

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages(prev => [...prev, userMsg])
    setInputPesan('')
    setIsTyping(true)

    setTimeout(() => {
      let aiReply = {}
      const lower = query.toLowerCase()

      if (lower.includes('iuran') || lower.includes('tagihan') || lower.includes('bayar')) {
        const belum = tagihanIuran.find(t => t.status === 'belum')
        if (belum) {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Data pembukuan menemukan tagihan: **${belum.judul}** sebesar **${rp(belum.nominal)}** (Jatuh tempo: ${belum.jatuhTempo}).\n\nSaldo dompet Anda: **${rp(dompetSaldo)}**.`,
            action: {
              type: 'bayar_iuran',
              tagihanId: belum.id,
              nominal: belum.nominal,
              label: 'Bayar Sekarang via Saldo Dompet',
            },
            time: 'Baru saja',
          }
        } else {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Alhamdulillah! Seluruh tagihan iuran wajib Anda telah **Lunas**. Pertahankan kedisiplinan gotong royong ini ya! ⭐`,
            time: 'Baru saja',
          }
        }
      } else if (lower.includes('kas') || lower.includes('saldo rt') || lower.includes('keuangan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Ringkasan kas resmi Tarunesha RT 05 per hari ini:\n• **Saldo Kas Bersih:** ${rp(kasSaldo)}\n• **Kas Masuk Bulan Ini:** +${rp(kasBulanIniMasuk)}\n• **Kas Keluar Nota:** -${rp(kasBulanIniKeluar)}\n\nLaporan keuangan lengkap dapat diakses secara transparan oleh seluruh warga.`,
          action: {
            type: 'link',
            url: '/kas/laporan',
            label: 'Lihat Laporan Grafik & Unduh PDF',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('pinjam') || lower.includes('modal') || lower.includes('tani') || lower.includes('cicilan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Skor reputasi Anda adalah **${currentUser.skor}/100** (Plafon: ${rp(currentUser.plafonTersedia)}).\n\nSimulasi Pinjaman Modal Rp 1.500.000 tenor 6 bulan:\n• Bunga jasa gotong royong: 1.5%/bulan\n• Estimasi cicilan: **Rp 272.500 / bulan**.\nPengajuan mudah tanpa agunan sertifikat, cukup penjamin sesama warga Tarunesha.`,
          action: {
            type: 'link',
            url: '/layanan/ajukan-pinjaman',
            label: 'Buka Form Pengajuan Pembiayaan',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('arisan') || lower.includes('pot') || lower.includes('kocok')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Informasi **${arisan.judul}**:\n• Periode: ${arisan.periode}\n• Total Pot Terkumpul: **${rp(arisan.pot)}**\n• Pemenang sebelumnya: ${arisan.riwayatPemenang[0]?.nama || 'Dewi Lestari'}\n\nUndian transparan dapat dikocok langsung secara digital!`,
          action: {
            type: 'link',
            url: '/layanan/arisan',
            label: 'Buka Layar Kocokan Arisan',
          },
          time: 'Baru saja',
        }
      } else {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Saya mengerti pertanyaan Anda seputar "${query}". Anda dapat membuka menu **Kas** untuk tagihan dan laporan, **Layanan** untuk arisan & pembiayaan, atau **Dompet** untuk saldo Anda.`,
          time: 'Baru saja',
        }
      }

      setIsTyping(false)
      setMessages(prev => [...prev, aiReply])
    }, 700)
  }

  const handleAction = (action) => {
    if (action.type === 'bayar_iuran') {
      const ok = bayarIuranWajib(action.tagihanId, 'dompet')
      if (ok) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-notif-${Date.now()}`,
            sender: 'ai',
            text: `Pembayaran tagihan berhasil! Saldo dompet Anda telah dipotong dan iuran tercatat lunas.`,
            time: 'Baru saja',
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-notif-${Date.now()}`,
            sender: 'ai',
            text: `Saldo dompet tidak mencukupi. Silakan lakukan Top-Up dompet terlebih dahulu.`,
            time: 'Baru saja',
          }
        ])
      }
    } else if (action.type === 'link') {
      navigate(action.url)
    }
  }

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-[#1A6B4A] active:scale-95 transition-transform" title="Kembali">
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[#111F1A] font-extrabold text-base">patuAI Asisten</h1>
            <span className="text-[10px] font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2 py-0.5 rounded-full">
              Online
            </span>
          </div>
          <p className="text-[11px] text-[#8FA89E]">Asisten Cerdas Keuangan & Gotong Royong</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-[#FEF3DC] border border-[#F5A623]/30 flex items-center justify-center p-1 shadow-sm">
          <NailongAvatar className="w-7 h-7" animated />
        </div>
      </div>

      {/* Prompts Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-[#E2EBE7] flex gap-2 overflow-x-auto no-scrollbar">
        {quickPrompts.map((p, i) => {
          const Icon = p.icon
          return (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              className="px-3 py-1.5 rounded-full bg-[#EBF7F1] hover:bg-[#d8efe3] text-[#1A6B4A] text-xs font-bold whitespace-nowrap active:scale-95 transition-transform border border-[#1A6B4A]/15 flex items-center gap-1.5 flex-shrink-0"
            >
              <Icon className="w-3.5 h-3.5 stroke-[2]" />
              {p.label}
            </button>
          )
        })}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-[#1A6B4A] text-white rounded-tr-none'
                  : 'bg-white text-[#111F1A] border border-[#E2EBE7] rounded-tl-none'
              }`}
            >
              <div className="space-y-1">
                {m.text.split('\n').map((line, li) => (
                  <p key={li} dangerouslySetInnerHTML={{
                    __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }} />
                ))}
              </div>

              {m.action && (
                <div className="mt-3 pt-2.5 border-t border-[#E2EBE7]">
                  <Button
                    full
                    size="sm"
                    variant="primary"
                    className="flex items-center justify-center gap-1.5"
                    onClick={() => handleAction(m.action)}
                  >
                    <Zap className="w-3.5 h-3.5 stroke-[2.2]" /> {m.action.label}
                  </Button>
                </div>
              )}
            </div>
            <span className="text-[10px] text-[#8FA89E] mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#8FA89E] bg-white border border-[#E2EBE7] px-3.5 py-2 rounded-2xl rounded-tl-none w-36 shadow-sm">
            <NailongAvatar className="w-4 h-4" animated />
            <span className="font-bold text-[#1A6B4A]">patuAI</span>
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-[#1A6B4A] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#1A6B4A] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-[#1A6B4A] rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 inset-x-0 max-w-md mx-auto p-3 bg-white border-t border-[#E2EBE7] z-20">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 bg-[#F4F7F5] border border-[#E2EBE7] rounded-2xl px-3.5 py-2 flex items-center gap-2 focus-within:border-[#1A6B4A]">
            <input
              type="text"
              placeholder="Ketik pertanyaan untuk patuAI..."
              value={inputPesan}
              onChange={e => setInputPesan(e.target.value)}
              className="w-full bg-transparent text-xs text-[#111F1A] focus:outline-none placeholder-[#8FA89E]"
            />
            <button
              type="button"
              onClick={() => handleSend('Cek status iuran saya bulan ini')}
              title="Input Suara AI"
              className="text-[#8FA89E] hover:text-[#1A6B4A] p-1 active:scale-90 transition-colors"
            >
              <Mic className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputPesan.trim()}
            className="w-10 h-10 rounded-2xl bg-[#1A6B4A] disabled:opacity-40 text-white flex items-center justify-center active:scale-90 transition-transform shadow-md"
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </button>
        </form>
      </div>
    </div>
  )
}
