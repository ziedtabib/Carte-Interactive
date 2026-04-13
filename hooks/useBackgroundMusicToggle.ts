"use client"

import { useCallback, useEffect, useState } from "react"
import { isMusicPlaying, toggleBackgroundMusic } from "@/lib/sounds"

/** État du bouton musique synchronisé avec la lecture globale (autoplay à l’ouverture du site). */
export function useBackgroundMusicToggle() {
  const [isMusicOn, setIsMusicOn] = useState(false)

  useEffect(() => {
    setIsMusicOn(isMusicPlaying())
    const onEvt = (e: Event) => {
      const d = (e as CustomEvent<{ playing?: boolean }>).detail
      setIsMusicOn(d?.playing ?? isMusicPlaying())
    }
    window.addEventListener("site-background-music", onEvt)
    return () => window.removeEventListener("site-background-music", onEvt)
  }, [])

  const toggleMusic = useCallback(() => {
    toggleBackgroundMusic(!isMusicPlaying())
  }, [])

  return { isMusicOn, toggleMusic }
}
