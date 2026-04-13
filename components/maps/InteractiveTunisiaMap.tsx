"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { GovernorateData } from "@/lib/tunisia-geojson"
import { governorates } from "@/lib/tunisia-geojson"
import {
  DENSITY_LEGEND_COLORS,
  GADM_NAME_1_TO_GOVERNORATE_ID,
  densityToLegendId,
  countGovernoratesByDensityCategory,
  DENSITY_LEGEND_LABELS_AR,
  type DensityLegendCategoryId,
} from "@/lib/tunisia-data"
import { boundsFromGeoJsonFeatures, geometryToSvgPath, makeProjector } from "@/lib/geo/tunisia-geo-project"

const VIEW_W = 1000
const VIEW_H = 1200

export type MapColorMode = "density" | "climate" | "migration"

type GeoFeature = {
  type: "Feature"
  properties: { NAME_1?: string }
  geometry: { type: string; coordinates: unknown }
}

function fillForMode(g: GovernorateData, mode: MapColorMode): string {
  switch (mode) {
    case "density":
      return DENSITY_LEGEND_COLORS[densityToLegendId(g.density)]
    case "climate":
      return ({ humid: "#7c3aed", semi_arid: "#06b6d4", arid: "#f59e0b" } as const)[g.climate]
    case "migration":
      return ({ positive: "#ec4899", negative: "#0ea5e9" } as const)[g.migration]
    default:
      return "#94a3b8"
  }
}

const govById = Object.fromEntries(governorates.map((x) => [x.id, x])) as Record<string, GovernorateData>

interface InteractiveTunisiaMapProps {
  title: string
  mapMode: MapColorMode
  /** Quand l’utilisateur choisit une catégorie dans la légende (sidebar) */
  activeLegendCategory?: string | null
  selectedGovernorateId?: string | null
  hoveredGovernorateId?: string | null
  onSelectGovernorate?: (id: string) => void
  onHoverGovernorate?: (id: string | null) => void
  className?: string
  /** Fichier GeoJSON GADM (24 gouvernorats) servi depuis /public */
  geoJsonPath?: string
  /** Affiche le nombre de gouvernorats par catégorie (mode densité uniquement) */
  showCategoryCounts?: boolean
  /** Affiche le bouton plein écran (même interactions : zoom, filtres, clics) */
  allowFullscreen?: boolean
}

interface PreparedPath {
  key: string
  governorateId: string
  d: string
  nameAr: string
  fill: string
}

/**
 * Carte vectorielle de la Tunisie (GeoJSON GADM) : chaque gouvernorat est un path SVG cliquable.
 * Filtre légende : les zones non concernées passent en gris semi-transparent.
 */
export function InteractiveTunisiaMap({
  title,
  mapMode,
  activeLegendCategory = null,
  selectedGovernorateId = null,
  hoveredGovernorateId = null,
  onSelectGovernorate,
  onHoverGovernorate,
  className,
  geoJsonPath = "/geo/gadm41_TUN_1.json",
  showCategoryCounts = false,
  allowFullscreen = true,
}: InteractiveTunisiaMapProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const patternId = useId().replace(/:/g, "")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [geoError, setGeoError] = useState<string | null>(null)
  const [features, setFeatures] = useState<GeoFeature[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(geoJsonPath)
        if (!res.ok) throw new Error(String(res.status))
        const data = (await res.json()) as { features: GeoFeature[] }
        if (!cancelled) setFeatures(data.features ?? [])
      } catch {
        if (!cancelled) setGeoError("تعذّر تحميل الخريطة")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [geoJsonPath])

  useEffect(() => {
    const sync = () => {
      const el = document.fullscreenElement ?? (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
      setIsFullscreen(el === rootRef.current)
    }
    document.addEventListener("fullscreenchange", sync)
    document.addEventListener("webkitfullscreenchange", sync)
    return () => {
      document.removeEventListener("fullscreenchange", sync)
      document.removeEventListener("webkitfullscreenchange", sync)
    }
  }, [])

  const toggleFullscreen = useCallback(async () => {
    const node = rootRef.current
    if (!node) return
    try {
      if (!document.fullscreenElement && !(document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
        if (node.requestFullscreen) await node.requestFullscreen()
        else if ((node as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen) {
          ;(node as HTMLElement & { webkitRequestFullscreen: () => void }).webkitRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) await document.exitFullscreen()
        else if ((document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen) {
          ;(document as Document & { webkitExitFullscreen: () => void }).webkitExitFullscreen()
        }
      }
    } catch {
      /* ignore */
    }
  }, [])

  const { paths } = useMemo(() => {
    if (!features?.length) {
      return { paths: [] as PreparedPath[] }
    }
    const bounds = boundsFromGeoJsonFeatures(features)
    const projectLocal = makeProjector(bounds, VIEW_W, VIEW_H, 0.02)
    const list: PreparedPath[] = []
    features.forEach((f, fi) => {
      const name1 = f.properties?.NAME_1
      const gid = name1 ? GADM_NAME_1_TO_GOVERNORATE_ID[name1] : undefined
      if (!gid || !govById[gid]) return
      const g = govById[gid]
      const d = geometryToSvgPath(f.geometry as GeoFeature["geometry"], projectLocal)
      if (!d) return
      list.push({
        key: `${gid}-${fi}`,
        governorateId: gid,
        d,
        nameAr: g.nameAr,
        fill: fillForMode(g, mapMode),
      })
    })
    return { paths: list }
  }, [features, mapMode])

  const legendMatch = useCallback(
    (g: GovernorateData): boolean | null => {
      if (!activeLegendCategory) return null
      if (mapMode === "density") {
        const m: Record<string, GovernorateData["density"]> = {
          "very-high": "very_high",
          high: "high",
          medium: "medium",
          low: "low",
        }
        return g.density === m[activeLegendCategory]
      }
      if (mapMode === "climate") {
        const m: Record<string, GovernorateData["climate"]> = {
          humid: "humid",
          "semi-arid": "semi_arid",
          arid: "arid",
        }
        return g.climate === m[activeLegendCategory]
      }
      if (mapMode === "migration") {
        const m: Record<string, GovernorateData["migration"]> = {
          positive: "positive",
          negative: "negative",
        }
        return g.migration === m[activeLegendCategory]
      }
      return null
    },
    [activeLegendCategory, mapMode]
  )

  const densityCounts = useMemo(() => countGovernoratesByDensityCategory(), [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || zoom <= 1) return
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handleMouseUp = () => setDragging(false)

  const hoveredName =
    hoveredGovernorateId && govById[hoveredGovernorateId] ? govById[hoveredGovernorateId].nameAr : null

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative group rounded-2xl overflow-hidden border-2 border-muted bg-sky-50/40",
        isFullscreen && "fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col rounded-none border-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/55 to-transparent p-3 rounded-t-2xl pointer-events-none">
        <h3 className="text-white font-bold text-base md:text-lg text-center">{title}</h3>
      </div>

      {showCategoryCounts && mapMode === "density" && (
        <div className="absolute top-12 left-2 right-2 z-10 flex flex-wrap justify-center gap-2 pointer-events-none">
          {(Object.keys(DENSITY_LEGEND_COLORS) as DensityLegendCategoryId[]).map((id) => (
            <span
              key={id}
              className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] md:text-xs font-medium shadow-sm backdrop-blur-sm"
              style={{ borderRight: `3px solid ${DENSITY_LEGEND_COLORS[id]}` }}
            >
              {DENSITY_LEGEND_LABELS_AR[id]}: {densityCounts[id]}
            </span>
          ))}
        </div>
      )}

      <div
        className={cn(
          "relative overflow-hidden cursor-grab touch-none active:cursor-grabbing",
          isFullscreen
            ? "h-[calc(100dvh-9rem)] min-h-[280px] w-full shrink-0"
            : "aspect-[5/6] max-h-[min(85vh,720px)]"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {geoError ? (
            <div className="flex h-full min-h-[280px] items-center justify-center p-6 text-center text-destructive">
              {geoError}
            </div>
          ) : !features ? (
            <div className="flex h-full min-h-[280px] items-center justify-center bg-muted/30">
              <span className="text-muted-foreground text-sm">جاري تحميل الخريطة…</span>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="w-full h-full select-none"
              role="img"
              aria-label={title}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern id={`sea-tn-${patternId}`} patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="#e0f2fe" />
                  <path d="M0 8 L8 0" stroke="#bae6fd" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect x={-50} y={-50} width={VIEW_W + 100} height={VIEW_H + 100} fill={`url(#sea-tn-${patternId})`} opacity={0.4} />

              {paths.map(({ key, governorateId, d, nameAr, fill }) => {
                const g = govById[governorateId]!
                const match = legendMatch(g)
                const dim = activeLegendCategory != null && match === false
                const isSel = selectedGovernorateId === governorateId
                const isHover = hoveredGovernorateId === governorateId
                return (
                  <path
                    key={key}
                    d={d}
                    fill={dim ? "#94a3b8" : fill}
                    fillOpacity={dim ? 0.35 : isHover || isSel ? 0.95 : 0.88}
                    fillRule="evenodd"
                    stroke={isSel ? "#fef08a" : isHover ? "#ffffff" : "rgba(15,23,42,0.35)"}
                    strokeWidth={isSel ? 3 : isHover ? 2 : 0.8}
                    className="cursor-pointer transition-[fill-opacity,stroke-width] duration-200 ease-out"
                    onClick={() => onSelectGovernorate?.(governorateId)}
                    onMouseEnter={() => onHoverGovernorate?.(governorateId)}
                    onMouseLeave={() => onHoverGovernorate?.(null)}
                  >
                    <title>{nameAr}</title>
                  </path>
                )
              })}
            </svg>
          )}
        </div>
      </div>

      {hoveredName && (
        <div
          className="pointer-events-none absolute bottom-14 left-1/2 z-20 -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-1.5 text-sm font-semibold text-background shadow-lg transition-opacity duration-200"
          dir="rtl"
        >
          {hoveredName}
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow-md backdrop-blur opacity-90 group-hover:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="min-w-[2.5rem] text-center text-xs font-medium">{Math.round(zoom * 100)}%</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => {
            setZoom(1)
            setPan({ x: 0, y: 0 })
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        {allowFullscreen && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={toggleFullscreen}
            title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            aria-label={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  )
}
