"use client"

import { useState } from "react"
import Image from "next/image"
import { Volume2, VolumeX, Lightbulb, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { playSoundSimple } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface CharacterSpeechPanelProps {
  title?: string
  message: string
  funFact?: string
  icon?: React.ReactNode
  onListenClick?: () => void
  showListenButton?: boolean
}

export function CharacterSpeechPanel({
  title,
  message,
  funFact,
  icon,
  showListenButton = false
}: CharacterSpeechPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleListen = () => {
    playSoundSimple("magic", 0.3)
    setIsPlaying(!isPlaying)
    // In a real app, this would trigger text-to-speech or play a recorded audio
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border-2 border-secondary/30 p-4 h-full flex flex-col">
      {/* Character Avatar */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/60 border-3 border-secondary shadow-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/explorer.png"
              alt="مستكشف"
              width={56}
              height={56}
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <span className="text-3xl absolute">🧒</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-primary text-lg">المستكشف الصغير</h4>
          <p className="text-xs text-muted-foreground">مرشدك في رحلة الخريطة</p>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 relative">
        <div className="absolute top-0 right-6 w-4 h-4 bg-primary/10 transform rotate-45 -translate-y-2" />
        <div className={cn(
          "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4",
          "border-2 border-primary/20"
        )}>
          {title && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/20">
              {icon || <MapPin className="w-5 h-5 text-primary" />}
              <h5 className="font-bold text-primary">{title}</h5>
            </div>
          )}
          <p className="text-foreground leading-relaxed text-base">
            {message}
          </p>
        </div>
      </div>

      {/* Fun Fact */}
      {funFact && (
        <div className="mt-4 bg-secondary/20 rounded-xl p-3 border-2 border-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 text-secondary-foreground" />
            <span className="font-bold text-secondary-foreground text-sm">هل تعلم؟</span>
          </div>
          <p className="text-sm text-foreground/80">{funFact}</p>
        </div>
      )}

      {/* Listen Button */}
      {showListenButton && (
        <Button
          variant="outline"
          onClick={handleListen}
          className={cn(
            "mt-4 w-full gap-2",
            isPlaying && "bg-primary text-primary-foreground"
          )}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              إيقاف الصوت
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              استمع للشرح
            </>
          )}
        </Button>
      )}
    </div>
  )
}
