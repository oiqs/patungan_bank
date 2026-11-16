import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

const ROOT_TABS = ['/', '/kas', '/layanan', '/dompet', '/profil']

export default function Layout() {
  const { pathname } = useLocation()
  const showBottomNav = ROOT_TABS.includes(pathname)

  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-hidden relative">
      {/* ── SCROLLABLE PAGE CONTENT (ONLY MAIN SCROLLS) ── */}
      <main key={pathname} className="flex-1 overflow-y-auto no-scrollbar page-enter">
        <Outlet />
      </main>

      {/* ── PINNED BOTTOM NAVIGATION (HANYA DI 5 TAB UTAMA) ── */}
      {showBottomNav && <BottomNav />}
    </div>
  )
}
