import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-hidden relative">
      {/* ── SCROLLABLE PAGE CONTENT (ONLY MAIN SCROLLS) ── */}
      <main key={pathname} className="flex-1 overflow-y-auto no-scrollbar page-enter pb-6">
        <Outlet />
      </main>

      {/* ── PINNED BOTTOM NAVIGATION (ALWAYS VISIBLE AT ALL TIMES) ── */}
      <BottomNav />
    </div>
  )
}
