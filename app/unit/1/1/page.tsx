"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, Users, Building2, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveTunisiaMap } from "@/components/maps/InteractiveTunisiaMap"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import { playDensityLegendSound, playSoundSimple } from "@/lib/sounds"
import { governorates, type GovernorateData } from "@/lib/tunisia-geojson"
import { addTimeSpent } from "@/lib/analytics"
import { useGamification } from "@/store/gamification-context"

const UNIT_1_LESSON =
  "الدرس 1: التوزع الجغرافي للسكان والأدفاق الهجرية في البلاد التونسية"
const MAP_1_TITLE = "الخريطة 1: الكثافات السكانية والمدن بالبلاد التونسية"

function legendIdFromDensity(d: GovernorateData["density"]): string {
  return { very_high: "very-high", high: "high", medium: "medium", low: "low" }[d]
}

const legendItems = [
  { id: "very-high", label: "كثافة مرتفعة جداً", description: "أكثر من 500 ن/كم²", color: "#dc2626", icon: Building2 },
  { id: "high", label: "كثافة مرتفعة", description: "بين 100 و 500 ن/كم²", color: "#16a34a", icon: Users },
  { id: "medium", label: "كثافة ضعيفة", description: "بين 40 و 100 ن/كم²", color: "#eab308", icon: MapPin },
  { id: "low", label: "كثافة ضعيفة جداً", description: "أقل من 40 ن/كم²", color: "#f97316", icon: Sparkles },
] as const

/** 1 = المكتظة جداً، 2 = المرتفعة، 3 = الضعيفة، 4 = الضعيفة جداً — ملفات `/music/1.mp3` … `4.mp3` */
const DENSITY_LEGEND_SOUND = {
  "very-high": 1,
  high: 2,
  medium: 3,
  low: 4,
} as const satisfies Record<(typeof legendItems)[number]["id"], 1 | 2 | 3 | 4>

const densityData: Record<string, {
  name: string
  regions: string[]
  density: string
  population: string
  description: string
  funFact: string
}> = {
  "very-high": {
    name: "المناطق المكتظة جداً",
    regions: ["تونس العاصمة", "أريانة", "بن عروس", "منوبة"],
    density: "أكثر من 500 ن/كم²",
    population: "أكثر من 2.5 مليون نسمة",
    description: "تونس الكبرى هي قلب البلاد النابض! تضم العاصمة والمدن المجاورة وتستقطب السكان بسبب فرص العمل والخدمات.",
    funFact: "تونس العاصمة وحدها تضم أكثر من مليون نسمة!"
  },
  "high": {
    name: "المناطق ذات الكثافة المرتفعة",
    regions: ["صفاقس", "سوسة", "المنستير", "المهدية", "نابل"],
    density: "بين 100 و 500 ن/كم²",
    population: "مئات الآلاف لكل ولاية",
    description: "الساحل الشرقي يتميز بكثافة سكانية عالية بفضل الأنشطة الاقتصادية والسياحية والصناعية.",
    funFact: "صفاقس هي ثاني أكبر مدينة تونسية وتُلقب بعاصمة الجنوب!"
  },
  "medium": {
    name: "المناطق ذات الكثافة الضعيفة",
    regions: ["القيروان", "سيدي بوزيد", "قفصة", "باجة"],
    density: "بين 40 و 100 ن/كم²",
    population: "عشرات الآلاف لكل ولاية",
    description: "المناطق الداخلية تعاني من هجرة السكان نحو الساحل والعاصمة بحثاً عن فرص أفضل.",
    funFact: "القيروان كانت أول عاصمة إسلامية في شمال أفريقيا!"
  },
  "low": {
    name: "المناطق ذات الكثافة الضعيفة جداً",
    regions: ["تطاوين", "قبلي", "توزر", "مدنين"],
    density: "أقل من 40 ن/كم²",
    population: "أقل من 50 ألف نسمة في بعض المناطق",
    description: "الجنوب التونسي يتميز بمساحات شاسعة وقلة السكان بسبب المناخ الصحراوي الجاف.",
    funFact: "رغم قلة السكان، الجنوب غني بالواحات ومناظر الصحراء الخلابة!"
  }
}

const quizQuestions = [
  {
    question: "ما هي المنطقة الأكثر كثافة سكانية في تونس؟",
    options: ["صفاقس", "تونس الكبرى", "سوسة", "القيروان"],
    correctIndex: 1
  },
  {
    question: "لماذا يتركز السكان على الساحل الشرقي؟",
    options: ["المناخ البارد", "الأنشطة الاقتصادية", "قلة المياه", "الجبال العالية"],
    correctIndex: 1
  },
  {
    question: "أي منطقة تتميز بكثافة سكانية ضعيفة جداً؟",
    options: ["الساحل", "الشمال", "الجنوب", "تونس العاصمة"],
    correctIndex: 2
  }
]

export default function Unit1Map1Page() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedGovId, setSelectedGovId] = useState<string | null>(null)
  const [hoveredGovId, setHoveredGovId] = useState<string | null>(null)

  const { registerMapInteraction, bumpProgress } = useGamification()

  const selectedGov = useMemo(
    () => (selectedGovId ? governorates.find((g) => g.id === selectedGovId) : undefined),
    [selectedGovId]
  )

  useEffect(() => {
    const t0 = Date.now()
    return () => addTimeSpent(1, Date.now() - t0)
  }, [])

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    playSoundSimple(type, 0.3)
  }

  const handleLegendClick = (id: (typeof legendItems)[number]["id"]) => {
    const closing = activeCategory === id
    setSelectedGovId(null)
    setActiveCategory(closing ? null : id)
    if (closing) {
      playSound("pop")
    } else {
      playDensityLegendSound(DENSITY_LEGEND_SOUND[id])
    }
  }

  const selectedDensity = activeCategory && !selectedGov ? densityData[activeCategory] : null
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-green-50 to-amber-50">
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
            <UnitMapNav
              unit={1}
              mapIndex={1}
              totalMaps={2}
              lessonTitle={UNIT_1_LESSON}
              mapTitle={MAP_1_TITLE}
              theme="red"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-red-600" />
                </div>
                مفتاح الخريطة
              </h3>
              
              <div className="space-y-3">
                {legendItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleLegendClick(item.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-right",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        activeCategory === item.id 
                          ? "border-red-400 shadow-lg ring-2 ring-red-200" 
                          : "border-gray-100 hover:border-red-200"
                      )}
                      style={{
                        backgroundColor: activeCategory === item.id ? `${item.color}15` : "white"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: item.color }}
                        >
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
            
            <QuizDialog
              questions={quizQuestions}
              title="اختبر معلوماتك عن الكثافة السكانية"
              unitNumber={1}
              mapIndex={1}
              onQuizComplete={() => bumpProgress(1, 0.15)}
            >
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-3">
            <InteractiveTunisiaMap
              title={MAP_1_TITLE}
              mapMode="density"
              activeLegendCategory={activeCategory}
              selectedGovernorateId={selectedGovId}
              hoveredGovernorateId={hoveredGovId}
              onDensityLegendSelect={(id) => handleLegendClick(id)}
              onSelectGovernorate={(id) => {
                playSound("pop")
                const g = governorates.find((x) => x.id === id)
                if (g) {
                  setSelectedGovId(id)
                  setActiveCategory(legendIdFromDensity(g.density))
                  registerMapInteraction(1)
                  bumpProgress(1, 0.05)
                }
              }}
              onHoverGovernorate={setHoveredGovId}
            />
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span>مرتفعة جداً</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-600"></div>
                <span>مرتفعة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span>ضعيفة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span>ضعيفة جداً</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedDensity && !selectedGov} />
                </div>
                <div className="flex-1">
                  {selectedGov ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <h3 className="font-bold text-xl text-red-700 mb-2">{selectedGov.nameAr}</h3>
                      <p className="leading-relaxed text-foreground">
                        عدد السكان تقريباً: {selectedGov.population.toLocaleString("ar-TN")}. الكثافة ضمن فئة{" "}
                        {legendItems.find((l) => l.id === legendIdFromDensity(selectedGov.density))?.label}.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        اضغط على مفتاح آخر أو على ولاية أخرى في الخريطة التفاعلية.
                      </p>
                    </SpeechBubble>
                  ) : selectedDensity ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: legendItems.find(l => l.id === activeCategory)?.color }}
                        >
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-red-700">{selectedDensity.name}</h3>
                      </div>
                      <div className="space-y-2 text-foreground">
                        <p className="leading-relaxed">{selectedDensity.description}</p>
                        <div className="bg-red-50 rounded-xl p-3 mt-3">
                          <p className="text-sm">
                            <strong className="text-red-600">الكثافة:</strong> {selectedDensity.density}
                          </p>
                          <p className="text-sm mt-1">
                            <strong className="text-red-600">عدد السكان:</strong> {selectedDensity.population}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>الولايات:</strong> {selectedDensity.regions.join("، ")}
                        </p>
                      </div>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="text-foreground leading-relaxed">
                        مرحباً! <strong className="text-red-600">الوحدة الأولى: البلاد التونسية: السكان</strong>
                        <br />
                        جرّب <strong className="text-red-600">الخريطة التفاعلية</strong>: اضغط على ولاية أو اختر لوناً من المفتاح.
                      </p>
                    </SpeechBubble>
                  )}
                </div>
              </div>
            </div>

            <ChapterChatbot unitNumber={1} theme="red" />

            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-red-200">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-red-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  <strong className="text-red-600">الكثافة السكانية</strong> هي عدد السكان في كل كيلومتر مربع.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                    <Building2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-red-700">الساحل والعاصمة:</strong> كثافة عالية بسبب الأنشطة الاقتصادية.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <MapPin className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-orange-700">الداخل والجنوب:</strong> كثافة ضعيفة بسبب المناخ الجاف.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
