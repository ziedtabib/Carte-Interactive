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
  MIGRATION_LEGEND_COLORS,
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
      return MIGRATION_LEGEND_COLORS[g.migration]
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
  /** En plein écran (densité) : affiche مفتاح الخريطة cliquable si fourni */
  onDensityLegendSelect?: (category: DensityLegendCategoryId) => void
  /** En plein écran (migration) : affiche مفتاح الخريطة cliquable si fourni */
  onMigrationLegendSelect?: (category: MigrationLegendFullscreenId) => void
}

interface PreparedPath {
  key: string
  governorateId: string
  d: string
  nameAr: string
  fill: string
}

/** Flèches pédagogiques ; seules les paires طرد (bleu) → استقبال (rose) sont conservées. */
const MIGRATION_FLOW_CANDIDATES: Array<{ fromId: string; toId: string }> = [
  { fromId: "kasserine", toId: "tunis" },
  { fromId: "kasserine", toId: "sfax" },
  { fromId: "kasserine", toId: "sousse" },
  { fromId: "sidi_bouzid", toId: "sousse" },
  { fromId: "sidi_bouzid", toId: "sfax" },
  { fromId: "gafsa", toId: "sfax" },
  { fromId: "gafsa", toId: "sousse" },
  { fromId: "jendouba", toId: "tunis" },
  { fromId: "jendouba", toId: "nabeul" },
  { fromId: "kef", toId: "nabeul" },
  { fromId: "kef", toId: "tunis" },
  { fromId: "siliana", toId: "sousse" },
  { fromId: "siliana", toId: "tunis" },
  { fromId: "beja", toId: "tunis" },
  { fromId: "zaghouan", toId: "tunis" },
  { fromId: "zaghouan", toId: "nabeul" },
  { fromId: "kairouan", toId: "sfax" },
  { fromId: "kairouan", toId: "sousse" },
  { fromId: "bizerte", toId: "tunis" },
  { fromId: "tataouine", toId: "medenine" },
  { fromId: "tataouine", toId: "sfax" },
  /* Sud : استقبال قبلي، توزر، قابس، مدنين */
  { fromId: "gafsa", toId: "kebili" },
  { fromId: "gafsa", toId: "tozeur" },
  { fromId: "gafsa", toId: "gabes" },
  { fromId: "gafsa", toId: "medenine" },
  { fromId: "tataouine", toId: "kebili" },
  { fromId: "tataouine", toId: "gabes" },
  { fromId: "sidi_bouzid", toId: "gabes" },
  { fromId: "kasserine", toId: "gabes" },
]

const MIGRATION_FLOW_PAIRS = MIGRATION_FLOW_CANDIDATES.filter((p) => {
  const from = govById[p.fromId]
  const to = govById[p.toId]
  return Boolean(from && to && from.migration === "negative" && to.migration === "positive")
})

const DENSITY_FULLSCREEN_LEGEND_ORDER = ["very-high", "high", "medium", "low"] as const satisfies readonly DensityLegendCategoryId[]

export type MigrationLegendFullscreenId = "positive" | "negative" | "flows"

const MIGRATION_FULLSCREEN_ORDER = ["positive", "negative", "flows"] as const satisfies readonly MigrationLegendFullscreenId[]

const MIGRATION_FULLSCREEN_META: Record<
  MigrationLegendFullscreenId,
  { label: string; swatch: string }
> = {
  positive: { label: "حصيلة هجرية إيجابية", swatch: MIGRATION_LEGEND_COLORS.positive },
  negative: { label: "حصيلة هجرية سلبية", swatch: MIGRATION_LEGEND_COLORS.negative },
  flows: { label: "الأدفاق الهجرية", swatch: MIGRATION_LEGEND_COLORS.flows },
}

function migrationLegendRowActiveClass(id: MigrationLegendFullscreenId): string {
  if (id === "positive") return "bg-fuchsia-500/18 ring-1 ring-fuchsia-400/65"
  if (id === "negative") return "bg-sky-500/18 ring-1 ring-sky-400/65"
  return "bg-slate-600/20 ring-1 ring-slate-400/55"
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
  onDensityLegendSelect,
  onMigrationLegendSelect,
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

  const { paths, projectedCenters } = useMemo(() => {
    if (!features?.length) {
      return { paths: [] as PreparedPath[], projectedCenters: {} as Record<string, { x: number; y: number }> }
    }
    const bounds = boundsFromGeoJsonFeatures(features)
    const projectLocal = makeProjector(bounds, VIEW_W, VIEW_H, 0.02)
    const list: PreparedPath[] = []
    const centers: Record<string, { x: number; y: number }> = {}
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
      const [x, y] = projectLocal(g.center.lng, g.center.lat)
      centers[gid] = { x, y }
    })
    return { paths: list, projectedCenters: centers }
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
        if (activeLegendCategory === "flows") return null
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

  const migrationLegendCounts = useMemo(() => {
    let positive = 0
    let negative = 0
    for (const g of governorates) {
      if (g.migration === "positive") positive++
      else negative++
    }
    return {
      positive,
      negative,
      flows: MIGRATION_FLOW_PAIRS.length,
    } as const
  }, [])

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
  const showMigrationFlows = mapMode === "migration" && activeLegendCategory === "flows"

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative group rounded-2xl overflow-hidden border-2 border-muted bg-sky-50/40",
        isFullscreen &&
          "fixed inset-0 z-[100] flex min-h-0 h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col rounded-none border-0 bg-slate-900 overscroll-none",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute right-0 left-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-3",
          isFullscreen ? "rounded-none pb-6 pt-[max(0.75rem,env(safe-area-inset-top))]" : "rounded-t-2xl"
        )}
      >
        <h3 className={cn("text-center font-bold text-white", isFullscreen ? "text-sm md:text-base" : "text-base md:text-lg")}>
          {title}
        </h3>
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
          "relative cursor-grab touch-none overflow-hidden active:cursor-grabbing",
          isFullscreen ? "min-h-0 w-full flex-1" : "aspect-[5/6] max-h-[min(85vh,720px)]"
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
              className="h-full w-full select-none"
              role="img"
              aria-label={title}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <style>{`
                  @keyframes migration-dash {
                    from { stroke-dashoffset: 0; }
                    to { stroke-dashoffset: -36; }
                  }
                  .migration-flow-animated {
                    animation: migration-dash 1.6s linear infinite;
                  }
                `}</style>
                <pattern id={`sea-tn-${patternId}`} patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="#e0f2fe" />
                  <path d="M0 8 L8 0" stroke="#bae6fd" strokeWidth="0.5" />
                </pattern>
                <marker id={`flow-arrow-${patternId}`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
                  <path d="M0,0 L0,7 L7,3.5 z" fill="#0f172a" />
                </marker>
              </defs>
              <rect x={-50} y={-50} width={VIEW_W + 100} height={VIEW_H + 100} fill={`url(#sea-tn-${patternId})`} opacity={0.4} />

              {paths.map(({ key, governorateId, d, nameAr, fill }) => {
                const g = govById[governorateId]!
                const match = legendMatch(g)
                const dim = activeLegendCategory != null && match === false
                const isSel = selectedGovernorateId === governorateId
                const isHover = hoveredGovernorateId === governorateId
                const isolate = selectedGovernorateId != null
                const isOtherGov = isolate && !isSel

                let fillColor = fill
                let fillOpacity: number
                if (isolate && isSel) {
                  fillOpacity = isHover ? 0.98 : 0.95
                } else if (isOtherGov) {
                  fillColor = "#94a3b8"
                  fillOpacity = isHover ? 0.4 : 0.24
                } else if (dim) {
                  fillColor = "#94a3b8"
                  fillOpacity = 0.35
                } else {
                  fillOpacity = isHover || isSel ? 0.95 : 0.88
                }

                return (
                  <path
                    key={key}
                    d={d}
                    fill={fillColor}
                    fillOpacity={fillOpacity}
                    fillRule="evenodd"
                    stroke={
                      isSel ? "#fef08a" : isHover ? "#ffffff" : isOtherGov ? "rgba(15,23,42,0.12)" : "rgba(15,23,42,0.35)"
                    }
                    strokeWidth={isSel ? 3 : isHover ? 2 : 0.8}
                    className="cursor-pointer transition-[fill,fill-opacity,stroke-width] duration-200 ease-out"
                    onClick={() => onSelectGovernorate?.(governorateId)}
                    onMouseEnter={() => onHoverGovernorate?.(governorateId)}
                    onMouseLeave={() => onHoverGovernorate?.(null)}
                  >
                    <title>{nameAr}</title>
                  </path>
                )
              })}

              {showMigrationFlows &&
                MIGRATION_FLOW_PAIRS.map((flow) => {
                  const from = projectedCenters[flow.fromId]
                  const to = projectedCenters[flow.toId]
                  if (!from || !to) return null
                  const pathId = `flow-path-${patternId}-${flow.fromId}-${flow.toId}`
                  return (
                    <g key={`${flow.fromId}-${flow.toId}`}>
                      <path
                        id={pathId}
                        d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${(from.y + to.y) / 2 - 18} ${to.x} ${to.y}`}
                        stroke="#0f172a"
                        strokeWidth="2.2"
                        strokeDasharray="8 7"
                        fill="none"
                        className="migration-flow-animated"
                        markerEnd={`url(#flow-arrow-${patternId})`}
                      />
                    </g>
                  )
                })}

              <g
                className="pointer-events-none"
                aria-hidden="true"
                style={{ fontFamily: "system-ui, 'Segoe UI', Tahoma, sans-serif" }}
              >
                {Object.entries(projectedCenters).map(([governorateId, c]) => {
                  const g = govById[governorateId]
                  if (!g) return null
                  const match = legendMatch(g)
                  const dim = activeLegendCategory != null && match === false
                  const isolate = selectedGovernorateId != null
                  const isSelLabel = selectedGovernorateId === governorateId
                  const fadeLabel = isolate && !isSelLabel
                  const compact =
                    governorateId === "tunis" ||
                    governorateId === "ariana" ||
                    governorateId === "ben_arous" ||
                    governorateId === "manouba"
                  return (
                    <text
                      key={`gov-label-${governorateId}`}
                      x={c.x}
                      y={c.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={fadeLabel ? "#64748b" : dim ? "#475569" : "#0f172a"}
                      fillOpacity={fadeLabel ? 0.22 : dim ? 0.55 : 0.95}
                      stroke="rgba(255,255,255,0.92)"
                      strokeWidth={compact ? 2.2 : 2.8}
                      paintOrder="stroke fill"
                      style={{ fontSize: compact ? 9 : 11, fontWeight: 700 }}
                    >
                      {g.nameAr}
                    </text>
                  )
                })}
              </g>
            </svg>
          )}
        </div>
      </div>

      {hoveredName && (
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-1.5 text-sm font-semibold text-background shadow-lg transition-opacity duration-200",
            isFullscreen ? "bottom-[4.75rem]" : "bottom-14"
          )}
          dir="rtl"
        >
          {hoveredName}
        </div>
      )}

      {isFullscreen && mapMode === "density" && (
        <div
          dir="rtl"
          className="absolute start-3 top-24 z-30 flex max-h-[min(70vh,calc(100dvh-11rem))] w-[min(13.5rem,calc(100vw-1.75rem))] flex-col gap-1 overflow-y-auto rounded-2xl border border-sky-300/25 bg-slate-900/92 p-2.5 shadow-2xl shadow-slate-950/50 backdrop-blur-md"
          aria-label="مفتاح الخريطة"
        >
          <p className="border-b border-slate-600/50 pb-1.5 text-center text-[11px] font-bold text-slate-100">مفتاح الخريطة</p>
          {DENSITY_FULLSCREEN_LEGEND_ORDER.map((id) => {
            const active = activeLegendCategory === id
            const rowClass = cn(
              "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-right transition-colors",
              active ? "bg-white/15 ring-1 ring-amber-300/65" : "bg-slate-800/35 hover:bg-slate-800/55",
              onDensityLegendSelect && "cursor-pointer"
            )
            const inner = (
              <>
                <span
                  className="h-3 w-3 shrink-0 rounded-sm shadow-sm"
                  style={{ backgroundColor: DENSITY_LEGEND_COLORS[id] }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-slate-100">
                  {DENSITY_LEGEND_LABELS_AR[id]}
                </span>
                <span className="shrink-0 rounded-md bg-slate-950/55 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-slate-200">
                  {densityCounts[id]}
                </span>
              </>
            )
            if (onDensityLegendSelect) {
              return (
                <button key={id} type="button" className={rowClass} onClick={() => onDensityLegendSelect(id)}>
                  {inner}
                </button>
              )
            }
            return (
              <div key={id} className={rowClass}>
                {inner}
              </div>
            )
          })}
        </div>
      )}

      {isFullscreen && mapMode === "migration" && (
        <div
          dir="rtl"
          className="absolute start-3 top-24 z-30 flex max-h-[min(70vh,calc(100dvh-11rem))] w-[min(14rem,calc(100vw-1.75rem))] flex-col gap-1 overflow-y-auto rounded-2xl border border-sky-300/25 bg-slate-900/92 p-2.5 shadow-2xl shadow-slate-950/50 backdrop-blur-md"
          aria-label="مفتاح الخريطة"
        >
          <p className="border-b border-slate-600/50 pb-1.5 text-center text-[11px] font-bold text-slate-100">مفتاح الخريطة</p>
          {MIGRATION_FULLSCREEN_ORDER.map((id) => {
            const meta = MIGRATION_FULLSCREEN_META[id]
            const active = activeLegendCategory === id
            const rowClass = cn(
              "flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-right transition-colors",
              active ? migrationLegendRowActiveClass(id) : "bg-slate-800/35 hover:bg-slate-800/55",
              onMigrationLegendSelect && "cursor-pointer"
            )
            const count =
              id === "flows" ? migrationLegendCounts.flows : id === "positive" ? migrationLegendCounts.positive : migrationLegendCounts.negative
            const inner = (
              <>
                <span
                  className="h-3 w-3 shrink-0 rounded-sm shadow-sm"
                  style={{ backgroundColor: meta.swatch }}
                  aria-hidden
                />
                <span className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-slate-100">{meta.label}</span>
                <span className="shrink-0 rounded-md bg-slate-950/55 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-slate-200">
                  {count}
                </span>
              </>
            )
            if (onMigrationLegendSelect) {
              return (
                <button key={id} type="button" className={rowClass} onClick={() => onMigrationLegendSelect(id)}>
                  {inner}
                </button>
              )
            }
            return (
              <div key={id} className={rowClass}>
                {inner}
              </div>
            )
          })}
        </div>
      )}

      <div
        className={cn(
          "absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/95 px-2 py-1 shadow-md backdrop-blur",
          isFullscreen
            ? "bottom-[max(0.75rem,env(safe-area-inset-bottom))] gap-1.5 py-1.5 opacity-100"
            : "bottom-3 opacity-90 group-hover:opacity-100"
        )}
      >
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
