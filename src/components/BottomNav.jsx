import { NavLink } from 'react-router-dom'

const menu = [
    { to: '/', icon: '🏠', label: 'Beranda' },
    { to: '/kas', icon: '📒', label: 'Kas' },
    { to: '/layanan', icon: '🧰', label: 'Layanan' },
    { to: '/dompet', icon: '👛', label: 'Dompet' },
    { to: '/profil', icon: '👤', label: 'Profil' },
]

export default function BottomNav() {
    return (
        <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200">
            <div className="max-w-md mx-auto grid grid-cols-5">
                {menu.map((m) => (
                    <NavLink
                        key={m.to}
                        to={m.to}
                        end={m.to === '/'}
                        className={({ isActive }) =>
                            `py-2 text-xs flex flex-col items-center ${isActive ? 'text-emerald-700 font-bold' : 'text-gray-500'
                            }`
                        }
                    >
                        <span className="text-xl">{m.icon}</span>
                        {m.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}