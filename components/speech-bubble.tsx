"use client"

import { cn } from "@/lib/utils"
import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SpeechBubbleProps {
  children: React.ReactNode
  className?: string
  showAudioButton?: boolean
  direction?: "left" | "right"
}

export function SpeechBubble({ children, className, showAudioButton = false, direction = "right" }: SpeechBubbleProps) {
  return (
    <div className={cn(
      "relative bg-white rounded-3xl p-5 shadow-lg border-2 border-primary/20",
      "before:content-[''] before:absolute before:w-0 before:h-0",
      direction === "right" 
        ? "before:right-[-20px] before:top-6 before:border-l-[20px] before:border-l-white before:border-y-[10px] before:border-y-transparent"
        : "before:left-[-20px] before:top-6 before:border-r-[20px] before:border-r-white before:border-y-[10px] before:border-y-transparent",
      className
    )}>
      <div className="text-foreground leading-relaxed text-lg">
        {children}
      </div>
      {showAudioButton && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-2 left-2 text-primary hover:text-primary/80 hover:bg-primary/10"
        >
          <Volume2 className="w-5 h-5" />
          <span className="sr-only">استمع</span>
        </Button>
      )}
    </div>
  )
}
