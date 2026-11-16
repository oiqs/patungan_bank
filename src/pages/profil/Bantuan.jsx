import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import { ArrowLeft, ChevronDown, MessageSquare, Phone } from 'lucide-react'

const faqList = [
  {
    q: 'Apakah Patungan Bank adalah bank umum?',
    a: 'Bukan. Patungan Bank adalah aplikasi tata kelola keuangan gotong royong digital khusus warga Tarunesha RT 05. Sistem ini mengelola iuran wajib, tabungan sukarela, arisan, serta pinjaman modal kerja mikro secara transparan.'
  },
  {
    q: 'Bagaimana jika warga belum memiliki smartphone atau rekening bank?',
    a: 'Pengurus menyediakan Mode Bantuan Tunai. Warga dapat menyetorkan uang tunai saat pertemuan RT atau pos ronda, dan Bendahara akan mencatatnya ke dalam sistem secara real-time.'
  },
  {
    q: 'Bagaimana cara kerja undian arisan digital?',
    a: 'Sistem pengundian arisan menggunakan algoritma acak transparan yang dapat disaksikan bersama oleh seluruh anggota saat pertemuan atau lewat layar aplikasi. Hasil tersimpan secara permanen di riwayat pemenang.'
  },
  {
    q: 'Apa syarat mengajukan pembiayaan pertanian atau perikanan?',
    a: 'Anggota memiliki Skor Kelayakan minimal 70 poin, aktif membayar iuran rutin tanpa tunggakan lebih dari 1 bulan, menyertakan tujuan penggunaan modal, serta memiliki penjamin sesama anggota warga.'
  },
  {
    q: 'Apakah ada potongan atau biaya admin transaksi?',
    a: 'Tidak ada biaya admin untuk pembayaran iuran dan arisan sesama anggota. Pembayaran via QRIS mengikuti ketentuan standar QRIS Bank Indonesia.'
  }
]

const kontakPengurus = [
  { nama: 'H. Bambang Sujatmiko (Ketua RT)', peran: 'Persetujuan & Kebijakan', no: '+62 811-2233-4455' },
  { nama: 'Siti Rahayu, S.E. (Bendahara)', peran: 'Verifikasi & Bantuan Tunai', no: '+62 812-9876-5432' },
  { nama: 'Hendra Pratama, S.Kom. (Sekretaris)', peran: 'Keanggotaan & Data Rapat', no: '+62 813-4567-8901' },
]

export default function Bantuan() {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(0)

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
        <h1 className="text-[#111F1A] font-bold text-base flex-1">Pusat Bantuan &amp; FAQ</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Banner Solid */}
        <div className="bg-[#1A6B4A] rounded-2xl p-5 text-white shadow-xs">
          <p className="text-xs uppercase tracking-wider text-white/90 font-bold mb-1">Pusat Informasi</p>
          <h2 className="text-lg font-black">Bantuan Warga Tarunesha</h2>
          <p className="text-sm text-white/90 mt-1 leading-relaxed">
            Temukan panduan lengkap seputar pembayaran iuran, pinjaman modal gotong royong, dan arisan warga.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">Pertanyaan Umum (FAQ)</h3>
          <Card className="divide-y divide-[#E2EBE7]">
            {faqList.map((item, idx) => {
              const isOpen = openIndex === idx
              return (
                <div key={idx} className="p-4">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left gap-3"
                  >
                    <span className="font-bold text-sm text-[#111F1A]">{item.q}</span>
                    <span className={`text-[#1A6B4A] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-sm text-[#456355] mt-2.5 leading-relaxed pt-1">
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </Card>
        </div>

        {/* Kontak Pengurus RT */}
        <div>
          <h3 className="text-sm font-bold text-[#111F1A] mb-2 px-1">Kontak Pengurus RT 05</h3>
          <div className="space-y-2.5">
            {kontakPengurus.map((k, i) => (
              <Card key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#111F1A]">{k.nama}</p>
                  <p className="text-xs text-[#5F7A6E] mt-0.5">{k.peran}</p>
                  <p className="text-xs font-mono text-[#1A6B4A] font-bold mt-1">{k.no}</p>
                </div>
                <a
                  href={`https://wa.me/${k.no.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-[#E6F4EE] text-[#1A6B4A] rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
                >
                  <MessageSquare size={14} /> WhatsApp
                </a>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-xs text-[#5F7A6E] text-center px-4 leading-relaxed pt-2">
          Patungan Bank bukan lembaga perbankan komersial. Seluruh simpanan dan pembiayaan dikelola bersama oleh dan untuk warga komunitas Tarunesha berlandaskan asas musyawarah.
        </p>
      </div>
    </div>
  )
}
