"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type SpeechStatus = "idle" | "playing" | "paused"

/**
 * Web Speech API wrapper for Arabic lesson narration (client-only).
 */
export function useSpeech() {
  const [status, setStatus] = useState<SpeechStatus>("idle")
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = useCallback(() => {
    if (typeof window === "undefined") return
    window.speechSynthesis.cancel()
    setStatus("idle")
    utteranceRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(
    (text: string, lang = "ar-TN") => {
      if (typeof window === "undefined") return
      stop()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = 0.92
      u.pitch = 1
      u.onend = () => setStatus("idle")
      u.onerror = () => setStatus("idle")
      utteranceRef.current = u
      setStatus("playing")
      window.speechSynthesis.speak(u)
    },
    [stop]
  )

  const pause = useCallback(() => {
    if (typeof window === "undefined") return
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      setStatus("paused")
    }
  }, [])

  const resume = useCallback(() => {
    if (typeof window === "undefined") return
    window.speechSynthesis.resume()
    setStatus("playing")
  }, [])

  return { status, speak, stop, pause, resume, isSupported: typeof window !== "undefined" && "speechSynthesis" in window }
}
