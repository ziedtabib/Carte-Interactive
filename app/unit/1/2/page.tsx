"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, HelpCircle, MoveRight, TrendingDown, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { QuizDialog } from "@/components/quiz-dialog"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { InteractiveTunisiaMap } from "@/components/maps/InteractiveTunisiaMap"
import { cn } from "@/lib/utils"
import { playMigrationLegendSound, playSoundSimple } from "@/lib/sounds"
import { governorates } from "@/lib/tunisia-geojson"
import { MIGRATION_LEGEND_COLORS } from "@/lib/tunisia-data"

type LegendCategory = "positive" | "negative" | "flows" | null

const UNIT_1_LESSON = "الدرس 1: التوزع الجغرافي للسكان والأدفاق الهجرية في البلاد التونسية"
const MAP_2_TITLE = "الخريطة 2: الهجرة الداخلية بالبلاد التونسية"

const legendItems = [
  {
    id: "positive" as const,
    label: "حصيلة هجرية إيجابية",
    description: "مناطق استقبال السكان",
    color: MIGRATION_LEGEND_COLORS.positive,
    icon: TrendingUp,
  },
  {
    id: "negative" as const,
    label: "حصيلة هجرية سلبية",
    description: "مناطق تفقد السكان",
    color: MIGRATION_LEGEND_COLORS.negative,
    icon: TrendingDown,
  },
  {
    id: "flows" as const,
    label: "الأدفاق الهجرية",
    description: "اتجاهات حركة السكان",
    color: MIGRATION_LEGEND_COLORS.flows,
    icon: MoveRight,
  },
]

/** 11 = مناطق الاستقبال، 12 = مناطق الطرد، 13 = اتجاهات الهجرة — `public/music/11.mp3` … `13.mp3` */
const MIGRATION_LEGEND_SOUND = {
  positive: 11,
  negative: 12,
  flows: 13,
} as const satisfies Record<(typeof legendItems)[number]["id"], 11 | 12 | 13>

const quizQuestions = [
  {
    question: "ما معنى حصيلة هجرية إيجابية؟",
    options: ["المنطقة تفقد سكانها", "المنطقة تستقبل سكاناً جدداً", "السكان لا يتحركون", "الهجرة نحو الخارج"],
    correctIndex: 1,
  },
  {
    question: "لماذا يهاجر السكان من الداخل نحو الساحل؟",
    options: ["المناخ البارد", "البحث عن فرص العمل", "حب السفر", "الفضول فقط"],
    correctIndex: 1,
  },
  {
    question: "أي منطقة لها حصيلة هجرية سلبية؟",
    options: ["تونس العاصمة", "صفاقس", "سيدي بوزيد", "سوسة"],
    correctIndex: 2,
  },
]

export default function Unit1Map2Page() {
  const [activeCategory, setActiveCategory] = useState<LegendCategory>(null)
  const [selectedGovId, setSelectedGovId] = useState<string | null>(null)
  const [hoveredGovId, setHoveredGovId] = useState<string | null>(null)

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    playSoundSimple(type, 0.3)
  }

  const selectedGov = useMemo(
    () => (selectedGovId ? governorates.find((g) => g.id === selectedGovId) : undefined),
    [selectedGovId]
  )

  const selectedMigration = useMemo(() => {
    if (selectedGov) {
      return {
        name: selectedGov.nameAr,
        description:
          selectedGov.migration === "positive"
            ? "هذه الولاية تُسجّل حصيلة هجرية إيجابية لأنها تستقبل سكاناً من ولايات أخرى."
            : "هذه الولاية تُسجّل حصيلة هجرية سلبية لأنها تفقد جزءاً من سكانها نحو مناطق الاستقبال.",
        details:
          selectedGov.migration === "positive"
            ? "حصيلة إيجابية (منطقة استقبال)"
            : "حصيلة سلبية (منطقة طرد)",
      }
    }
    if (activeCategory === "positive") {
      return {
        name: "مناطق الاستقبال",
        description: "هذه المناطق تستقبل السكان القادمين من الداخل. توفر فرص عمل وخدمات أفضل.",
        details: "أمثلة: تونس، صفاقس، سوسة، المنستير، نابل، مدنين، قبلي، توزر",
      }
    }
    if (activeCategory === "negative") {
      return {
        name: "مناطق الطرد",
        description: "هذه المناطق تفقد سكانها الذين يهاجرون نحو الساحل والعاصمة.",
        details: "أمثلة: سيدي بوزيد، القصرين، قفصة، جندوبة، الكاف، سليانة",
      }
    }
    if (activeCategory === "flows") {
      return {
        name: "اتجاهات الهجرة",
        description: "الأسهم توضّح انتقال السكان من الداخل نحو الساحل والشمال الشرقي.",
        details: "راقب اتجاه كل سهم من منطقة الطرد إلى منطقة الاستقبال.",
      }
    }
    return null
  }, [activeCategory, selectedGov])

  function handleLegendClick(id: Exclude<LegendCategory, null>) {
    setSelectedGovId(null)
    const closing = activeCategory === id
    setActiveCategory(closing ? null : id)
    if (closing) {
      playSound("pop")
    } else {
      playMigrationLegendSound(MIGRATION_LEGEND_SOUND[id])
    }
  }

  function handleGovernorateSelect(id: string) {
    const gov = governorates.find((g) => g.id === id)
    if (!gov) return
    setSelectedGovId(id)
    setActiveCategory(gov.migration)
    playSound("pop")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-amber-50 to-orange-50">
      <header className="sticky top-0 z-50 shadow-md">
        <div className="border-b-4 border-red-200 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-2 pb-2 sm:px-4 sm:pb-2.5">
            <div className="flex h-12 items-center justify-between gap-2 sm:h-14">
              <Link href="/">
                <Button variant="ghost" className="h-9 shrink-0 rounded-xl px-2 text-foreground hover:bg-red-50 hover:text-red-600 sm:px-3">
                  <ArrowRight className="ml-1 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
                  <span className="max-w-[5.5rem] truncate text-[11px] sm:max-w-none sm:text-sm">العودة للرئيسية</span>
                </Button>
              </Link>

              <h1 className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-2 sm:text-right">
                <span className="hidden items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800 sm:inline-flex sm:text-xs">
                  <Users className="h-3.5 w-3.5 shrink-0 text-red-600 sm:h-4 sm:w-4" />
                  الوحدة الأولى
                </span>
                <span className="truncate text-xs font-bold leading-tight text-red-600 sm:text-sm md:max-w-[min(100%,28rem)]">
                  البلاد التونسية: السكان
                </span>
              </h1>

              <div className="flex shrink-0 items-center">
                <div className="h-10 w-10 sm:h-11 sm:w-11">
                  <ExplorerCharacter size="sm" />
                </div>
              </div>
            </div>
            <UnitMapNav unit={1} mapIndex={2} totalMaps={2} lessonTitle={UNIT_1_LESSON} mapTitle={MAP_2_TITLE} theme="red" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="rounded-3xl border-2 border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-sky-50/50 p-5 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-100 to-sky-100">
                  <BookOpen className="h-5 w-5 text-sky-800" />
                </div>
                مفتاح الخريطة
              </h3>

              <div className="space-y-3">
                {legendItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLegendClick(item.id)}
                      className={cn(
                        "w-full rounded-2xl border-2 p-4 text-right transition-all duration-300",
                        "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
                        activeCategory === item.id
                          ? item.id === "positive"
                            ? "border-fuchsia-400 shadow-lg ring-2 ring-fuchsia-200/90"
                            : item.id === "negative"
                              ? "border-sky-400 shadow-lg ring-2 ring-sky-200/90"
                              : "border-slate-500 shadow-lg ring-2 ring-slate-200"
                          : cn(
                              "border-slate-200/90 bg-white/80",
                              item.id === "positive" && "hover:border-fuchsia-200",
                              item.id === "negative" && "hover:border-sky-200",
                              item.id === "flows" && "hover:border-slate-300"
                            )
                      )}
                      style={{ backgroundColor: activeCategory === item.id ? `${item.color}22` : undefined }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: item.color }}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base">{item.label}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن الهجرة الداخلية">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <InteractiveTunisiaMap
              title={MAP_2_TITLE}
              mapMode="migration"
              activeLegendCategory={activeCategory}
              selectedGovernorateId={selectedGovId}
              hoveredGovernorateId={hoveredGovId}
              onMigrationLegendSelect={(id) => handleLegendClick(id)}
              onSelectGovernorate={handleGovernorateSelect}
              onHoverGovernorate={setHoveredGovId}
            />

            <div className="mt-4 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 text-sm backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded shadow-sm" style={{ backgroundColor: MIGRATION_LEGEND_COLORS.positive }} />
                <span>حصيلة إيجابية</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded shadow-sm" style={{ backgroundColor: MIGRATION_LEGEND_COLORS.negative }} />
                <span>حصيلة سلبية</span>
              </div>
              <div className="flex items-center gap-2">
                <MoveRight className="w-4 h-4" />
                <span>اتجاه الهجرة</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200">
              {selectedMigration ? (
                <div className="space-y-3" dir="rtl">
                  <h3 className="font-bold text-xl text-red-700">{selectedMigration.name}</h3>
                  <p className="leading-relaxed text-foreground">{selectedMigration.description}</p>
                  <p className="text-sm text-muted-foreground">{selectedMigration.details}</p>
                </div>
              ) : (
                <p className="text-foreground leading-relaxed" dir="rtl">
                  اضغط على ولاية داخل الخريطة لتظهر لك نوع الحصيلة الهجرية وشرحها.
                </p>
              )}
            </div>

            <ChapterChatbot unitNumber={1} theme="red" />

            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-red-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 text-foreground leading-relaxed" dir="rtl">
                <p>
                  <strong className="text-red-600">الهجرة الداخلية</strong> هي انتقال السكان داخل البلاد من منطقة إلى أخرى، غالبا من الداخل نحو الساحل.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-emerald-700">حصيلة إيجابية:</strong> المنطقة تستقبل مهاجرين.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-rose-700">حصيلة سلبية:</strong> المنطقة تفقد سكانها.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
