"use client"

import { useEffect } from "react"
import { recordSessionStart } from "@/lib/analytics"

/** Call once per browser session on app load */
export function AnalyticsInit() {
  useEffect(() => {
    recordSessionStart()
  }, [])
  return null
}
