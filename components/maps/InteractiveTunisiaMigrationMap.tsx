"use client"

import { useId, useMemo, useState } from "react"
import { RotateCcw, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MigrationFlows } from "@/components/maps/MigrationFlows"
import { migrationRegions, negativeRegions, positiveRegions, type MigrationRegion } from "@/data/migrationData"
import { cn } from "@/lib/utils"

type LegendCategory = "positive" | "negative" | "flows" | null

interface InteractiveTunisiaMigrationMapProps {
  activeCategory: LegendCategory
  selectedRegionId: string | null
  quizMode?: boolean
  onSelectRegion: (region: MigrationRegion) => void
}

/** Zone utile de la carte (alignée sur `<image href="/carte1.jpg" … />`) — même repère que les centres dans `migrationData`. */
const MAP_X = 66
const MAP_Y = 36
const MAP_WIDTH = 290
const MAP_HEIGHT = 548

const COLORS = {
  positive: "#16a34a",
  negative: "#dc2626",
  neutral: "#d1d5db",
}

export function InteractiveTunisiaMigrationMap({
  activeCategory,
  selectedRegionId,
  quizMode = false,
  onSelectRegion,
}: InteractiveTunisiaMigrationMapProps) {
  const flowMarkerId = useId().replace(/:/g, "")
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [zoomedId, setZoomedId] = useState<string | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)

  const regionsById = useMemo(
    () => Object.fromEntries(migrationRegions.map((r) => [r.id, r])) as Record<string, MigrationRegion>,
    []
  )

  const hoveredRegion = hoveredId ? regionsById[hoveredId] : null

  const viewBox = `${MAP_X} ${MAP_Y} ${MAP_WIDTH} ${MAP_HEIGHT}`

  function isDimmed(region: MigrationRegion) {
    if (!activeCategory || activeCategory === "flows") return false
    return region.migrationType !== activeCategory
  }

  function clickRegion(region: MigrationRegion) {
    onSelectRegion(region)
    setZoomedId(region.id)
  }

  function triggerWrongAnswer(regionId: string) {
    setShakeId(regionId)
    setTimeout(() => setShakeId(null), 400)
  }

  return (
    <div className="relative rounded-3xl border-2 border-red-200 bg-white p-4 shadow-xl">
      <div className="flex w-full justify-center">
        <div className="mx-auto w-full max-w-2xl border border-red-500">
          <div className="overflow-hidden rounded-2xl bg-sky-50/90">
            <svg
              viewBox={viewBox}
              preserveAspectRatio="xMidYMid meet"
              className="block h-auto w-full max-h-[min(78vh,720px)]"
              role="img"
              aria-label="خريطة تفاعلية للهجرة الداخلية"
            >
              <defs>
                <style>{`
                  @keyframes tn-map-shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    50% { transform: translateX(4px); }
                    75% { transform: translateX(-3px); }
                  }
                  .tn-map-point-shake {
                    animation: tn-map-shake 0.35s ease-in-out;
                  }
                `}</style>
              </defs>

              <g id="map" transform="translate(0,0)">
                <rect x={MAP_X} y={MAP_Y} width={MAP_WIDTH} height={MAP_HEIGHT} rx={12} fill="#e0f2fe" opacity={0.35} />
                <image
                  href="/carte1.jpg"
                  x={MAP_X}
                  y={MAP_Y}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  preserveAspectRatio="none"
                  opacity={0.98}
                />
              </g>

              <MigrationFlows visible={activeCategory === "flows"} markerId={`${flowMarkerId}-arrow`} />

              <g id="points">
                {migrationRegions.map((region) => {
                  const selected = selectedRegionId === region.id
                  const hovered = hoveredId === region.id
                  const dimmed = isDimmed(region)
                  const zoomed = zoomedId === region.id
                  const wrong = shakeId === region.id
                  const fill = region.migrationType === "positive" ? COLORS.positive : COLORS.negative

                  return (
                    <g
                      key={region.id}
                      onClick={() => clickRegion(region)}
                      onMouseEnter={() => setHoveredId(region.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={cn(
                        "cursor-pointer transition-transform duration-300 ease-out",
                        zoomed && "scale-[1.08]",
                        wrong && "tn-map-point-shake"
                      )}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: `${region.center.x}px ${region.center.y}px`,
                        filter: selected ? "drop-shadow(0 0 8px rgba(250,204,21,0.85))" : undefined,
                      }}
                    >
                      <circle
                        cx={region.center.x}
                        cy={region.center.y}
                        r={selected ? 11 : hovered ? 9 : 7}
                        fill={dimmed ? COLORS.neutral : fill}
                        fillOpacity={dimmed ? 0.35 : 0.92}
                        stroke={selected ? "#fef08a" : "white"}
                        strokeWidth={selected ? 2.8 : 1.4}
                      />
                      {(selected || hovered) && (
                        <text
                          x={region.center.x}
                          y={region.center.y - 14}
                          textAnchor="middle"
                          className="fill-slate-900 font-bold"
                          style={{ fontSize: "10px" }}
                        >
                          {region.nameAr}
                        </text>
                      )}
                      <title>{region.nameAr}</title>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {hoveredRegion && (
        <div
          className="pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-xl bg-foreground/90 px-3 py-2 text-xs text-background shadow-lg"
          dir="rtl"
        >
          <p className="font-bold">{hoveredRegion.nameAr}</p>
          <p>{hoveredRegion.migrationType === "positive" ? "حصيلة إيجابية" : "حصيلة سلبية"}</p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground" dir="rtl">
          {quizMode ? "وضع الاختبار مفعل" : "اضغط على أي ولاية لاستكشاف المعطيات"}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setZoomedId(selectedRegionId)}>
            <ZoomIn className="ml-1 h-4 w-4" /> تكبير
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setZoomedId(null)
              setShakeId(null)
            }}
          >
            <RotateCcw className="ml-1 h-4 w-4" /> إعادة
          </Button>
        </div>
      </div>

      <button
        type="button"
        className="hidden"
        aria-hidden="true"
        onClick={() => {
          const anyNegative = migrationRegions.find((r) => r.migrationType === "negative")
          if (anyNegative) triggerWrongAnswer(anyNegative.id)
        }}
      />
    </div>
  )
}

export function firstRegionNameByType(type: "positive" | "negative") {
  return type === "positive" ? positiveRegions[0] : negativeRegions[0]
}
