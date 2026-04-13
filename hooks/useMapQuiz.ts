"use client"

import { useMemo, useState } from "react"
import type { MigrationType } from "@/data/migrationData"

interface QuizQuestion {
  id: string
  promptAr: string
  expectedType: MigrationType
}

const QUESTIONS: QuizQuestion[] = [
  { id: "q1", promptAr: "اضغط على منطقة ذات حصيلة إيجابية", expectedType: "positive" },
  { id: "q2", promptAr: "اضغط على منطقة ذات حصيلة سلبية", expectedType: "negative" },
]

export function useMapQuiz() {
  const [enabled, setEnabled] = useState(false)
  const [step, setStep] = useState(0)
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null)
  const [correctRegionName, setCorrectRegionName] = useState<string | null>(null)

  const currentQuestion = enabled ? QUESTIONS[step] : null
  const completed = enabled && step >= QUESTIONS.length

  const statusMessage = useMemo(() => {
    if (!enabled) return "فعّل وضع الاختبار للتدرّب مباشرة على الخريطة."
    if (completed) return "رائع! أنهيت اختبار الخريطة بنجاح."
    if (lastResult === "correct") return "إجابة صحيحة! تابع السؤال التالي."
    if (lastResult === "wrong") {
      return correctRegionName
        ? `إجابة غير صحيحة. مثال صحيح: ${correctRegionName}`
        : "إجابة غير صحيحة. جرّب مرة أخرى."
    }
    return "اختر الولاية المناسبة حسب السؤال."
  }, [enabled, completed, lastResult, correctRegionName])

  function startQuiz() {
    setEnabled(true)
    setStep(0)
    setLastResult(null)
    setCorrectRegionName(null)
  }

  function stopQuiz() {
    setEnabled(false)
    setStep(0)
    setLastResult(null)
    setCorrectRegionName(null)
  }

  function answer(regionType: MigrationType, suggestions: string[]) {
    if (!currentQuestion) return { correct: false }
    const correct = regionType === currentQuestion.expectedType
    setLastResult(correct ? "correct" : "wrong")
    if (correct) {
      setCorrectRegionName(null)
      setStep((s) => s + 1)
      return { correct: true }
    }
    setCorrectRegionName(suggestions[0] ?? null)
    return { correct: false }
  }

  return {
    enabled,
    completed,
    currentQuestion,
    statusMessage,
    lastResult,
    startQuiz,
    stopQuiz,
    answer,
  }
}
