import { NavLink } from 'react-router-dom'
import { Home, Landmark, Handshake, Wallet, User } from 'lucide-react'

const menu = [
  { to: '/',        icon: Home,      label: 'Beranda' },
  { to: '/kas',     icon: Landmark,  label: 'Kas RT'  },
  { to: '/layanan', icon: Handshake, label: 'Layanan' },
  { to: '/dompet',  icon: Wallet,    label: 'Dompet'  },
  { to: '/profil',  icon: User,      label: 'Profil'  },
]

export default function BottomNav() {
  return (
    <nav className="w-full z-40 bg-white border-t border-[#E2EBE7] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex-shrink-0">
      <div className="w-full grid grid-cols-5 pt-2 pb-2.5 sm:pb-3 px-1">
        {menu.map((m) => {
          const Icon = m.icon
          return (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 transition-all group ${
                  isActive ? 'text-[#1A6B4A]' : 'text-[#4A6358] hover:text-[#1A6B4A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-[22px] h-[22px] transition-transform duration-200 ${
                      isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.9]'
                    }`}
                  />
                  <span
                    className={`text-[11px] mt-1 tracking-tight transition-colors ${
                      isActive ? 'font-bold text-[#1A6B4A]' : 'font-medium text-[#4A6358]'
                    }`}
                  >
                    {m.label}
                  </span>
                  <div className="h-[3px] flex items-center justify-center mt-0.5">
                    {isActive ? (
                      <span className="w-5 h-[3px] bg-[#1A6B4A] rounded-full transition-all" />
                    ) : (
                      <span className="w-5 h-[3px] bg-transparent" />
                    )}
                  </div>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
