export default function NailongAvatar({ className = "w-8 h-8", animated = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-sm ${animated ? 'animate-bounce' : ''}`}
      >
        <defs>
          {/* Gradien Tubuh Nailong (Kuning Hangat Khas Nailong) */}
          <linearGradient id="nailongYellow" x1="50" y1="12" x2="50" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFE054" />
            <stop offset="60%" stopColor="#FFC820" />
            <stop offset="100%" stopColor="#F5B208" />
          </linearGradient>

          {/* Gradien Tanduk Oranye Lembut */}
          <linearGradient id="nailongHorn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF8B1F" />
            <stop offset="100%" stopColor="#FFAE33" />
          </linearGradient>

          {/* Gradien Bayangan Pipi */}
          <radialGradient id="nailongBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B7A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF6B7A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── TANDUK KIRI NAILONG ── */}
        <path
          d="M 33 26 C 26 13, 38 6, 42 19 Z"
          fill="url(#nailongHorn)"
          stroke="#E69000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ── TANDUK KANAN NAILONG ── */}
        <path
          d="M 67 26 C 74 13, 62 6, 58 19 Z"
          fill="url(#nailongHorn)"
          stroke="#E69000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* ── KEPALA GULANG & PIPI GEMOY NAILONG (PEAR SHAPE) ── */}
        <path
          d="M 50 16 
             C 72 16, 84 28, 85 45 
             C 86 60, 88 66, 82 76 
             C 76 86, 65 91, 50 91 
             C 35 91, 24 86, 18 76 
             C 12 66, 14 60, 15 45 
             C 16 28, 28 16, 50 16 Z"
          fill="url(#nailongYellow)"
          stroke="#E5A600"
          strokeWidth="2.2"
        />

        {/* Highlight Kilau Lembut di Dahi */}
        <ellipse cx="50" cy="24" rx="20" ry="6" fill="#FFF294" opacity="0.6" />

        {/* ── ALIS MATA GEMOY ── */}
        <path d="M 30 38 Q 36 34 42 37" stroke="#8C5800" strokeWidth="2" strokeLinecap="round" />
        <path d="M 58 37 Q 64 34 70 38" stroke="#8C5800" strokeWidth="2" strokeLinecap="round" />

        {/* ── MATA KIRI (BESAR & BERSINAR) ── */}
        <ellipse cx="36" cy="48" rx="7" ry="9" fill="#1A1814" />
        <circle cx="34" cy="44.5" r="3.2" fill="#FFFFFF" />
        <circle cx="38" cy="51" r="1.3" fill="#FFFFFF" />

        {/* ── MATA KANAN (BESAR & BERSINAR) ── */}
        <ellipse cx="64" cy="48" rx="7" ry="9" fill="#1A1814" />
        <circle cx="62" cy="44.5" r="3.2" fill="#FFFFFF" />
        <circle cx="66" cy="51" r="1.3" fill="#FFFFFF" />

        {/* ── HIDUNG (DUA TITIK IMUT) ── */}
        <circle cx="47" cy="53.5" r="1.2" fill="#A86B00" />
        <circle cx="53" cy="53.5" r="1.2" fill="#A86B00" />

        {/* ── PIPI MERONA MERAH MUDA (BLUSH ON) ── */}
        <ellipse cx="23" cy="59" rx="6.5" ry="4.2" fill="url(#nailongBlush)" />
        <ellipse cx="77" cy="59" rx="6.5" ry="4.2" fill="url(#nailongBlush)" />

        {/* ── SENYUM CERIA DENGAN LIDAH GEMOY ── */}
        {/* Mulut luar */}
        <path
          d="M 41 58 Q 50 71 59 58 Z"
          fill="#8A1723"
          stroke="#5C0D16"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Lidah pink */}
        <path
          d="M 44.5 63 Q 50 59 55.5 63 Q 50 70 44.5 63 Z"
          fill="#FF7E98"
        />

        {/* Garis bibir atas */}
        <path
          d="M 39 58 Q 45 61 50 58 Q 55 61 61 58"
          stroke="#7A4D00"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
