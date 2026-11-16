import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rp } from '../lib/format'
import { useBankStore } from '../store/useBankStore'
import NailongAvatar from './NailongAvatar'
import { X, Send, Mic, Sparkles } from 'lucide-react'

export default function AIAssistantModal({ isOpen, onClose }) {
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
      text: `Halo Pak/Bu ${currentUser.nama}! 👋 Aku patuAI, asisten pintar Patungan Bank Tarunesha. Ada yang bisa dibantu seputar iuran, kas RT, arisan, atau pinjaman modal?`,
      time: 'Baru saja',
    }
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isTyping])

  if (!isOpen) return null

  const quickPrompts = [
    { label: 'Cek iuran saya', query: 'Apakah iuran saya sudah lunas?' },
    { label: 'Uang kas RT', query: 'Berapa saldo kas Tarunesha sekarang?' },
    { label: 'Simulasi pinjaman', query: 'Berapa cicilan pinjaman Rp 1.000.000?' },
    { label: 'Info arisan', query: 'Kapan jadwal undian arisan?' },
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
            text: `Anda memiliki 1 tagihan belum lunas: **${belum.judul}** sebesar **${rp(belum.nominal)}** (Jatuh tempo: ${belum.jatuhTempo}). Saldo dompet Anda saat ini **${rp(dompetSaldo)}**.`,
            action: {
              type: 'bayar_iuran',
              tagihanId: belum.id,
              nominal: belum.nominal,
              label: 'Bayar Sekarang via Dompet',
            },
            time: 'Baru saja',
          }
        } else {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Kabar baik! Seluruh tagihan iuran wajib Anda hingga saat ini sudah **Lunas**. Terima kasih telah disiplin bergotong royong! ⭐`,
            time: 'Baru saja',
          }
        }
      } else if (lower.includes('kas') || lower.includes('saldo rt') || lower.includes('uang kas')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Ringkasan Uang Kas RT Tarunesha per hari ini:\n• **Total Saldo Kas:** ${rp(kasSaldo)}\n• **Pemasukan Bulan Ini:** +${rp(kasBulanIniMasuk)}\n• **Pengeluaran Bulan Ini:** -${rp(kasBulanIniKeluar)}\n\nLaporan ini transparan dan dapat diawasi bersama seluruh warga.`,
          action: {
            type: 'link',
            url: '/kas',
            label: 'Lihat Buku Kas & Rekap',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('pinjam') || lower.includes('modal') || lower.includes('tani') || lower.includes('cicilan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Skor reputasi Anda adalah **${currentUser.skor}/100** dengan batas plafon hingga **${rp(currentUser.plafonTersedia)}**.\n\nSimulasi pinjaman Rp 1.000.000 (tenor 6 bulan):\n• Cicilan pokok + jasa gotong royong (1.5%/bln): **Rp 181.600 / bulan**.\nPengajuan mudah tanpa agunan sertifikat.`,
          action: {
            type: 'link',
            url: '/layanan/ajukan-pinjaman',
            label: 'Buka Formulir Pengajuan',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('arisan') || lower.includes('kocok') || lower.includes('undian')) {
        const lunasCount = arisan.peserta.filter(p => p.lunas).length
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `**${arisan.judul} (${arisan.periode})**:\n• Total pot saat ini: **${rp(arisan.pot)}**\n• Status setoran: ${lunasCount} dari ${arisan.peserta.length} peserta sudah menyetor.\nUndian dikocok transparan secara berkala.`,
          action: {
            type: 'link',
            url: '/layanan/arisan',
            label: 'Lihat Layar Undian Arisan',
          },
          time: 'Baru saja',
        }
      } else {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Aku mengerti pertanyaan Anda tentang "${query}". Silakan cek menu **Kas RT** untuk iuran & laporan, menu **Layanan** untuk arisan & pembiayaan, atau **Dompet** untuk saldo Anda.`,
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
            text: `✅ Pembayaran iuran berhasil! Saldo dompet Anda telah dipotong dan tagihan berstatus Lunas.`,
            time: 'Baru saja',
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-notif-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ Saldo dompet Anda tidak cukup untuk membayar tagihan. Silakan isi saldo di menu Dompet.`,
            time: 'Baru saja',
          }
        ])
      }
    } else if (action.type === 'link') {
      onClose()
      navigate(action.url)
    }
  }

  return (
    <div className="absolute inset-0 z-50 bg-black/60 flex items-end justify-center sm:items-center animate-fade-in">
      <div className="bg-[#F4F7F5] w-full h-[90%] sm:h-[660px] rounded-t-[32px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up border border-[#E2EBE7]">
        
        {/* Header patuAI */}
        <div className="bg-[#1A6B4A] px-5 py-3.5 text-white flex items-center justify-between shadow-xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center p-1">
              <NailongAvatar className="w-7 h-7" animated />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base">patuAI Asisten</h3>
                <span className="w-2 h-2 rounded-full bg-[#4DB87F] animate-pulse" />
              </div>
              <p className="text-xs text-white/90">Asisten Keuangan Warga Tarunesha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-90 transition-transform"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Prompts Chips */}
        <div className="bg-white px-4 py-3 border-b border-[#E2EBE7] flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              className="px-3.5 py-2 rounded-full bg-[#EBF7F1] hover:bg-[#d8efe3] text-[#1A6B4A] text-xs font-bold whitespace-nowrap active:scale-95 transition-transform border border-[#1A6B4A]/20 flex-shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chat History List */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#1A6B4A] text-white rounded-tr-none'
                    : 'bg-white text-[#111F1A] border border-[#E2EBE7] rounded-tl-none'
                }`}
              >
                <div className="space-y-1.5">
                  {m.text.split('\n').map((line, li) => (
                    <p key={li} dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  ))}
                </div>

                {m.action && (
                  <div className="mt-3 pt-3 border-t border-[#E2EBE7]">
                    <button
                      onClick={() => handleAction(m.action)}
                      className="w-full min-h-[42px] py-2 px-3 bg-[#1A6B4A] hover:bg-[#207e58] text-white font-bold rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Sparkles size={16} /> {m.action.label}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-xs text-[#5F7A6E] mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {/* AI Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#5F7A6E] bg-white border border-[#E2EBE7] px-3.5 py-2 rounded-2xl rounded-tl-none w-36 shadow-xs">
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

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E2EBE7] flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <div className="flex-1 bg-[#F4F7F5] border border-[#D5E2DC] rounded-2xl px-4 py-2.5 flex items-center gap-2 focus-within:border-[#1A6B4A] focus-within:bg-white transition-colors">
              <input
                type="text"
                placeholder="Tanya tagihan, pinjaman, kas..."
                value={inputPesan}
                onChange={e => setInputPesan(e.target.value)}
                className="w-full bg-transparent text-base text-[#111F1A] focus:outline-none placeholder-[#5F7A6E]"
              />
              <button
                type="button"
                onClick={() => handleSend('Berapa saldo kas Tarunesha saat ini?')}
                title="Bicara dengan suara"
                className="w-9 h-9 flex items-center justify-center text-[#5F7A6E] hover:text-[#1A6B4A] active:scale-90"
              >
                <Mic size={18} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputPesan.trim()}
              className="w-12 h-12 rounded-2xl bg-[#1A6B4A] disabled:opacity-40 text-white flex items-center justify-center font-bold active:scale-95 transition-all shadow-sm flex-shrink-0"
              aria-label="Kirim"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-xs text-center text-[#5F7A6E] mt-2">
            patuAI siap membantu kebutuhan keuangan warga Tarunesha
          </p>
        </div>

      </div>
    </div>
  )
}
