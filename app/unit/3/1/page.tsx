"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, MoveRight, TrendingUp, TrendingDown, Volume2, VolumeX, Home, Music, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveMapImage } from "@/components/interactive-map-image"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import { playSoundSimple } from "@/lib/sounds"
import { MIGRATION_LEGEND_COLORS } from "@/lib/tunisia-data"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"

const UNIT_3_LESSON_1 = "الدرس 1: ظروف النشاط الصناعي: الموارد والظروف البشرية"
const UNIT_3_MAP_RESOURCES = "الخريطة: الموارد الطاقية والمنجمية في البلاد التونسية"

const legendItems = [
  { id: "positive", label: "حصيلة هجرية إيجابية", description: "مناطق استقبال السكان", color: MIGRATION_LEGEND_COLORS.positive, icon: TrendingUp },
  { id: "negative", label: "حصيلة هجرية سلبية", description: "مناطق تفقد السكان", color: MIGRATION_LEGEND_COLORS.negative, icon: TrendingDown },
  { id: "flows", label: "الأدفاق الهجرية", description: "اتجاهات حركة السكان", color: MIGRATION_LEGEND_COLORS.flows, icon: MoveRight },
]

const migrationData: Record<string, {
  name: string
  regions: string[]
  description: string
  details: string
  funFact: string
}> = {
  positive: {
    name: "مناطق الاستقبال",
    regions: ["تونس الكبرى", "صفاقس", "سوسة", "المنستير", "نابل"],
    description: "هذه المناطق تستقبل السكان القادمين من الداخل. توفر فرص عمل أفضل وخدمات متطورة.",
    details: "الساحل والعاصمة يجذبان الشباب بحثاً عن العمل والدراسة",
    funFact: "تستقبل تونس الكبرى وحدها أكثر من 40% من المهاجرين الداخليين!"
  },
  negative: {
    name: "مناطق الطرد",
    regions: ["سيدي بوزيد", "القصرين", "قفصة", "جندوبة", "الكاف", "سليانة"],
    description: "هذه المناطق تفقد سكانها الذين يهاجرون نحو الساحل والعاصمة بحثاً عن حياة أفضل.",
    details: "ضعف فرص العمل والخدمات يدفع السكان للهجرة",
    funFact: "بعض قرى الداخل فقدت أكثر من نصف سكانها في العقود الأخيرة!"
  },
  flows: {
    name: "اتجاهات الهجرة",
    regions: ["من الشمال الغربي", "من الوسط الغربي", "من الجنوب"],
    description: "الأسهم السوداء على الخريطة تُظهر حركة السكان من الداخل نحو الساحل وتونس الكبرى.",
    details: "الهجرة تتجه أساساً من الغرب والجنوب نحو الشرق والشمال",
    funFact: "معظم المهاجرين هم شباب تتراوح أعمارهم بين 20 و35 سنة!"
  }
}

const quizQuestions = [
  {
    question: "ما معنى حصيلة هجرية إيجابية؟",
    options: ["المنطقة تفقد سكانها", "المنطقة تستقبل سكاناً جدداً", "السكان لا يتحركون", "الهجرة نحو الخارج"],
    correctIndex: 1
  },
  {
    question: "لماذا يهاجر السكان من الداخل نحو الساحل؟",
    options: ["المناخ البارد", "البحث عن فرص العمل", "حب السفر", "الفضول فقط"],
    correctIndex: 1
  },
  {
    question: "أي منطقة لها حصيلة هجرية سلبية؟",
    options: ["تونس العاصمة", "صفاقس", "سيدي بوزيد", "سوسة"],
    correctIndex: 2
  }
]

export default function Unit3Map1Page() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const { isMusicOn, toggleMusic: toggleSiteMusic } = useBackgroundMusicToggle()

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    if (!isSoundEnabled) return
    playSoundSimple(type, 0.3)
  }

  const handleLegendClick = (id: string) => {
    playSound("pop")
    setActiveCategory(activeCategory === id ? null : id)
  }

  const toggleMusic = () => {
    toggleSiteMusic()
    playSound("click")
  }

  const selectedMigration = activeCategory ? migrationData[activeCategory] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-slate-50">
      <header className="sticky top-0 z-50 shadow-md">
        <div className="border-b-4 border-pink-200 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 pb-2">
            <div className="flex h-16 items-center justify-between">
              <Link href="/">
                <Button variant="ghost" className="text-foreground hover:bg-pink-50 hover:text-pink-600 rounded-xl">
                  <ArrowRight className="ml-2 h-5 w-5" />
                  العودة للرئيسية
                </Button>
              </Link>

              <h1 className="flex flex-1 flex-col items-center gap-1 text-center text-base font-bold text-foreground sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-right md:text-lg">
                <div className="hidden items-center gap-2 rounded-full bg-pink-100 px-3 py-1 sm:flex">
                  <MoveRight className="h-5 w-5 shrink-0 text-pink-600" />
                  <span>الوحدة الثالثة</span>
                </div>
                <span className="leading-snug text-pink-600">الصناعة بالبلاد التونسية</span>
              </h1>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSoundEnabled(!isSoundEnabled)
                    playSound("click")
                  }}
                  className="rounded-full"
                  title={isSoundEnabled ? "إيقاف المؤثرات الصوتية" : "تشغيل المؤثرات الصوتية"}
                >
                  {isSoundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMusic}
                  className="rounded-full"
                  title={isMusicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
                >
                  {isMusicOn ? <Music className="h-5 w-5 text-primary" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <div className="h-12 w-12">
                  <ExplorerCharacter size="sm" />
                </div>
              </div>
            </div>
            <UnitMapNav
              unit={3}
              mapIndex={1}
              totalMaps={2}
              lessonTitle={UNIT_3_LESSON_1}
              mapTitle={UNIT_3_MAP_RESOURCES}
              theme="pink"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-pink-700">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-pink-600" />
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
                        "w-full p-4 rounded-2xl border-2 transition-all duration-300 text-right",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        activeCategory === item.id 
                          ? "border-pink-400 shadow-lg ring-2 ring-pink-200" 
                          : "border-gray-100 hover:border-pink-200"
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
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن الخريطة">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-pink-600 to-sky-500 hover:from-pink-700 hover:to-sky-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-pink-200 overflow-hidden">
              <InteractiveMapImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151129-0Jyi053HtKdXLIPej9lZVf6hJjjuKy.png"
                alt="خريطة الموارد الطاقية والمنجمية في البلاد التونسية"
                title={UNIT_3_MAP_RESOURCES}
                highlightColor={activeCategory ? legendItems.find(l => l.id === activeCategory)?.color : undefined}
              />
            </div>

            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-pink-500"></div>
                <span>حصيلة إيجابية</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-sky-500"></div>
                <span>حصيلة سلبية</span>
              </div>
              <div className="flex items-center gap-2">
                <MoveRight className="w-4 h-4" />
                <span>اتجاه الهجرة</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedMigration} />
                </div>
                <div className="flex-1">
                  {selectedMigration ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: legendItems.find(l => l.id === activeCategory)?.color }}
                        >
                          <MoveRight className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-pink-700">{selectedMigration.name}</h3>
                      </div>
                      <div className="space-y-2 text-foreground">
                        <p className="leading-relaxed">{selectedMigration.description}</p>
                        <div className="bg-pink-50 rounded-xl p-3 mt-3">
                          <p className="text-sm">{selectedMigration.details}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>أمثلة:</strong> {selectedMigration.regions.join("، ")}
                        </p>
                      </div>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="text-foreground leading-relaxed">
                        مرحباً!{" "}
                        <strong className="text-pink-600">الوحدة الثالثة: الصناعة بالبلاد التونسية</strong>
                        <br />
                        في هذا الدرس نستكشف الموارد والظروف البشرية المرتبطة بالنشاط الصناعي.
                        <br /><br />
                        <strong className="text-pink-600">اضغط على أحد العناصر في المفتاح</strong> لمزيد من التفاصيل على الخريطة التفاعلية!
                      </p>
                    </SpeechBubble>
                  )}
                </div>
              </div>
            </div>

            <ChapterChatbot unitNumber={3} theme="pink" />

            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-pink-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  <strong className="text-pink-600">الدرس 1</strong> يدعوك لقراءة خريطة الموارد الطاقية والمنجمية وفهم أين تتوفر الطاقة والمواد الأولية التي تغذي الصناعة.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-pink-700">الموارد:</strong> اربط بين الموقع والأنشطة الصناعية المحتملة.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-sky-700">الظروف البشرية:</strong> السكان، التكوين، النقل، والأسواق.
                    </p>
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
