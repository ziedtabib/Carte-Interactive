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
      <img
        src="/dora2.webp"
        alt="Dora"
        className={cn("w-full h-full object-contain", waving && "animate-wave")}
        draggable={false}
      />
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-wave {
          animation: wave 1.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
