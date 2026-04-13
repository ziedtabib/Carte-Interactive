"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

export type ClimateZoneId = "humid" | "semi-arid" | "arid"

interface ClimateZoneDef {
  id: ClimateZoneId
  label: string
  top: string
  left: string
  width: string
  height: string
  color: string
}

const ZONES: ClimateZoneDef[] = [
  {
    id: "humid",
    label: "مناخ رطب",
    top: "7%",
    left: "17%",
    width: "66%",
    height: "24%",
    color: "rgba(139,92,246,0.35)",
  },
  {
    id: "semi-arid",
    label: "مناخ شبه جاف",
    top: "33%",
    left: "16%",
    width: "68%",
    height: "29%",
    color: "rgba(34,211,238,0.35)",
  },
  {
    id: "arid",
    label: "مناخ جاف",
    top: "63%",
    left: "14%",
    width: "72%",
    height: "30%",
    color: "rgba(245,158,11,0.35)",
  },
]

interface InteractiveClimateMapProps {
  activeZone: ClimateZoneId | null
  onZoneSelect: (zoneId: ClimateZoneId) => void
  hoveredZone: ClimateZoneId | null
  onZoneHover: (zoneId: ClimateZoneId | null) => void
  className?: string
}

export function InteractiveClimateMap({
  activeZone,
  onZoneSelect,
  hoveredZone,
  onZoneHover,
  className,
}: InteractiveClimateMapProps) {
  const hoveredLabel = useMemo(() => ZONES.find((z) => z.id === hoveredZone)?.label ?? null, [hoveredZone])

  return (
    <div className={cn("relative w-full max-w-xl mx-auto", className)}>
      <img src="/carte1.jpg" alt="خريطة المناخات بالبلاد التونسية" className="w-full h-auto object-contain select-none" />

      {ZONES.map((zone) => {
        const isActive = activeZone === zone.id
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onZoneSelect(zone.id)}
            onMouseEnter={() => onZoneHover(zone.id)}
            onMouseLeave={() => onZoneHover(null)}
            className="absolute cursor-pointer transition-all duration-300 hover:bg-white/10 rounded-lg"
            style={{
              top: zone.top,
              left: zone.left,
              width: zone.width,
              height: zone.height,
              backgroundColor: isActive ? zone.color : "transparent",
              border: isActive ? "2px solid rgba(255,255,255,0.95)" : "none",
            }}
            aria-label={zone.label}
            title={zone.label}
          />
        )
      })}

      {hoveredLabel && (
        <div
          className="pointer-events-none absolute top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-foreground/90 px-3 py-1 text-xs font-semibold text-background shadow-md"
          dir="rtl"
        >
          {hoveredLabel}
        </div>
      )}
    </div>
  )
}

