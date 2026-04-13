"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type UnitNavTheme = "red" | "purple" | "pink" | "green"

/** Séparateur léger sous la barre d’outils (un seul header visuel) */
const themeDivider: Record<UnitNavTheme, string> = {
  red: "border-red-100",
  purple: "border-purple-100",
  pink: "border-pink-100",
  green: "border-green-100",
}

const themeMuted: Record<UnitNavTheme, string> = {
  red: "text-red-900/70",
  purple: "text-purple-900/70",
  pink: "text-pink-900/70",
  green: "text-green-900/70",
}

interface UnitMapNavProps {
  unit: number
  mapIndex: number
  totalMaps: number
  lessonTitle: string
  mapTitle: string
  theme: UnitNavTheme
}

export function UnitMapNav({ unit, mapIndex, totalMaps, lessonTitle, mapTitle, theme }: UnitMapNavProps) {
  const prevHref = mapIndex > 1 ? `/unit/${unit}/${mapIndex - 1}` : null
  const nextHref = mapIndex < totalMaps ? `/unit/${unit}/${mapIndex + 1}` : null
  const nextUnitHref = mapIndex === totalMaps && unit < 4 ? `/unit/${unit + 1}/1` : null

  return (
    <div className={cn("mt-1 border-t pt-2 sm:mt-1.5 sm:pt-2.5", themeDivider[theme])}>
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-3">
          <div className="min-w-0 flex-1 text-center md:text-right">
            <p
              className={cn(
                "text-[11px] font-medium leading-snug sm:text-xs md:line-clamp-1",
                themeMuted[theme]
              )}
              title={lessonTitle}
            >
              {lessonTitle}
            </p>
            <p
              className="mt-0.5 text-xs font-bold text-foreground leading-snug sm:text-sm md:line-clamp-1"
              title={mapTitle}
            >
              {mapTitle}
            </p>
          </div>
          <nav
            className="flex shrink-0 flex-wrap items-center justify-center gap-1 md:justify-end"
            aria-label="تنقّل بين الخرائط"
          >
            {prevHref ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href={prevHref}>← السابق</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="h-8 rounded-full px-2.5 text-xs text-muted-foreground/50" disabled>
                ← السابق
              </Button>
            )}
            <Button
              size="sm"
              className="h-8 min-w-[5.5rem] rounded-full bg-amber-400 px-3 text-xs font-semibold text-black shadow-sm hover:bg-amber-500"
              asChild
            >
              <Link href="/">الرئيسية</Link>
            </Button>
            {nextHref ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href={nextHref}>التالي →</Link>
              </Button>
            ) : nextUnitHref ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href={nextUnitHref}>الوحدة التالية →</Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" className="h-8 rounded-full px-2.5 text-xs text-muted-foreground/50" disabled>
                التالي →
              </Button>
            )}
          </nav>
      </div>
    </div>
  )
}
