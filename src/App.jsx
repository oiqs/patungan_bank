import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Kas from './pages/Kas'
import Layanan from './pages/Layanan'
import Dompet from './pages/Dompet'
import Profil from './pages/Profil'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/kas" element={<Kas />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/dompet" element={<Dompet />} />
        <Route path="/profil" element={<Profil />} />
      </Route>
    </Routes>
  )
}