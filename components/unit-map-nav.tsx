"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type UnitNavTheme = "red" | "purple" | "pink" | "green"

const themeBar: Record<UnitNavTheme, string> = {
  red: "border-red-200/90 bg-red-50/90",
  purple: "border-purple-200/90 bg-purple-50/90",
  pink: "border-pink-200/90 bg-pink-50/90",
  green: "border-green-200/90 bg-green-50/90",
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
    <div
      className={cn(
        "border-t backdrop-blur-sm",
        themeBar[theme]
      )}
    >
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <p className={cn("text-center text-xs sm:text-sm font-medium leading-snug px-1", themeMuted[theme])}>
          {lessonTitle}
        </p>
        <p className="text-center text-sm sm:text-base font-bold text-foreground leading-snug mt-1 mb-3 px-1">
          {mapTitle}
        </p>
        <nav
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          aria-label="تنقّل بين الخرائط"
        >
          {prevHref ? (
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
              <Link href={prevHref}>← السابق</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground/50" disabled>
              ← السابق
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full min-w-[7rem] bg-amber-400 text-black shadow-sm hover:bg-amber-500 font-semibold"
            asChild
          >
            <Link href="/">الرئيسية</Link>
          </Button>
          {nextHref ? (
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
              <Link href={nextHref}>التالي →</Link>
            </Button>
          ) : nextUnitHref ? (
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-foreground" asChild>
              <Link href={nextUnitHref}>الوحدة التالية →</Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground/50" disabled>
              التالي →
            </Button>
          )}
        </nav>
      </div>
    </div>
  )
}
