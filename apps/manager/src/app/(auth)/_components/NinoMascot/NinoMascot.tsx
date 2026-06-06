import type { NinoMascotProps } from './NinoMascot.types'

export function NinoMascot({ className }: NinoMascotProps) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Mascote Nino"
    >
      <defs>
        <radialGradient id="ninoBody" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </radialGradient>
        <radialGradient id="ninoBelly" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F5F5" />
        </radialGradient>
        <filter id="ninoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#00000015" />
        </filter>
      </defs>

      <path
        d="M215 240 Q265 210 258 165 Q252 130 228 145 Q218 152 222 168 Q228 188 210 200"
        stroke="#1A1A2E"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M222 168 Q228 188 210 200"
        stroke="#2D2D4E"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      <ellipse
        cx="148"
        cy="200"
        rx="72"
        ry="68"
        fill="url(#ninoBody)"
        filter="url(#ninoShadow)"
      />
      <ellipse
        cx="148"
        cy="210"
        rx="38"
        ry="44"
        fill="url(#ninoBelly)"
        opacity="0.9"
      />
      <path
        d="M148 172 Q148 220 148 248"
        stroke="#E0E0E0"
        strokeWidth="1"
        opacity="0.5"
      />

      <path d="M88 88 Q68 42 95 30 Q110 55 118 78 Z" fill="#1A1A2E" />
      <path
        d="M92 82 Q76 50 96 40 Q107 58 113 76 Z"
        fill="#e8a8a8"
        opacity="0.7"
      />

      <path d="M212 88 Q232 42 205 30 Q190 55 182 78 Z" fill="#1A1A2E" />
      <path
        d="M208 82 Q224 50 204 40 Q193 58 187 76 Z"
        fill="#e8a8a8"
        opacity="0.7"
      />

      <ellipse
        cx="150"
        cy="130"
        rx="74"
        ry="70"
        fill="url(#ninoBody)"
        filter="url(#ninoShadow)"
      />
      <path
        d="M88 88 Q95 75 118 70 Q125 95 108 108 Q96 102 88 88 Z"
        fill="#1A1A2E"
        opacity="0.85"
      />

      <path
        d="M108 115 Q122 104 136 115"
        stroke="#1A1A2E"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M164 115 Q178 104 192 115"
        stroke="#1A1A2E"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="108" cy="130" rx="14" ry="8" fill="#FF6B00" opacity="0.15" />
      <ellipse cx="192" cy="130" rx="14" ry="8" fill="#FF6B00" opacity="0.15" />
      <path d="M144 138 L150 145 L156 138 Q150 135 144 138 Z" fill="#E87070" />
      <path
        d="M132 148 Q150 165 168 148"
        stroke="#C05050"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="150" cy="143" rx="22" ry="14" fill="white" opacity="0.4" />

      <line
        x1="55"
        y1="133"
        x2="118"
        y2="138"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="55"
        y1="141"
        x2="118"
        y2="141"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="60"
        y1="149"
        x2="118"
        y2="144"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="182"
        y1="138"
        x2="245"
        y2="133"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="182"
        y1="141"
        x2="245"
        y2="141"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="182"
        y1="144"
        x2="240"
        y2="149"
        stroke="#888"
        strokeWidth="1"
        opacity="0.5"
      />

      <ellipse cx="108" cy="258" rx="26" ry="18" fill="url(#ninoBody)" />
      <ellipse cx="96" cy="262" rx="8" ry="6" fill="#F0F0F0" />
      <ellipse cx="108" cy="265" rx="8" ry="6" fill="#F0F0F0" />
      <ellipse cx="120" cy="262" rx="8" ry="6" fill="#F0F0F0" />
      <ellipse cx="192" cy="258" rx="26" ry="18" fill="url(#ninoBody)" />
      <ellipse cx="180" cy="262" rx="8" ry="6" fill="#F0F0F0" />
      <ellipse cx="192" cy="265" rx="8" ry="6" fill="#F0F0F0" />
      <ellipse cx="204" cy="262" rx="8" ry="6" fill="#F0F0F0" />

      <rect x="124" y="174" width="48" height="20" rx="10" fill="#2D2D4E" />
      <rect x="136" y="174" width="24" height="6" rx="3" fill="#3D3D6E" />
      <rect x="110" y="188" width="76" height="52" rx="10" fill="#FF6B00" />
      <rect x="110" y="188" width="76" height="18" rx="10" fill="#E85A00" />
      <rect
        x="122"
        y="194"
        width="52"
        height="6"
        rx="3"
        fill="white"
        opacity="0.3"
      />
      <line
        x1="110"
        y1="206"
        x2="186"
        y2="206"
        stroke="#E85A00"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle cx="148" cy="224" r="12" fill="white" opacity="0.15" />
    </svg>
  )
}
