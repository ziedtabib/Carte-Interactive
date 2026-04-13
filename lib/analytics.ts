/**
 * Lightweight client-side analytics & session tracking (localStorage).
 * Optional: swap implementation for Firebase/Mongo later — keep the same exported API.
 */

const STORAGE_KEY = "tunisia_digital_analytics_v1"

export interface LessonProgress {
  unit: number
  mapIndex: number
  completedAt: number
  timeSpentMs: number
}

export interface QuizRecord {
  unit: number
  mapIndex: number
  score: number
  maxScore: number
  at: number
}

export interface AnalyticsState {
  sessions: number
  lastVisit: number
  /** cumulative ms per unit */
  timeByUnit: Record<number, number>
  completedLessons: LessonProgress[]
  quizAttempts: QuizRecord[]
}

function load(): AnalyticsState {
  if (typeof window === "undefined") {
    return defaultState()
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AnalyticsState
    return { ...defaultState(), ...parsed, timeByUnit: parsed.timeByUnit ?? {} }
  } catch {
    return defaultState()
  }
}

function defaultState(): AnalyticsState {
  return {
    sessions: 0,
    lastVisit: 0,
    timeByUnit: {},
    completedLessons: [],
    quizAttempts: [],
  }
}

function save(state: AnalyticsState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

export function recordSessionStart(): void {
  const s = load()
  s.sessions += 1
  s.lastVisit = Date.now()
  save(s)
}

export function addTimeSpent(unit: number, ms: number): void {
  const s = load()
  s.timeByUnit[unit] = (s.timeByUnit[unit] ?? 0) + ms
  save(s)
}

export function recordLessonComplete(unit: number, mapIndex: number, timeSpentMs: number): void {
  const s = load()
  s.completedLessons.push({
    unit,
    mapIndex,
    completedAt: Date.now(),
    timeSpentMs,
  })
  save(s)
}

export function recordQuizResult(
  unit: number,
  mapIndex: number,
  score: number,
  maxScore: number
): void {
  const s = load()
  s.quizAttempts.push({
    unit,
    mapIndex,
    score,
    maxScore,
    at: Date.now(),
  })
  save(s)
}

export function getAnalyticsSnapshot(): AnalyticsState {
  return load()
}

export function getAverageQuizScoreForUnit(unit: number): number | null {
  const s = load()
  const rows = s.quizAttempts.filter((q) => q.unit === unit)
  if (rows.length === 0) return null
  const sum = rows.reduce((acc, q) => acc + q.score / Math.max(1, q.maxScore), 0)
  return sum / rows.length
}
