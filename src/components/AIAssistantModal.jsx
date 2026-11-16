import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rp, shortRp } from '../lib/format'
import { useBankStore } from '../store/useBankStore'

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
    pinjamanList,
    bayarIuranWajib,
  } = useBankStore()

  const [inputPesan, setInputPesan] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: `Halo ${currentUser.nama}! 👋 Saya Asisten AI Tarunesha. Ada yang bisa saya bantu terkait tagihan iuran, kas RT, arisan, atau pembiayaan usaha tani?`,
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
    { label: '💳 Cek iuran saya', query: 'Apakah iuran saya sudah lunas?' },
    { label: '📊 Kas RT saat ini', query: 'Berapa saldo kas Tarunesha sekarang?' },
    { label: '🌾 Simulasi pinjaman', query: 'Berapa cicilan pinjaman Rp 1.000.000?' },
    { label: '🎲 Info arisan', query: 'Kapan jadwal undian arisan?' },
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

    // Logika AI Respons Cerdas berdasarkan state aplikasi nyata
    setTimeout(() => {
      let aiReply = {}
      const lower = query.toLowerCase()

      if (lower.includes('iuran') || lower.includes('tagihan') || lower.includes('bayar')) {
        const belum = tagihanIuran.find(t => t.status === 'belum')
        if (belum) {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Saya mengecek data pembukuan Anda. Anda memiliki 1 tagihan belum lunas: **${belum.judul}** sebesar **${rp(belum.nominal)}** (Jatuh tempo: ${belum.jatuhTempo}). Saldo dompet Anda saat ini **${rp(dompetSaldo)}**.`,
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
            text: `Kabar baik! Seluruh tagihan iuran wajib Anda hingga saat ini sudah **Lunas** (100% disiplin). Pertahankan skor reputasi Anda ya! ⭐`,
            time: 'Baru saja',
          }
        }
      } else if (lower.includes('kas') || lower.includes('saldo rt') || lower.includes('uang kas')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Berikut ringkasan kas Tarunesha RT 05 real-time:\n• **Total Saldo Kas:** ${rp(kasSaldo)}\n• **Pemasukan Bulan Ini:** +${rp(kasBulanIniMasuk)}\n• **Pengeluaran Nota:** -${rp(kasBulanIniKeluar)}\n\nLaporan ini bersifat transparan dan diawasi bersama seluruh warga.`,
          action: {
            type: 'link',
            url: '/kas/laporan',
            label: 'Buka Buku Kas & Laporan PDF',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('pinjam') || lower.includes('modal') || lower.includes('tani') || lower.includes('cicilan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Skor reputasi Anda adalah **${currentUser.skor}/100** dengan plafon pembiayaan hingga **${rp(currentUser.plafonTersedia)}**.\n\nContoh simulasi modal tani Rp 1.000.000 (tenor 6 bulan):\n• Cicilan pokok + jasa gotong royong (1.5%/bln): **Rp 181.600 / bulan**.\nPengajuan bisa diajukan langsung secara online dengan melampirkan foto lahan.`,
          action: {
            type: 'link',
            url: '/layanan/ajukan-pinjaman',
            label: 'Ajukan Pinjaman Modal Sekarang',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('arisan') || lower.includes('kocok') || lower.includes('undian')) {
        const lunasCount = arisan.peserta.filter(p => p.lunas).length
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `**${arisan.judul} (${arisan.periode})**:\n• Total pot saat ini: **${rp(arisan.pot)}**\n• Status setoran: ${lunasCount} dari ${arisan.peserta.length} peserta sudah menyetor.\nUndian putaran ini siap dikocok saat rapat warga RT 05!`,
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
          text: `Saya memahami pertanyaan Anda tentang "${query}". Anda dapat mengecek menu **Kas** untuk iuran & laporan, menu **Layanan** untuk arisan & pinjaman modal, atau **Dompet** untuk saldo Tarunesha Pay.`,
          time: 'Baru saja',
        }
      }

      setIsTyping(false)
      setMessages(prev => [...prev, aiReply])
    }, 800)
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
            text: `✅ Pembayaran iuran berhasil diproses! Saldo dompet otomatis dipotong dan status tagihan sekarang Lunas.`,
            time: 'Baru saja',
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-notif-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ Saldo dompet Anda tidak cukup untuk membayar tagihan. Silakan top-up terlebih dahulu di menu Dompet.`,
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#F4F7F5] w-full max-w-md h-[88vh] sm:h-[650px] rounded-t-[32px] sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl animate-slide-up">
        
        {/* Header Asisten AI */}
        <div className="bg-gradient-to-r from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] px-5 py-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">TaruAI Asisten Pintar</h3>
                <span className="w-2 h-2 rounded-full bg-[#4DB87F] animate-pulse" />
              </div>
              <p className="text-[11px] text-white/80">AI Keuangan Komunitas Tarunesha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Quick Prompts Chips */}
        <div className="bg-white px-4 py-2.5 border-b border-[#E2EBE7] flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              className="px-3 py-1.5 rounded-full bg-[#EBF7F1] hover:bg-[#d8efe3] text-[#1A6B4A] text-xs font-bold whitespace-nowrap active:scale-95 transition-transform border border-[#1A6B4A]/15 flex-shrink-0"
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
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#1A6B4A] text-white rounded-tr-none'
                    : 'bg-white text-[#111F1A] border border-[#E2EBE7] rounded-tl-none'
                }`}
              >
                {/* Parse basic markdown bolding & newlines */}
                <div className="space-y-1">
                  {m.text.split('\n').map((line, li) => (
                    <p key={li} dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  ))}
                </div>

                {/* Optional Action Button inside Message */}
                {m.action && (
                  <div className="mt-3 pt-2.5 border-t border-[#E2EBE7]">
                    <button
                      onClick={() => handleAction(m.action)}
                      className="w-full py-2 px-3 bg-[#1A6B4A] hover:bg-[#237c56] text-white font-bold rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>⚡</span> {m.action.label}
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#8FA89E] mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {/* AI Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#8FA89E] bg-white border border-[#E2EBE7] px-3.5 py-2.5 rounded-2xl rounded-tl-none w-28">
              <span className="font-bold text-[#1A6B4A]">TaruAI</span>
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
        <div className="p-3 bg-white border-t border-[#E2EBE7]">
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
                placeholder="Tanya tagihan, pinjaman, kas..."
                value={inputPesan}
                onChange={e => setInputPesan(e.target.value)}
                className="w-full bg-transparent text-xs text-[#111F1A] focus:outline-none placeholder-[#8FA89E]"
              />
              <button
                type="button"
                onClick={() => handleSend('Berapa saldo kas Tarunesha saat ini?')}
                title="Input suara/speech recognition simulation"
                className="text-[#8FA89E] hover:text-[#1A6B4A] text-sm active:scale-90"
              >
                🎙️
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputPesan.trim()}
              className="w-10 h-10 rounded-2xl bg-[#1A6B4A] disabled:opacity-40 text-white flex items-center justify-center text-sm font-bold active:scale-90 transition-transform shadow-md"
            >
              ➤
            </button>
          </form>
          <p className="text-[10px] text-center text-[#8FA89E] mt-1.5">
            Didukung AI Pemahaman Keuangan Warga Tarunesha
          </p>
        </div>

      </div>
    </div>
  )
}
