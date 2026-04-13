"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { GamificationProvider } from "@/store/gamification-context"
import { registerSiteMusicAutoplay } from "@/lib/sounds"

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerSiteMusicAutoplay()
  }, [])

  return <GamificationProvider>{children}</GamificationProvider>
}
