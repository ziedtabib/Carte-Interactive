"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  RESOURCE_TYPE_EMOJI,
  RESOURCE_TYPE_LABELS,
  TUNISIA_RESOURCE_POINTS,
  type ResourceType,
  type TunisiaResourcePoint,
} from "@/lib/tunisia-resources"
import { boundsFromGeoJsonFeatures, geometryToSvgPath, makeProjector } from "@/lib/geo/tunisia-geo-project"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const VIEW_W = 1000
const VIEW_H = 1200
const GEO_JSON_PATH = "/geo/gadm41_TUN_1.json"

type GeoFeature = {
  type: "Feature"
  properties: { NAME_1?: string }
  geometry: { type: string; coordinates: unknown }
}

const COLORS: Record<ResourceType, string> = {
  oil: "#3b82f6",
  gas: "#ec4899",
  phosphate: "#facc15",
  electric: "#22c55e",
  iron: "#a855f7",
}

const LEGEND_FILTERS: { type: ResourceType | "all"; label: string }[] = [
  { type: "all", label: "الكل" },
  { type: "oil", label: "نفط" },
  { type: "gas", label: "غاز" },
  { type: "phosphate", label: "فسفاط" },
  { type: "electric", label: "كهرباء" },
  { type: "iron", label: "حديد" },
]

interface InteractiveTunisiaResourcesSvgMapProps {
  title: string
  className?: string
  geoJsonPath?: string
  onPointSelect?: (point: TunisiaResourcePoint | null) => void
}

export function InteractiveTunisiaResourcesSvgMap({
  title,
  className,
  geoJsonPath = GEO_JSON_PATH,
  onPointSelect,
}: InteractiveTunisiaResourcesSvgMapProps) {
  const [activeFilter, setActiveFilter] = useState<ResourceType | "all">("all")
  const [dialogPoint, setDialogPoint] = useState<TunisiaResourcePoint | null>(null)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [features, setFeatures] = useState<GeoFeature[] | null>(null)

  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(geoJsonPath)
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as { features: GeoFeature[] }
        if (!cancelled) setFeatures(data.features ?? [])
      } catch {
        if (!cancelled) setGeoError("تعذّر تحميل حدود الخريطة")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [geoJsonPath])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const zoom = e.deltaY > 0 ? 0.9 : 1.1
      setScale((prev) => Math.min(Math.max(prev * zoom, 1), 4))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const { paths, projectPoint } = useMemo(() => {
    if (!features?.length) {
      return {
        paths: [] as { key: string; d: string }[],
        projectPoint: null as null | ((lat: number, lng: number) => readonly [number, number]),
      }
    }
    const bounds = boundsFromGeoJsonFeatures(features)
    const projectLocal = makeProjector(bounds, VIEW_W, VIEW_H, 0.02)
    const list: { key: string; d: string }[] = []
    features.forEach((f, fi) => {
      const d = geometryToSvgPath(f.geometry as GeoFeature["geometry"], projectLocal)
      if (d) list.push({ key: `g-${fi}`, d })
    })
    return {
      paths: list,
      projectPoint: (lat: number, lng: number) => projectLocal(lng, lat),
    }
  }, [features])

  const visibleMarkers = useMemo(() => {
    if (!projectPoint) return []
    const filtered = TUNISIA_RESOURCE_POINTS.filter(
      (r) => activeFilter === "all" || r.type === activeFilter
    )
    return filtered.map((r) => {
      const [cx, cy] = projectPoint(r.lat, r.lng)
      return { point: r, cx, cy }
    })
  }, [projectPoint, activeFilter])

  const openDetail = (p: TunisiaResourcePoint) => {
    setDialogPoint(p)
    onPointSelect?.(p)
  }

  const closeDialog = (open: boolean) => {
    if (!open) setDialogPoint(null)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setDragging(true)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      px: position.x,
      py: position.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return
    setPosition({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    })
  }

  const handleMouseUp = () => setDragging(false)

  const resetView = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className={cn("space-y-3", className)} dir="rtl">
      <h3 className="text-center text-lg font-bold text-pink-800 sm:text-xl">{title}</h3>

      <div className="flex flex-wrap items-center justify-center gap-2 px-1">
        {LEGEND_FILTERS.map(({ type, label }) => (
          <Button
            key={type}
            type="button"
            variant={activeFilter === type ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-9 rounded-full px-3 text-xs font-semibold transition-transform sm:text-sm",
              activeFilter === type && "scale-105 shadow-md"
            )}
            onClick={() => setActiveFilter(type)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative h-[min(70vh,560px)] w-full flex-1 overflow-hidden rounded-2xl border border-pink-100 bg-slate-100 lg:min-h-[480px]"
        >
          {geoError ? (
            <p className="flex h-full items-center justify-center p-4 text-center text-sm text-destructive">
              {geoError}
            </p>
          ) : !features ? (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">جاري التحميل…</p>
          ) : (
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: dragging ? "none" : "transform 0.25s ease",
              }}
              className="h-full w-full cursor-grab active:cursor-grabbing"
            >
              <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full select-none" preserveAspectRatio="xMidYMid meet">
                {paths.map((p) => (
                  <path key={p.key} d={p.d} fill="#e5e7eb" stroke="#fff" strokeWidth={1.2} />
                ))}
                {visibleMarkers.map(({ point, cx, cy }) => (
                  <Tooltip key={point.id} delayDuration={200}>
                    <TooltipTrigger asChild>
                      <circle
                        role="button"
                        tabIndex={0}
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill={COLORS[point.type]}
                        stroke="#fff"
                        strokeWidth={2}
                        className="cursor-pointer transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                        onClick={() => openDetail(point)}
                        onKeyDown={(ev) => {
                          if (ev.key === "Enter" || ev.key === " ") {
                            ev.preventDefault()
                            openDetail(point)
                          }
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="max-w-[14rem] text-right text-xs leading-relaxed sm:text-sm"
                      sideOffset={6}
                    >
                      <p className="font-semibold">{point.name}</p>
                      <p className="text-background/90">{RESOURCE_TYPE_LABELS[point.type]}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </svg>
            </div>
          )}
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 rounded-2xl border border-pink-100 bg-white p-3 lg:w-44">
          <h4 className="text-center text-sm font-bold text-pink-800">التحكم</h4>
          <Button
            type="button"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => setScale((s) => Math.min(s + 0.2, 4))}
          >
            ➕ تكبير
          </Button>
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => setScale((s) => Math.max(s - 0.2, 1))}
          >
            ➖ تصغير
          </Button>
          <Button type="button" className="w-full bg-orange-500 hover:bg-orange-600" onClick={resetView}>
            🔄 إعادة
          </Button>
          <p className="text-center text-[11px] leading-snug text-muted-foreground">عجلة الفأرة للتكبير، اسحب للتحريك</p>
        </div>
      </div>

      <Dialog open={!!dialogPoint} onOpenChange={closeDialog}>
        <DialogContent className="max-w-md border-pink-200 text-right sm:max-w-lg" dir="rtl">
          {dialogPoint ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-pink-700">
                  <span className="ml-2 inline-block" aria-hidden>
                    {RESOURCE_TYPE_EMOJI[dialogPoint.type]}
                  </span>
                  {dialogPoint.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {RESOURCE_TYPE_LABELS[dialogPoint.type]}
                </p>
                <p className="leading-relaxed text-foreground">{dialogPoint.description}</p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
