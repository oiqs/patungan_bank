import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-24">
            <header className="sticky top-0 bg-emerald-800 text-white px-4 py-3 font-bold">
                Patungan Bank
            </header>
            <main className="p-4">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    )
}