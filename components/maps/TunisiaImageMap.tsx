"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type TunisiaPointType = "positive" | "negative"

export interface TunisiaMapPoint {
  id: string
  labelAr: string
  top: string
  left: string
  type: TunisiaPointType
}

interface TunisiaImageMapProps {
  imageSrc?: string
  points?: TunisiaMapPoint[]
  className?: string
  debug?: boolean
  onPointClick?: (point: TunisiaMapPoint) => void
}

/** 5 sample points calibrated with percentage positioning. */
const SAMPLE_POINTS: TunisiaMapPoint[] = [
  { id: "tunis", labelAr: "تونس", top: "27%", left: "57%", type: "positive" },
  { id: "nabeul", labelAr: "نابل", top: "33%", left: "68%", type: "positive" },
  { id: "sousse", labelAr: "سوسة", top: "43%", left: "63%", type: "positive" },
  { id: "kasserine", labelAr: "القصرين", top: "58%", left: "46%", type: "negative" },
  { id: "gafsa", labelAr: "قفصة", top: "68%", left: "48%", type: "negative" },
]

export function TunisiaImageMap({
  imageSrc = "/carte1.jpg",
  points = SAMPLE_POINTS,
  className,
  debug = true,
  onPointClick,
}: TunisiaImageMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const pointsById = Object.fromEntries(points.map((p) => [p.id, p])) as Record<string, TunisiaMapPoint>
  const hoveredPoint = hoveredId ? pointsById[hoveredId] : null

  return (
    <div className={cn("flex justify-center", className)}>
      <div className={cn("relative w-full max-w-md mx-auto", debug && "border border-red-500")}>
        <img src={imageSrc} alt="خريطة تونس" className="w-full h-auto object-contain select-none" />

        {points.map((point) => {
          const isHovered = hoveredId === point.id
          const isSelected = selectedId === point.id
          const colorClass = point.type === "positive" ? "bg-green-500" : "bg-red-500"
          return (
            <button
              key={point.id}
              type="button"
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/90 transition-all duration-200 cursor-pointer",
                colorClass,
                isSelected ? "w-5 h-5 ring-2 ring-yellow-300" : isHovered ? "w-4 h-4 scale-110" : "w-3 h-3"
              )}
              style={{
                top: point.top,
                left: point.left,
              }}
              onMouseEnter={() => setHoveredId(point.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                setSelectedId(point.id)
                onPointClick?.(point)
              }}
              aria-label={point.labelAr}
              title={point.labelAr}
            />
          )
        })}

        {hoveredPoint && (
          <div className="pointer-events-none absolute top-3 left-3 rounded-lg bg-foreground/90 px-3 py-1.5 text-xs text-background shadow">
            <p className="font-bold">{hoveredPoint.labelAr}</p>
            <p>{hoveredPoint.type === "positive" ? "حصيلة إيجابية" : "حصيلة سلبية"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

