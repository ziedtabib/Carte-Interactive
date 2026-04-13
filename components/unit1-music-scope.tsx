"use client"

import { useEffect } from "react"
import {
  getBackgroundMusicLoop,
  getBackgroundMusicSrc,
  isMusicPlaying,
  setBackgroundMusicLoop,
  setBackgroundMusicSrc,
  toggleBackgroundMusic,
  UNIT_1_BACKGROUND_MUSIC_SRC,
} from "@/lib/sounds"

/** Bascule la musique globale vers `unit1.mp3` pour toutes les pages sous `/unit/1`. */
export function Unit1MusicScope() {
  useEffect(() => {
    const prevSrc = getBackgroundMusicSrc()
    const prevLoop = getBackgroundMusicLoop()
    const prevWasPlaying = isMusicPlaying()
    setBackgroundMusicSrc(UNIT_1_BACKGROUND_MUSIC_SRC)
    setBackgroundMusicLoop(false)
    toggleBackgroundMusic(true)
    return () => {
      setBackgroundMusicSrc(prevSrc)
      setBackgroundMusicLoop(prevLoop)
      toggleBackgroundMusic(prevWasPlaying)
    }
  }, [])

  return null
}
