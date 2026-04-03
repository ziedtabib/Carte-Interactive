"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, Users, Building2, MapPin, Volume2, VolumeX, Sparkles, Music, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveMapImage } from "@/components/interactive-map-image"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import { playSoundSimple, toggleBackgroundMusic } from "@/lib/sounds"

const UNIT_1_LESSON =
  "الدرس 1: التوزع الجغرافي للسكان والأدفاق الهجرية في البلاد التونسية"
const MAP_1_TITLE = "الخريطة 1: الكثافات السكانية والمدن بالبلاد التونسية"

const legendItems = [
  { id: "very-high", label: "كثافة مرتفعة جداً", description: "أكثر من 500 ن/كم²", color: "#dc2626", icon: Building2 },
  { id: "high", label: "كثافة مرتفعة", description: "بين 100 و 500 ن/كم²", color: "#16a34a", icon: Users },
  { id: "medium", label: "كثافة ضعيفة", description: "بين 40 و 100 ن/كم²", color: "#eab308", icon: MapPin },
  { id: "low", label: "كثافة ضعيفة جداً", description: "أقل من 40 ن/كم²", color: "#f97316", icon: Sparkles },
]

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
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isMusicOn, setIsMusicOn] = useState(false)

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    if (!isSoundEnabled) return
    playSoundSimple(type, 0.3)
  }

  const handleLegendClick = (id: string) => {
    playSound("pop")
    setActiveCategory(activeCategory === id ? null : id)
  }

  const toggleMusic = () => {
    const newState = !isMusicOn
    setIsMusicOn(newState)
    toggleBackgroundMusic(newState)
    playSound("click")
  }

  const selectedDensity = activeCategory ? densityData[activeCategory] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-green-50 to-amber-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="border-b-4 border-red-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-red-600 hover:bg-red-50 rounded-xl">
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <h1 className="text-base md:text-lg font-bold text-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-right">
              <div className="hidden sm:flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                <Users className="w-5 h-5 text-red-600 shrink-0" />
                <span>الوحدة الأولى</span>
              </div>
              <span className="text-red-600 leading-snug">البلاد التونسية: السكان</span>
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
                {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMusic}
                className="rounded-full"
                title={isMusicOn ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
              >
                {isMusicOn ? <Music className="w-5 h-5 text-primary" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <div className="w-12 h-12">
                <ExplorerCharacter size="sm" />
              </div>
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
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن الكثافة السكانية">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-red-200 overflow-hidden">
              <InteractiveMapImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151134-1EyzN1GY1GyrS8bp6OzdPFwFm3Tqrt.png"
                alt="خريطة الكثافات السكانية والمدن بالبلاد التونسية"
                title={MAP_1_TITLE}
                highlightColor={activeCategory ? legendItems.find(l => l.id === activeCategory)?.color : undefined}
              />
            </div>
            
            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-4 text-sm flex-wrap">
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
                  <ExplorerCharacter size="sm" waving={!selectedDensity} />
                </div>
                <div className="flex-1">
                  {selectedDensity ? (
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
                        في هذا الدرس سنتعرف على توزيع السكان في تونس.
                        <br /><br />
                        <strong className="text-red-600">اضغط على أحد الألوان في المفتاح</strong> لتكتشف معلومات عن كل منطقة!
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
