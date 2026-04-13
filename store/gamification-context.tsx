"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { recordQuizResult } from "@/lib/analytics"

export type BadgeId =
  | "explorer_beginner"
  | "climate_expert"
  | "geography_king"
  | "quiz_master"
  | "map_explorer"

export interface BadgeDef {
  id: BadgeId
  titleAr: string
  descriptionAr: string
}

export const BADGES: BadgeDef[] = [
  { id: "explorer_beginner", titleAr: "مستكشف مبتدئ", descriptionAr: "أكمل أول درس أو خريطة تفاعلية." },
  { id: "climate_expert", titleAr: "خبير المناخ", descriptionAr: "ثلاثة اختبارات ناجحة في الوحدة الثانية." },
  { id: "geography_king", titleAr: "ملك الجغرافيا", descriptionAr: "مجموع النقاط يتجاوز 500." },
  { id: "quiz_master", titleAr: "سيد الاختبارات", descriptionAr: "10 إجابات صحيحة متتالية في الاختبارات." },
  { id: "map_explorer", titleAr: "مستكشف الخرائط", descriptionAr: "استخدم الخريطة التفاعلية في وحدتين مختلفتين." },
]

const STORAGE_KEY = "tunisia-gamification-v1"

interface Persisted {
  score: number
  streak: number
  bestStreak: number
  mapsInteractedUnits: number[]
  quizSuccessByUnit: Record<number, number>
  unlockedBadges: BadgeId[]
  progressByUnit: Record<number, number>
}

function load(): Persisted {
  if (typeof window === "undefined") {
    return defaultState()
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return { ...defaultState(), ...JSON.parse(raw) }
  } catch {
    return defaultState()
  }
}

function defaultState(): Persisted {
  return {
    score: 0,
    streak: 0,
    bestStreak: 0,
    mapsInteractedUnits: [],
    quizSuccessByUnit: {},
    unlockedBadges: [],
    progressByUnit: { 1: 0, 2: 0, 3: 0, 4: 0 },
  }
}

function save(s: Persisted) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

function hasBadge(list: BadgeId[], id: BadgeId) {
  return list.includes(id)
}

export interface GamificationContextValue extends Persisted {
  bumpProgress: (unit: number, delta: number) => void
  addScore: (points: number) => void
  registerQuizResult: (unit: number, mapIndex: number, correct: number, total: number) => void
  registerMapInteraction: (unit: number) => void
}

const GamificationContext = createContext<GamificationContextValue | null>(null)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(defaultState)

  useEffect(() => {
    setState(load())
  }, [])

  useEffect(() => {
    save(state)
  }, [state])

  const bumpProgress = useCallback((unit: number, delta: number) => {
    setState((s) => ({
      ...s,
      progressByUnit: {
        ...s.progressByUnit,
        [unit]: Math.min(1, (s.progressByUnit[unit] ?? 0) + delta),
      },
    }))
  }, [])

  const addScore = useCallback((points: number) => {
    setState((s) => {
      const score = s.score + points
      const unlockedBadges = [...s.unlockedBadges]
      if (score >= 500 && !hasBadge(unlockedBadges, "geography_king")) unlockedBadges.push("geography_king")
      return { ...s, score, unlockedBadges }
    })
  }, [])

  const registerMapInteraction = useCallback((unit: number) => {
    setState((s) => {
      const mapsInteractedUnits = s.mapsInteractedUnits.includes(unit)
        ? s.mapsInteractedUnits
        : [...s.mapsInteractedUnits, unit]
      const unlockedBadges = [...s.unlockedBadges]
      if (mapsInteractedUnits.length >= 1 && !hasBadge(unlockedBadges, "explorer_beginner"))
        unlockedBadges.push("explorer_beginner")
      if (mapsInteractedUnits.length >= 2 && !hasBadge(unlockedBadges, "map_explorer")) unlockedBadges.push("map_explorer")
      return { ...s, mapsInteractedUnits, unlockedBadges }
    })
  }, [])

  const registerQuizResult = useCallback(
    (unit: number, mapIndex: number, correct: number, total: number) => {
      recordQuizResult(unit, mapIndex, correct, total)
      const ratio = total > 0 ? correct / total : 0
      setState((s) => {
        let streak = s.streak
        let bestStreak = s.bestStreak
        if (ratio >= 0.66) {
          streak += 1
          bestStreak = Math.max(bestStreak, streak)
        } else {
          streak = 0
        }
        const quizSuccessByUnit = { ...s.quizSuccessByUnit }
        if (ratio >= 0.66) {
          quizSuccessByUnit[unit] = (quizSuccessByUnit[unit] ?? 0) + 1
        }
        const points = correct * 10 + (ratio >= 1 ? 50 : 0)
        const score = s.score + points
        const unlockedBadges = [...s.unlockedBadges]
        if ((quizSuccessByUnit[2] ?? 0) >= 3 && !hasBadge(unlockedBadges, "climate_expert"))
          unlockedBadges.push("climate_expert")
        if (bestStreak >= 10 && !hasBadge(unlockedBadges, "quiz_master")) unlockedBadges.push("quiz_master")
        if (score >= 500 && !hasBadge(unlockedBadges, "geography_king")) unlockedBadges.push("geography_king")
        return {
          ...s,
          score,
          streak,
          bestStreak,
          quizSuccessByUnit,
          unlockedBadges,
          progressByUnit: {
            ...s.progressByUnit,
            [unit]: Math.min(1, (s.progressByUnit[unit] ?? 0) + ratio * 0.2),
          },
        }
      })
    },
    []
  )

  const value = useMemo<GamificationContextValue>(
    () => ({
      ...state,
      bumpProgress,
      addScore,
      registerQuizResult,
      registerMapInteraction,
    }),
    [state, bumpProgress, addScore, registerQuizResult, registerMapInteraction]
  )

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>
}

export function useGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext)
  if (!ctx) {
    throw new Error("useGamification must be used within GamificationProvider")
  }
  return ctx
}
