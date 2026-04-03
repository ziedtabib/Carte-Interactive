"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { playSoundSimple } from "@/lib/sounds"
import { useRef, useState } from "react"

interface UnitCardProps {
  title: string
  /** سطر ثانٍ تحت العنوان (مثلاً عدد الدروس أو الخرائط) */
  subtitle?: string
  unitNumber: number
  href: string
  mapImage: string
  colorClass: string
  delay?: number
  hoverDescription?: string
  hoverImage?: string
}

export function UnitCard({
  title,
  subtitle,
  unitNumber,
  href,
  mapImage,
  colorClass,
  delay = 0,
  hoverDescription,
  hoverImage
}: UnitCardProps) {
  const [isHovering, setIsHovering] = useState(false)
  const speakingRef = useRef(false)

  const speakArabic = (text: string) => {
    if (typeof window === "undefined") return
    try {
      // Stop previous speech before starting a new one.
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "ar-TN"
      utterance.rate = 0.95
      utterance.pitch = 1
      utterance.volume = 1

      speakingRef.current = true
      utterance.onend = () => {
        speakingRef.current = false
      }
      utterance.onerror = () => {
        speakingRef.current = false
      }

      window.speechSynthesis.speak(utterance)
    } catch {
      // Ignore speech errors (some browsers may block without user gesture).
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (!hoverDescription) return

    // Play a small UI sound + then speak the description.
    playSoundSimple("whoosh", 0.35)
    speakArabic(hoverDescription)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
    }
    speakingRef.current = false
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500",
        "border-4 border-transparent hover:border-primary/30",
        "transform hover:-translate-y-2 hover:scale-[1.02]",
        "animate-fade-in-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isHovering && hoverImage ? (
        <div className="pointer-events-none absolute -top-8 right-4 z-20">
          <div className="relative w-24 h-24">
            <Image
              src={hoverImage}
              alt="Dora"
              fill
              className="object-contain drop-shadow-lg"
              sizes="96px"
            />
          </div>
        </div>
      ) : null}

      {/* Decorative sparkles */}
      <div className="absolute -top-2 -right-2 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>
      
      {/* Unit number badge */}
      <div className={cn(
        "absolute -top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center",
        "text-white font-bold text-xl shadow-lg",
        colorClass
      )}>
        {unitNumber}
      </div>

      {/* Map preview */}
      <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-muted">
        <Image
          src={mapImage}
          alt={title}
          fill
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
      </div>

      {/* Title */}
      <div className="mb-4 text-center space-y-1">
        <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
        ) : null}
      </div>

      {/* Action button */}
      <Link href={href} className="block">
        <Button 
          className={cn(
            "w-full text-lg py-6 rounded-2xl font-semibold",
            "bg-gradient-to-l from-primary to-primary/80 hover:from-primary/90 hover:to-primary",
            "shadow-lg hover:shadow-xl transition-all duration-300",
            "group-hover:animate-pulse-gentle"
          )}
        >
          ابدأ الدرس
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  )
}
