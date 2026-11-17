import { Routes, Route } from 'react-router-dom'
import PhoneMockup from './components/PhoneMockup'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'

// auth pages
import Splash from './pages/auth/Splash'
import InitialScreen from './pages/auth/InitialScreen'
import Daftar from './pages/auth/Daftar'
import OTP from './pages/auth/OTP'
import BuatPIN from './pages/auth/BuatPIN'
import Login from './pages/auth/Login'

// main pages
import Beranda from './pages/Beranda'
import Kas from './pages/Kas'
import Layanan from './pages/Layanan'
import Dompet from './pages/Dompet'
import Profil from './pages/Profil'

// kas pages
import PembayaranQRIS from './pages/kas/PembayaranQRIS'
import BuktiPembayaran from './pages/kas/BuktiPembayaran'
import LaporanKas from './pages/kas/LaporanKas'

// layanan pages
import Arisan from './pages/layanan/Arisan'
import Kegiatan from './pages/layanan/Kegiatan'
import AjukanPinjaman from './pages/layanan/AjukanPinjaman'

// dompet pages
import TopUp from './pages/dompet/TopUp'
import ScanQRIS from './pages/dompet/ScanQRIS'

// profil & notifikasi pages
import Keamanan from './pages/profil/Keamanan'
import Bantuan from './pages/profil/Bantuan'
import SkorSaya from './pages/profil/SkorSaya'
import Notifikasi from './pages/notifikasi/Notifikasi'

// ai assistant page
import AsistenAI from './pages/ai/AsistenAI'

// pengurus pages
import PanelPengurus from './pages/pengurus/PanelPengurus'
import KelolaAnggota from './pages/pengurus/KelolaAnggota'
import InputKasKeluar from './pages/pengurus/InputKasKeluar'
import BantuanTunai from './pages/pengurus/BantuanTunai'

export default function App() {
  return (
    <ErrorBoundary>
      <PhoneMockup>
        <Routes>
          {/* Tampilan Awal Logo & Branding Aplikasi */}
          <Route path="/" element={<InitialScreen />} />

          {/* Auth - tanpa BottomNav */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/daftar" element={<Daftar />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/buat-pin" element={<BuatPIN />} />
          <Route path="/login" element={<Login />} />

          {/* Main Pages - dengan Layout & BottomNav */}
          <Route element={<Layout />}>
            {/* Core BottomNav Tabs */}
            <Route path="/beranda" element={<Beranda />} />
            <Route path="/kas" element={<Kas />} />
            <Route path="/layanan" element={<Layanan />} />
            <Route path="/dompet" element={<Dompet />} />
            <Route path="/profil" element={<Profil />} />

            {/* AI Assistant Dedicated Page */}
            <Route path="/ai-asisten" element={<AsistenAI />} />

            {/* Kas Subpages */}
            <Route path="/kas/qris" element={<PembayaranQRIS />} />
            <Route path="/kas/bukti" element={<BuktiPembayaran />} />
            <Route path="/kas/laporan" element={<LaporanKas />} />

            {/* Layanan Subpages */}
            <Route path="/layanan/arisan" element={<Arisan />} />
            <Route path="/layanan/kegiatan" element={<Kegiatan />} />
            <Route path="/layanan/ajukan-pinjaman" element={<AjukanPinjaman />} />

            {/* Dompet Subpages */}
            <Route path="/dompet/topup" element={<TopUp />} />
            <Route path="/dompet/scan" element={<ScanQRIS />} />

            {/* Profil & Notifikasi Subpages */}
            <Route path="/profil/keamanan" element={<Keamanan />} />
            <Route path="/profil/bantuan" element={<Bantuan />} />
            <Route path="/profil/skor" element={<SkorSaya />} />
            <Route path="/notifikasi" element={<Notifikasi />} />

            {/* Panel Pengurus Subpages */}
            <Route path="/pengurus" element={<PanelPengurus />} />
            <Route path="/pengurus/anggota" element={<KelolaAnggota />} />
            <Route path="/pengurus/kas-keluar" element={<InputKasKeluar />} />
            <Route path="/pengurus/bantuan-tunai" element={<BantuanTunai />} />
          </Route>
        </Routes>
      </PhoneMockup>
    </ErrorBoundary>
  )
}
