import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sprout, Smartphone } from 'lucide-react'
import { useBankStore } from '../store/useBankStore'
import AIAssistantModal from './AIAssistantModal'
import NailongAvatar from './NailongAvatar'

export default function PhoneMockup({ children }) {
  const [useFrame, setUseFrame] = useState(true)
  const [currentTime, setCurrentTime] = useState('09:41')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAiModalOpen, openAiModal, closeAiModal } = useBankStore()

  const isDedicatedAiPage = pathname === '/ai-asisten'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#DDE4E0] flex flex-col items-center justify-center p-0 sm:py-6 sm:px-4 transition-colors">
      
      {/* Top Floating Bar on Desktop (Tools & Toggle) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-2 px-2 text-xs text-[#4A6358]">
        <div className="flex items-center gap-1.5 font-bold text-[#1A6B4A]">
          <Sprout className="w-4 h-4 stroke-[2.2]" />
          <span>Patungan Bank</span>
        </div>
        <button
          onClick={() => setUseFrame(prev => !prev)}
          className="bg-white/80 hover:bg-white border border-[#C0CCC8] px-3 py-1 rounded-full text-[11px] font-semibold text-[#111F1A] active:scale-95 transition-all shadow-sm flex items-center gap-1.5"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#1A6B4A] stroke-[2]" />
          <span>{useFrame ? 'Sembunyikan Cover' : 'Tampilkan Cover'}</span>
        </button>
      </div>

      {/* Main Container: When on desktop with frame ON, wraps in realistic iPhone chassis */}
      {useFrame ? (
        <div className="relative group">

          {/* ════ PHYSICAL PHONE HARDWARE BUTTONS (LEFT) ════ */}
          <div className="hidden sm:block absolute -left-[3px] top-[115px] w-[3px] h-[28px] bg-[#2E3130] rounded-l-[2px] shadow-sm" /> {/* Action Button */}
          <div className="hidden sm:block absolute -left-[3px] top-[160px] w-[3px] h-[50px] bg-[#2E3130] rounded-l-[2px] shadow-sm" /> {/* Volume Up */}
          <div className="hidden sm:block absolute -left-[3px] top-[225px] w-[3px] h-[50px] bg-[#2E3130] rounded-l-[2px] shadow-sm" /> {/* Volume Down */}

          {/* ════ PHYSICAL PHONE HARDWARE BUTTON (RIGHT) ════ */}
          <div className="hidden sm:block absolute -right-[3px] top-[170px] w-[3px] h-[75px] bg-[#2E3130] rounded-r-[2px] shadow-sm" /> {/* Power / Side Button */}

          {/* ════ IPHONE TITANIUM OUTER CASING ════ */}
          <div className="w-full sm:w-[396px] sm:rounded-[56px] p-0 sm:p-[12px] bg-gradient-to-b from-[#4A4D4C] via-[#2A2C2B] to-[#1E201F] shadow-none sm:shadow-[0_25px_70px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.1)_inset] transition-all relative">

            {/* Inner Dark Bezel */}
            <div className="w-full sm:rounded-[46px] overflow-hidden bg-black relative sm:border-[3px] sm:border-[#0E100F] flex flex-col">

              {/* Speaker Earpiece Slot (Micro Line) */}
              <div className="hidden sm:block absolute top-[6px] left-1/2 -translate-x-1/2 w-[54px] h-[3.5px] bg-[#161716] rounded-full z-40 border border-[#252827]/40" />

              {/* ════ IPHONE TOP STATUS BAR & DYNAMIC ISLAND ════ */}
              <div className="absolute top-0 inset-x-0 h-[48px] z-30 pointer-events-none flex items-center justify-between px-7 pt-1">
                
                {/* Clock (Left) */}
                <span className="text-[14px] font-semibold text-[#111F1A] dark:text-white tracking-tight drop-shadow-sm select-none">
                  {currentTime}
                </span>

                {/* ── DYNAMIC ISLAND (CENTER) ── */}
                <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[114px] h-[32px] bg-black rounded-full flex items-center justify-between px-3 shadow-md pointer-events-auto cursor-pointer border border-[#222]/30">
                  {/* Front Camera Lens */}
                  <div className="w-[10px] h-[10px] rounded-full bg-[#0a0d14] border border-[#1b253b]/80 relative flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rounded-full bg-[#1e3a5f]/60" />
                  </div>
                  {/* Sensor Dot */}
                  <div className="w-[8px] h-[8px] rounded-full bg-[#080808]" />
                </div>

                {/* Status Icons (Right): Cellular, WiFi, Battery */}
                <div className="flex items-center gap-1.5 text-[#111F1A] dark:text-white drop-shadow-sm select-none">
                  {/* Cellular 4 bars */}
                  <svg className="w-4 h-3.5 fill-current" viewBox="0 0 17 12">
                    <rect x="0" y="9" width="2.5" height="3" rx="0.8" />
                    <rect x="4" y="6" width="2.5" height="6" rx="0.8" />
                    <rect x="8" y="3" width="2.5" height="9" rx="0.8" />
                    <rect x="12" y="0" width="2.5" height="12" rx="0.8" />
                  </svg>

                  {/* WiFi */}
                  <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
                    <path d="M8 2.5C10.6 2.5 12.9 3.6 14.6 5.3L16 3.9C13.9 1.8 11.1 0.5 8 0.5C4.9 0.5 2.1 1.8 0 3.9L1.4 5.3C3.1 3.6 5.4 2.5 8 2.5ZM8 6.5C9.6 6.5 11.1 7.2 12.1 8.2L13.5 6.8C12.1 5.4 10.1 4.5 8 4.5C5.9 4.5 3.9 5.4 2.5 6.8L3.9 8.2C4.9 7.2 6.4 6.5 8 6.5ZM8 10C8.8 10 9.5 10.7 9.5 11.5C9.5 12.3 8.8 13 8 13C7.2 13 6.5 12.3 6.5 11.5C6.5 10.7 7.2 10 8 10Z" />
                  </svg>

                  {/* Battery with Tip */}
                  <div className="flex items-center">
                    <div className="w-[22px] h-[11px] rounded-[3.5px] border-[1.5px] border-current p-[1.5px] flex items-center">
                      <div className="w-full h-full bg-current rounded-[1.5px]" />
                    </div>
                    <div className="w-[1.5px] h-[4px] bg-current rounded-r-[1px] -ml-[0.5px]" />
                  </div>
                </div>

              </div>

              {/* ════ SCREEN CONTENT (The App Itself - FIXED HEIGHT & FLEX CONTAINER) ════ */}
              <div className="w-full h-[100dvh] sm:h-[780px] bg-[#F4F7F5] relative select-text flex flex-col overflow-hidden">
                {children}

                {/* ════ ELEVATED FLOATING patuAI BUTTON (ALWAYS PINNED ABOVE BOTTOM NAV) ════ */}
                {!isDedicatedAiPage && (
                  <button
                    onClick={openAiModal}
                    className="absolute bottom-[80px] right-3.5 z-50 bg-gradient-to-r from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] text-white pl-2.5 pr-3.5 py-2 rounded-full shadow-[0_8px_25px_rgba(26,107,74,0.45)] flex items-center gap-1.5 text-xs font-bold active:scale-90 transition-all border border-white/30 backdrop-blur-sm hover:scale-105"
                    title="Buka Asisten Pintar patuAI"
                  >
                    <NailongAvatar className="w-5 h-5" animated />
                    <span className="tracking-wide">patuAI</span>
                    <span className="w-2 h-2 rounded-full bg-[#4DB87F] shadow-[0_0_8px_#4DB87F]" />
                  </button>
                )}
              </div>

              {/* ════ IPHONE HOME INDICATOR (BOTTOM BAR) ════ */}
              <div className="hidden sm:flex absolute bottom-[3px] inset-x-0 h-[10px] z-50 pointer-events-none items-center justify-center">
                <div className="w-[130px] h-[4px] bg-[#111F1A]/70 dark:bg-white/70 rounded-full backdrop-blur-sm" />
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* Full width mode without mockup frame */
        <div className="w-full max-w-md h-[100dvh] bg-[#F4F7F5] shadow-xl relative flex flex-col overflow-hidden">
          {children}

          {!isDedicatedAiPage && (
            <button
              onClick={openAiModal}
              className="absolute bottom-[80px] right-3.5 z-50 bg-gradient-to-r from-[#0D4A33] via-[#1A6B4A] to-[#2D8B63] text-white pl-2.5 pr-3.5 py-2 rounded-full shadow-[0_8px_25px_rgba(26,107,74,0.45)] flex items-center gap-1.5 text-xs font-bold active:scale-90 transition-all border border-white/30 backdrop-blur-sm hover:scale-105"
            >
              <NailongAvatar className="w-5 h-5" animated />
              <span>patuAI</span>
              <span className="w-2 h-2 rounded-full bg-[#4DB87F] shadow-[0_0_8px_#4DB87F]" />
            </button>
          )}
        </div>
      )}

      {/* Global AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={closeAiModal}
      />

    </div>
  )
}
