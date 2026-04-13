"use client"

import { cn } from "@/lib/utils"

interface UnitProgressBarProps {
  unit: number
  /** 0–1 */
  progress: number
  label?: string
  accentClass?: string
}

export function UnitProgressBar({ unit, progress, label, accentClass = "bg-red-600" }: UnitProgressBarProps) {
  const p = Math.min(1, Math.max(0, progress))
  return (
    <div className="space-y-1" dir="rtl">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium shrink-0">الوحدة {unit}</span>
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500 ease-out", accentClass)}
            style={{ width: `${p * 100}%` }}
          />
        </div>
        <span className="text-xs tabular-nums w-8">{Math.round(p * 100)}%</span>
      </div>
    </div>
  )
}
