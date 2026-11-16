import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronDown,
  MessageCircle,
  ShieldAlert,
} from 'lucide-react'
import Card from '../../components/Card'

const faqList = [
  {
    q: 'Apakah Patungan Bank adalah bank umum?',
    a: 'Bukan. Patungan Bank adalah aplikasi tata kelola keuangan gotong royong digital khusus warga Tarunesha. Sistem ini mengelola iuran wajib, tabungan sukarela, arisan, serta pinjaman mikro produktif secara transparan.'
  },
  {
    q: 'Bagaimana cara membayar iuran bulanan?',
    a: 'Anda dapat membayar iuran secara langsung melalui saldo Dompet Tarunesha Pay atau memindai kode QRIS dinamis yang disediakan di menu Kas.'
  },
  {
    q: 'Bagaimana arisan dikocok secara adil?',
    a: 'Arisan dikocok menggunakan algoritma acak transparan digital saat pertemuan rapat warga RT 05. Seluruh warga dapat melihat layar undian secara langsung.'
  },
  {
    q: 'Apa syarat mengajukan pinjaman modal?',
    a: 'Syarat utama adalah warga terdaftar RT 05, memiliki skor reputasi keaktifan minimal 70, mengisi formulir online, dan mencantumkan 1 warga penjamin.'
  },
  {
    q: 'Bagaimana jika ada warga yang tidak punya HP?',
    a: 'Pengurus menyediakan fitur Mode Bantuan Tunai, di mana bendahara dapat menerima uang tunai fisik dan langsung membukukannya ke akun warga terkait.'
  }
]

const kontakPengurus = [
  { nama: 'Bambang Sudarmono', peran: 'Ketua RT 05', no: '+62 812-9876-5432', wa: 'https://wa.me/6281298765432' },
  { nama: 'Dewi Lestari', peran: 'Bendahara Kas RT', no: '+62 813-1122-3344', wa: 'https://wa.me/6281311223344' },
]

export default function Bantuan() {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="no-scrollbar overflow-y-auto min-h-screen bg-[#F4F7F5] flex flex-col pt-12 pb-24">
      {/* Header */}
      <div className="bg-white px-5 py-4 border-b border-[#E2EBE7] flex items-center gap-3 sticky top-0 z-10 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="text-[#1A6B4A] active:scale-95 transition-transform"
          title="Kembali"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Pusat Bantuan & FAQ</h1>
      </div>

      <div className="p-4 space-y-5">
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#1A6B4A] to-[#2D8B63] rounded-2xl p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-1">Butuh Panduan?</p>
          <h2 className="text-lg font-extrabold">Bantuan & Layanan Anggota</h2>
          <p className="text-xs text-white/85 mt-1 leading-relaxed">
            Temukan jawaban seputar iuran, pinjaman modal kerja, dan tata kelola kas Tarunesha.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-3 px-1">Pertanyaan Sering Diajukan</p>
          <Card className="divide-y divide-[#E2EBE7]">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx
              return (
                <div key={idx} className="p-4">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-3"
                  >
                    <span className="text-sm font-bold text-[#111F1A]">{item.q}</span>
                    <span className={`text-sm text-[#1A6B4A] transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 stroke-[2]" />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs text-[#4A6358] mt-2.5 leading-relaxed bg-[#F4F7F5] p-3 rounded-xl">
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </Card>
        </div>

        {/* Kontak Pengurus */}
        <div>
          <p className="text-[11px] font-bold text-[#4A6358] uppercase tracking-widest mb-3 px-1">Kontak Pengurus Tarunesha</p>
          <div className="space-y-2">
            {kontakPengurus.map((p, i) => (
              <Card key={i} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111F1A]">{p.nama}</p>
                  <p className="text-xs text-[#8FA89E]">{p.peran}</p>
                  <p className="text-xs text-[#1A6B4A] font-semibold mt-1">{p.no}</p>
                </div>
                <a
                  href={p.wa}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] text-white text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2]" />
                  <span>WhatsApp</span>
                </a>
              </Card>
            ))}
          </div>
        </div>

        {/* Disclaimer Hukum */}
        <div className="bg-[#FEF3DC] border border-[#F5A623]/30 rounded-2xl p-4 text-xs text-[#7A5000] leading-relaxed">
          <strong className="block mb-1 text-sm flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 stroke-[2] text-[#7A5000]" />
            Pemberitahuan Hukum Penting
          </strong>
          Patungan Bank bukan bank umum atau lembaga keuangan yang diawasi oleh Otoritas Jasa Keuangan (OJK). Seluruh simpanan dan pembiayaan dikelola secara internal oleh dan untuk warga komunitas Tarunesha berlandaskan asas musyawarah gotong royong.
        </div>
      </div>
    </div>
  )
}
