import { NavLink } from 'react-router-dom'

const menu = [
  { to: '/',        icon: { off: '⌂',  on: '🏠' }, label: 'Beranda'  },
  { to: '/kas',     icon: { off: '📋', on: '💰' }, label: 'Kas'      },
  { to: '/layanan', icon: { off: '◈',  on: '🛠️' }, label: 'Layanan'  },
  { to: '/dompet',  icon: { off: '👝', on: '👛' }, label: 'Dompet'   },
  { to: '/profil',  icon: { off: '○',  on: '👤' }, label: 'Profil'   },
]

export default function BottomNav() {
  return (
    <nav className="w-full z-40 bg-white/95 backdrop-blur-md border-t border-[#E2EBE7] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex-shrink-0">
      <div className="w-full grid grid-cols-5 pt-2 pb-3.5 sm:pb-3 px-1">
        {menu.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end={m.to === '/'}
            className={({ isActive }) =>
              `py-0.5 flex flex-col items-center gap-0.5 transition-all relative ${
                isActive ? 'text-[#1A6B4A]' : 'text-[#8FA89E]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-xl transition-all duration-200 ${
                    isActive
                      ? 'scale-110 drop-shadow-sm'
                      : 'scale-100 opacity-70'
                  }`}
                >
                  {m.icon.on}
                </span>
                <span
                  className={`text-[10px] font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-[#1A6B4A] font-bold' : 'text-[#8FA89E]'
                  }`}
                >
                  {m.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1.5 w-6 h-0.5 bg-[#1A6B4A] rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
