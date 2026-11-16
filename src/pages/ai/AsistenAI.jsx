import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { rp } from '../../lib/format'
import Button from '../../components/Button'
import NailongAvatar from '../../components/NailongAvatar'
import { useBankStore } from '../../store/useBankStore'
import { ArrowLeft, Send, Mic, Sparkles } from 'lucide-react'

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
      text: `Halo Pak/Bu ${currentUser.nama}! 👋 Aku patuAI, asisten keuangan digital warga Tarunesha. Aku siap membantu mengecek tagihan iuran, simulasi pinjaman modal, kas RT, atau jadwal undian arisan.`,
      time: '12:00',
    }
  ])

  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const quickPrompts = [
    { label: 'Status Iuran Saya', query: 'Apakah iuran wajib saya sudah lunas?' },
    { label: 'Uang Kas RT', query: 'Berapa saldo kas Tarunesha saat ini?' },
    { label: 'Simulasi Pinjaman', query: 'Berapa cicilan pinjaman modal tani Rp 1.500.000?' },
    { label: 'Undian Arisan', query: 'Berapa total pot arisan bulan ini?' },
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
              label: 'Bayar Sekarang via Dompet',
            },
            time: 'Baru saja',
          }
        } else {
          aiReply = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `Alhamdulillah! Seluruh tagihan iuran wajib Anda telah **Lunas**. Terima kasih atas komitmen gotong royongnya! ⭐`,
            time: 'Baru saja',
          }
        }
      } else if (lower.includes('kas') || lower.includes('saldo rt') || lower.includes('keuangan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Ringkasan Uang Kas RT Tarunesha hari ini:\n• **Saldo Kas Bersih:** ${rp(kasSaldo)}\n• **Pemasukan Bulan Ini:** +${rp(kasBulanIniMasuk)}\n• **Pengeluaran Nota:** -${rp(kasBulanIniKeluar)}\n\nLaporan keuangan lengkap dapat diawasi terbuka oleh seluruh warga.`,
          action: {
            type: 'link',
            url: '/kas',
            label: 'Buka Buku Kas & Laporan',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('pinjam') || lower.includes('modal') || lower.includes('tani') || lower.includes('cicilan')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Skor reputasi Anda adalah **${currentUser.skor}/100** (Plafon: ${rp(currentUser.plafonTersedia)}).\n\nSimulasi pinjaman Rp 1.500.000 tenor 6 bulan:\n• Biaya gotong royong: 1.5%/bulan\n• Estimasi cicilan: **Rp 272.500 / bulan**.\nPengajuan mudah tanpa jaminan sertifikat.`,
          action: {
            type: 'link',
            url: '/layanan/ajukan-pinjaman',
            label: 'Buka Formulir Pembiayaan',
          },
          time: 'Baru saja',
        }
      } else if (lower.includes('arisan') || lower.includes('pot') || lower.includes('kocok')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Informasi **${arisan.judul}**:\n• Periode: ${arisan.periode}\n• Total Pot Terkumpul: **${rp(arisan.pot)}**\n• Pemenang sebelumnya: ${arisan.riwayatPemenang[0]?.nama || 'Dewi Lestari'}\n\nUndian transparan dikocok bersama pengurus warga!`,
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
          text: `Aku mengerti pertanyaan seputar "${query}". Anda dapat membuka menu **Kas RT** untuk iuran dan laporan, **Layanan** untuk arisan & pembiayaan, atau **Dompet** untuk saldo Anda.`,
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
            text: `✅ Pembayaran tagihan berhasil! Saldo dompet Anda telah dipotong dan iuran tercatat lunas.`,
            time: 'Baru saja',
          }
        ])
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-notif-${Date.now()}`,
            sender: 'ai',
            text: `⚠️ Saldo dompet tidak mencukupi. Silakan lakukan Top-Up dompet terlebih dahulu.`,
            time: 'Baru saja',
          }
        ])
      }
    } else if (action.type === 'link') {
      navigate(action.url)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#F4F7F5] overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E2EBE7] flex items-center gap-2 flex-shrink-0 pt-12">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#1A6B4A] hover:bg-[#E6F4EE] active:scale-95 transition-all"
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[#111F1A] font-bold text-base leading-tight">patuAI Asisten</h1>
            <span className="text-xs font-bold bg-[#E6F4EE] text-[#1A6B4A] px-2.5 py-0.5 rounded-full">
              Online
            </span>
          </div>
          <p className="text-xs text-[#5F7A6E]">Asisten Keuangan Warga Tarunesha</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#FEF3DC] border border-[#F5A623]/30 flex items-center justify-center p-1 flex-shrink-0">
          <NailongAvatar className="w-7 h-7" animated />
        </div>
      </div>

      {/* Prompts Bar */}
      <div className="bg-white px-4 py-2.5 border-b border-[#E2EBE7] flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
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

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto no-scrollbar">
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
                  <Button
                    full
                    size="md"
                    variant="primary"
                    onClick={() => handleAction(m.action)}
                  >
                    <Sparkles size={16} /> {m.action.label}
                  </Button>
                </div>
              )}
            </div>
            <span className="text-xs text-[#5F7A6E] mt-1 px-1">{m.time}</span>
          </div>
        ))}

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

      {/* Input Form at bottom */}
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
              placeholder="Ketik pertanyaan untuk patuAI..."
              value={inputPesan}
              onChange={e => setInputPesan(e.target.value)}
              className="w-full bg-transparent text-base text-[#111F1A] focus:outline-none placeholder-[#5F7A6E]"
            />
            <button
              type="button"
              onClick={() => handleSend('Cek status iuran saya bulan ini')}
              title="Input Suara"
              className="w-9 h-9 flex items-center justify-center text-[#5F7A6E] hover:text-[#1A6B4A] active:scale-90"
            >
              <Mic size={18} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputPesan.trim()}
            className="w-12 h-12 rounded-2xl bg-[#1A6B4A] disabled:opacity-40 text-white flex items-center justify-center font-bold active:scale-95 transition-transform shadow-xs flex-shrink-0"
            aria-label="Kirim"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
