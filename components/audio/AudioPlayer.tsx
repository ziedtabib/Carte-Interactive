"use client"

import { Volume2, Square, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeech } from "@/hooks/useSpeech"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  /** Full lesson text to read aloud */
  lessonText: string
  className?: string
  variant?: "default" | "compact"
}

/**
 * Listen to lesson: TTS in Arabic with stop / pause / resume.
 */
export function AudioPlayer({ lessonText, className, variant = "default" }: AudioPlayerProps) {
  const { status, speak, stop, pause, resume, isSupported } = useSpeech()

  if (!isSupported) {
    return (
      <p className="text-xs text-muted-foreground text-center" dir="rtl">
        المتصفح لا يدعم القراءة الصوتية.
      </p>
    )
  }

  const toggle = () => {
    if (status === "idle") speak(lessonText)
    else if (status === "playing") pause()
    else if (status === "paused") resume()
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 rounded-2xl border bg-card/90 px-3 py-2 shadow-sm",
        variant === "compact" && "py-1.5",
        className
      )}
      dir="rtl"
    >
      <span className="text-lg" aria-hidden>
        🔊
      </span>
      <span className="text-sm font-medium">استمع للدرس</span>
      <Button type="button" size="sm" variant="secondary" className="rounded-xl gap-1" onClick={() => speak(lessonText)}>
        <Volume2 className="w-4 h-4" />
        تشغيل
      </Button>
      <Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={toggle} disabled={status === "idle"}>
        {status === "playing" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {status === "playing" ? "إيقاف مؤقت" : status === "paused" ? "متابعة" : "—"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className="rounded-xl" onClick={stop}>
        <Square className="w-4 h-4" />
        إيقاف
      </Button>
    </div>
  )
}

