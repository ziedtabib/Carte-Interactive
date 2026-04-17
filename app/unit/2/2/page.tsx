"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  HelpCircle,
  BookOpen,
  Cloud,
  Volume2,
  VolumeX,
  Music,
  MicOff,
  Wheat,
  TreePine,
  Grape,
  Fish,
  Palmtree,
  Leaf,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveMapImage } from "@/components/interactive-map-image"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import {
  playSoundSimple,
  getBackgroundMusicLoop,
  getBackgroundMusicSrc,
  isMusicPlaying,
  setBackgroundMusicLoop,
  setBackgroundMusicSrc,
  toggleBackgroundMusic,
  UNIT_2_LESSON_2_BACKGROUND_MUSIC_SRC,
} from "@/lib/sounds"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"

const AGRICULTURE_PRODUCTION_MAP_SRC =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151140-z7ROZKNoVWQsjp3l0z2kqG1ExhulTc.png"

const UNIT_2_LESSON_2 = "الدرس 2: توزع الإنتاج الفلاحي في المجال التونسي وتطوره"
const UNIT_2_MAP_PRODUCTION = "الخريطة: توزع الإنتاج الفلاحي في المجال التونسي"

const legendItems = [
  { id: "olives", label: "زيتون", description: "الوسط والساحل", color: "#84cc16", icon: TreePine },
  { id: "cereals", label: "حبوب", description: "الشمال الغربي", color: "#ec4899", icon: Wheat },
  { id: "dates", label: "نخيل وتمور", description: "واحات الجنوب", color: "#f97316", icon: Palmtree },
  { id: "grapes", label: "كروم", description: "زراعة العنب", color: "#8b5cf6", icon: Grape },
  { id: "vegetables", label: "خضر وفواكه", description: "الزراعات السقوية", color: "#10b981", icon: Leaf },
  { id: "fishing", label: "صيد بحري", description: "موانئ الصيد", color: "#0ea5e9", icon: Fish },
]

const productionData: Record<
  string,
  {
    name: string
    regions: string[]
    description: string
    details: string
    funFact: string
  }
> = {
  olives: {
    name: "زراعة الزيتون",
    regions: ["صفاقس", "سوسة", "المنستير", "المهدية", "القيروان"],
    description:
      "يتوزع إنتاج الزيتون بكثافة في الوسط والساحل حيث المناخ شبه الجاف يناسب أشجار الزيتون.",
    details: "تونس من أكبر منتجي زيت الزيتون عالمياً.",
    funFact: "تونس تحتوي على أكثر من 80 مليون شجرة زيتون!",
  },
  cereals: {
    name: "زراعة الحبوب",
    regions: ["الكاف", "سليانة", "باجة", "جندوبة", "بنزرت"],
    description: "يتركز إنتاج الحبوب في الشمال الغربي بفضل الأمطار الأوفى والتربة المناسبة.",
    details: "القمح الصلب والشعير يغذيان الصناعة الغذائية المحلية.",
    funFact: "الخبز التونسي يُصنع غالباً من القمح المزروع في الشمال.",
  },
  dates: {
    name: "واحات النخيل والتمور",
    regions: ["توزر", "قبلي", "قابس", "مدنين"],
    description: "في الجنوب، الواحات تنتج تموراً عالية الجودة رغم قلة الأمطار.",
    details: "المياه الجوفية تروي النخيل في الواحات.",
    funFact: "تمر دقلة النور من أشهر أنواع التمور التونسية!",
  },
  grapes: {
    name: "زراعة الكروم",
    regions: ["نابل", "بن عروس", "بنزرت", "زغوان"],
    description: "تنتشر الكروم في الشمال الشرقي والساحل حيث المناخ معتدل.",
    details: "العنب يُستهلك طازجاً أو في العصائر.",
    funFact: "عنب تونس معروف بحلاوته منذ العصور القديمة.",
  },
  vegetables: {
    name: "الخضر والفواكه",
    regions: ["نابل", "بنزرت", "المنستير", "صفاقس"],
    description: "الزراعات السقوية تزود المدن بالخضر والفواكه طوال السنة.",
    details: "تُستخدم السدود والمياه الجوفية للري.",
    funFact: "المناطق الساحلية تنتج خضراً متنوعة بفضل التربة الخصبة.",
  },
  fishing: {
    name: "الصيد البحري",
    regions: ["صفاقس", "قابس", "المهدية", "بنزرت", "طبرقة"],
    description: "السواحل التونسية غنية بالأسماك وتغذي الأسواق المحلية.",
    details: "الصيد يكمّل النشاط الفلاحي في المناطق الساحلية.",
    funFact: "جزر قرقنة مشهورة بصيد الأخطبوط!",
  },
}

const quizQuestions = [
  {
    question: "أين يتركز إنتاج الحبوب في تونس غالباً؟",
    options: ["الجنوب الصحراوي", "الشمال الغربي", "الجزر فقط", "الشرق فقط"],
    correctIndex: 1,
  },
  {
    question: "ما العلاقة بين المناخ والإنتاج الفلاحي؟",
    options: ["لا علاقة", "الأمطار تحدد أنواع المحاصيل", "المناخ لا يؤثر", "الزراعة فقط في الصحراء"],
    correctIndex: 1,
  },
  {
    question: "أي منطقة مناسبة لزراعة الزيتون والحبوب شبه الجافة؟",
    options: ["الجنوب فقط", "الوسط والساحل", "الشمال الغربي فقط", "لا يوجد"],
    correctIndex: 1,
  },
]

export default function Unit2Map2Page() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const { isMusicOn, toggleMusic: toggleSiteMusic } = useBackgroundMusicToggle()

  useEffect(() => {
    const prevSrc = getBackgroundMusicSrc()
    const prevLoop = getBackgroundMusicLoop()
    const prevWasPlaying = isMusicPlaying()
    setBackgroundMusicSrc(UNIT_2_LESSON_2_BACKGROUND_MUSIC_SRC)
    setBackgroundMusicLoop(false)
    toggleBackgroundMusic(true)
    return () => {
      setBackgroundMusicSrc(prevSrc)
      setBackgroundMusicLoop(prevLoop)
      toggleBackgroundMusic(prevWasPlaying)
    }
  }, [])

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

  const selectedProduction = activeCategory ? productionData[activeCategory] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-cyan-50 to-amber-50">
      <header className="sticky top-0 z-50 shadow-md">
        <div className="border-b-4 border-purple-200 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 pb-2">
            <div className="flex h-16 items-center justify-between">
              <Link href="/">
                <Button variant="ghost" className="text-foreground hover:bg-purple-50 hover:text-purple-600 rounded-xl">
                  <ArrowRight className="ml-2 h-5 w-5" />
                  العودة للرئيسية
                </Button>
              </Link>

              <h1 className="flex flex-1 flex-col items-center gap-1 text-center text-base font-bold text-foreground sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-right md:text-lg">
                <div className="hidden items-center gap-2 rounded-full bg-purple-100 px-3 py-1 sm:flex">
                  <Cloud className="h-5 w-5 shrink-0 text-purple-600" />
                  <span>الوحدة الثانية</span>
                </div>
                <span className="leading-snug text-purple-600">الفلاحة والصيد البحري في البلاد التونسية</span>
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
              unit={2}
              mapIndex={2}
              totalMaps={2}
              lessonTitle={UNIT_2_LESSON_2}
              mapTitle={UNIT_2_MAP_PRODUCTION}
              theme="purple"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-700">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                مفتاح الخريطة
              </h3>

              <div className="space-y-2 max-h-[min(60vh,28rem)] overflow-y-auto pr-1">
                {legendItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleLegendClick(item.id)}
                      className={cn(
                        "w-full p-3 rounded-2xl border-2 transition-all duration-300 text-right",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        activeCategory === item.id
                          ? "border-purple-400 shadow-lg ring-2 ring-purple-200"
                          : "border-gray-100 hover:border-purple-200"
                      )}
                      style={{
                        backgroundColor: activeCategory === item.id ? `${item.color}15` : "white",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: item.color }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm">{item.label}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن الإنتاج الفلاحي" unitNumber={2} mapIndex={2}>
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-purple-200 overflow-hidden">
              <InteractiveMapImage
                src={AGRICULTURE_PRODUCTION_MAP_SRC}
                alt="توزع الإنتاج الفلاحي في المجال التونسي"
                title={UNIT_2_MAP_PRODUCTION}
                highlightColor={activeCategory ? legendItems.find((l) => l.id === activeCategory)?.color : undefined}
              />
            </div>
            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-lime-500" />
                <span>زيتون</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-pink-500" />
                <span>حبوب</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500" />
                <span>نخيل</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span>كروم</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>خضر</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-sky-500" />
                <span>صيد</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedProduction} />
                </div>
                <div className="flex-1 min-w-0">
                  {selectedProduction ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: legendItems.find((l) => l.id === activeCategory)?.color }}
                        >
                          {(() => {
                            const Icon = legendItems.find((l) => l.id === activeCategory)?.icon || Leaf
                            return <Icon className="w-5 h-5 text-white" />
                          })()}
                        </div>
                        <h3 className="font-bold text-xl text-purple-700">{selectedProduction.name}</h3>
                      </div>
                      <div className="space-y-2 text-foreground">
                        <p className="leading-relaxed">{selectedProduction.description}</p>
                        <div className="bg-purple-50 rounded-xl p-3 mt-3">
                          <p className="text-sm">{selectedProduction.details}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>المناطق:</strong> {selectedProduction.regions.join("، ")}
                        </p>
                        <p className="text-xs text-muted-foreground italic border-t border-purple-100 pt-2 mt-2">
                          {selectedProduction.funFact}
                        </p>
                      </div>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="text-foreground leading-relaxed">
                        هذه الخريطة تعرض <strong className="text-purple-600">توزع الإنتاج الفلاحي</strong> في المجال
                        التونسي.
                        <br />
                        <br />
                        <strong className="text-purple-600">اضغط على أحد الرموز في مفتاح الخريطة</strong> لإبراز نوع الإنتاج
                        وقراءة شرح مبسّط!
                      </p>
                    </SpeechBubble>
                  )}
                </div>
              </div>
            </div>

            <ChapterChatbot unitNumber={2} theme="purple" />

            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 text-foreground leading-relaxed text-sm">
                <p>
                  <strong className="text-purple-600">الإنتاج الفلاحي</strong> يتأثر بالمناخ والتربة والمياه وبالبنية
                  التحتية (طرق، تعاونيات، أسواق).
                </p>
                <p>اربط دائماً بين نوع المحصول والظروف الطبيعية في كل جهة من البلاد.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
