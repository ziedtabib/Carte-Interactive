import { getAverageQuizScoreForUnit } from "@/lib/analytics"

export interface NextStep {
  messageAr: string
  href: string
  priority: "study" | "next" | "revision"
}

/**
 * Suggests next lesson or revision when scores are low (uses local analytics).
 */
export function getRecommendedNextStep(currentUnit: number, currentMap: number): NextStep {
  const avg = getAverageQuizScoreForUnit(currentUnit)
  if (avg !== null && avg < 0.5) {
    return {
      messageAr: "نتائج الاختبار في هذه الوحدة منخفضة قليلاً — راجع الدرس ثم أعد المحاولة.",
      href: `/unit/${currentUnit}/${currentMap}`,
      priority: "revision",
    }
  }

  if (currentMap < 2 && currentUnit < 4) {
    return {
      messageAr: "انتقل إلى الخريطة التالية في نفس الوحدة.",
      href: `/unit/${currentUnit}/${currentMap + 1}`,
      priority: "next",
    }
  }

  if (currentUnit < 4) {
    return {
      messageAr: "انتقل إلى الوحدة التالية.",
      href: `/unit/${currentUnit + 1}/1`,
      priority: "next",
    }
  }

  return {
    messageAr: "أحسنت! راجع الدروس من الصفحة الرئيسية متى شئت.",
    href: "/",
    priority: "study",
  }
}

export function hasLowPerformance(unit: number): boolean {
  const avg = getAverageQuizScoreForUnit(unit)
  return avg !== null && avg < 0.5
}
