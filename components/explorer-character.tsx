"use client"

import { cn } from "@/lib/utils"

interface ExplorerCharacterProps {
  className?: string
  size?: "sm" | "md" | "lg"
  waving?: boolean
}

export function ExplorerCharacter({ className, size = "md", waving = false }: ExplorerCharacterProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-40 h-40"
  }

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg viewBox="0 0 100 120" className="w-full h-full">
        {/* Backpack */}
        <rect x="55" y="45" width="20" height="25" rx="5" fill="#8B4513" />
        <rect x="58" y="48" width="14" height="8" rx="2" fill="#A0522D" />
        
        {/* Body */}
        <rect x="30" y="50" width="35" height="40" rx="10" fill="#20B2AA" />
        
        {/* Neck */}
        <rect x="42" y="45" width="12" height="8" fill="#FFD4B8" />
        
        {/* Head */}
        <circle cx="48" cy="32" r="22" fill="#FFD4B8" />
        
        {/* Hair */}
        <path d="M30 25 Q35 10 48 8 Q61 10 66 25 Q68 20 65 15 Q55 5 48 5 Q41 5 31 15 Q28 20 30 25" fill="#2C1810" />
        
        {/* Eyes */}
        <ellipse cx="40" cy="32" rx="4" ry="5" fill="white" />
        <ellipse cx="56" cy="32" rx="4" ry="5" fill="white" />
        <circle cx="41" cy="33" r="2.5" fill="#2C1810" />
        <circle cx="57" cy="33" r="2.5" fill="#2C1810" />
        <circle cx="42" cy="32" r="1" fill="white" />
        <circle cx="58" cy="32" r="1" fill="white" />
        
        {/* Eyebrows */}
        <path d="M36 26 Q40 24 44 26" stroke="#2C1810" strokeWidth="1.5" fill="none" />
        <path d="M52 26 Q56 24 60 26" stroke="#2C1810" strokeWidth="1.5" fill="none" />
        
        {/* Smile */}
        <path d="M40 42 Q48 48 56 42" stroke="#2C1810" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Cheeks */}
        <circle cx="34" cy="38" r="4" fill="#FFB6C1" opacity="0.5" />
        <circle cx="62" cy="38" r="4" fill="#FFB6C1" opacity="0.5" />
        
        {/* Explorer Hat */}
        <ellipse cx="48" cy="14" rx="22" ry="6" fill="#DEB887" />
        <path d="M32 14 Q32 2 48 2 Q64 2 64 14" fill="#D2B48C" />
        <rect x="44" y="2" width="8" height="4" rx="2" fill="#8B4513" />
        
        {/* Arms */}
        <g className={waving ? "animate-wave origin-[25px_55px]" : ""}>
          <path d="M30 55 Q15 60 12 75" stroke="#FFD4B8" strokeWidth="8" fill="none" strokeLinecap="round" />
          <circle cx="12" cy="75" r="5" fill="#FFD4B8" />
        </g>
        <path d="M65 55 Q80 60 78 75" stroke="#FFD4B8" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="78" cy="75" r="5" fill="#FFD4B8" />
        
        {/* Map in hand */}
        <rect x="72" y="70" width="15" height="12" fill="#FFF8DC" stroke="#8B4513" strokeWidth="1" />
        <path d="M74 73 L85 73 M74 76 L82 76 M74 79 L85 79" stroke="#8B4513" strokeWidth="0.5" />
        
        {/* Legs */}
        <rect x="35" y="88" width="10" height="20" rx="4" fill="#4169E1" />
        <rect x="50" y="88" width="10" height="20" rx="4" fill="#4169E1" />
        
        {/* Shoes */}
        <ellipse cx="40" cy="110" rx="8" ry="5" fill="#8B4513" />
        <ellipse cx="55" cy="110" rx="8" ry="5" fill="#8B4513" />
      </svg>
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-20deg); }
          75% { transform: rotate(20deg); }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
