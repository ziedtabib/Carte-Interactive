"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  RESOURCE_TYPE_EMOJI,
  RESOURCE_TYPE_LABELS,
  TUNISIA_RESOURCE_POINTS,
  type ResourceType,
  type TunisiaResourcePoint,
} from "@/lib/tunisia-resources"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const MAP_SRC = "/carte1.jpg"

/** Avec `object-contain`, la carte ne couvre pas tout le cadre : les marqueurs sont placés dans cette zone (pourcentages du cadre). */
const MARKER_LAYER_INSET = {
  top: "9%",
  left: "7%",
  right: "7%",
  bottom: "11%",
} as const

function clampPct(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

const LEGEND_FILTERS: { type: ResourceType | "all"; label: string }[] = [
  { type: "all", label: "الكل" },
  { type: "oil", label: "نفط" },
  { type: "gas", label: "غاز" },
  { type: "phosphate", label: "فسفاط" },
  { type: "electric", label: "كهرباء" },
  { type: "iron", label: "حديد" },
]

interface InteractiveTunisiaResourcesMapProps {
  title: string
  className?: string
  /** Appelé quand l’utilisateur ouvre le détail d’un point (pour la colonne droite de la page). */
  onPointSelect?: (point: TunisiaResourcePoint | null) => void
}

export function InteractiveTunisiaResourcesMap({
  title,
  className,
  onPointSelect,
}: InteractiveTunisiaResourcesMapProps) {
  const [activeFilter, setActiveFilter] = useState<ResourceType | "all">("all")
  const [dialogPoint, setDialogPoint] = useState<TunisiaResourcePoint | null>(null)

  const visible = useMemo(() => {
    return TUNISIA_RESOURCE_POINTS.filter(
      (r) => activeFilter === "all" || r.type === activeFilter
    )
  }, [activeFilter])

  const openDetail = (p: TunisiaResourcePoint) => {
    setDialogPoint(p)
    onPointSelect?.(p)
  }

  const closeDialog = (open: boolean) => {
    if (!open) setDialogPoint(null)
  }

  return (
    <div className={cn("space-y-3", className)} dir="rtl">
      <h3 className="text-center text-lg font-bold text-pink-800 sm:text-xl">{title}</h3>

      {/* مفتاح تفاعلي — تصفية الرموز على الخريطة */}
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

      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-pink-100 bg-muted shadow-inner">
        <Image
          src={MAP_SRC}
          alt={title}
          fill
          className="object-contain select-none"
          sizes="(min-width: 1024px) 40vw, 90vw"
          priority
          draggable={false}
        />

        {/* Calque aligné sur la zone visible de la Tunisie (réduit les symboles hors carte) */}
        <div
          className="pointer-events-none absolute z-30"
          style={{
            top: MARKER_LAYER_INSET.top,
            left: MARKER_LAYER_INSET.left,
            right: MARKER_LAYER_INSET.right,
            bottom: MARKER_LAYER_INSET.bottom,
          }}
        >
          <div className="pointer-events-auto relative h-full w-full">
            {visible.map((point) => (
              <Tooltip key={point.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "absolute z-30 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
                      "border-2 border-white/90 bg-white/85 text-lg shadow-md backdrop-blur-sm",
                      "transition-transform duration-200 hover:scale-125 hover:shadow-lg",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                    )}
                    style={{
                      left: `${clampPct(point.x, 4, 96)}%`,
                      top: `${clampPct(point.y, 4, 94)}%`,
                    }}
                    onClick={() => openDetail(point)}
                    aria-label={`${point.name} — ${RESOURCE_TYPE_LABELS[point.type]}`}
                  >
                    <span aria-hidden>{RESOURCE_TYPE_EMOJI[point.type]}</span>
                  </button>
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
          </div>
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
