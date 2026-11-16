import { NavLink } from 'react-router-dom'
import { Home, Landmark, Handshake, Wallet, User } from 'lucide-react'

const menu = [
  { to: '/',        icon: Home,      label: 'Beranda' },
  { to: '/kas',     icon: Landmark,  label: 'Kas RT' },
  { to: '/layanan', icon: Handshake, label: 'Layanan' },
  { to: '/dompet',  icon: Wallet,    label: 'Dompet' },
  { to: '/profil',  icon: User,      label: 'Profil' },
]

export default function BottomNav() {
  return (
    <nav className="w-full z-40 bg-white border-t border-[#E2EBE7] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex-shrink-0">
      <div className="w-full grid grid-cols-5 pt-2 pb-3 sm:pb-2.5 px-1">
        {menu.map((m) => {
          const Icon = m.icon
          return (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === '/'}
              className={({ isActive }) =>
                `py-1 flex flex-col items-center justify-center gap-1 transition-all relative ${
                  isActive ? 'text-[#1A6B4A]' : 'text-[#5F7A6E] hover:text-[#1A6B4A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={`transition-transform duration-150 ${
                      isActive ? 'scale-110 drop-shadow-xs' : 'scale-100'
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors leading-none ${
                      isActive ? 'font-bold text-[#1A6B4A]' : 'font-medium text-[#5F7A6E]'
                    }`}
                  >
                    {m.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-6 h-1 bg-[#1A6B4A] rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
