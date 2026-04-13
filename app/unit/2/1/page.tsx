"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, Cloud, Sun, Droplets, Volume2, VolumeX, Sparkles, Music, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveTunisiaMap } from "@/components/maps/InteractiveTunisiaMap"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import { playSoundSimple } from "@/lib/sounds"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"
import { governorates } from "@/lib/tunisia-geojson"

const UNIT_2_LESSON_1 = "الدرس 1: ظروف النشاط الفلاحي الطبيعية والبشرية"
const UNIT_2_MAP_CLIMATE = "الخريطة: المناخات بالبلاد التونسية"

const legendItems = [
  { id: "humid", label: "مناخ رطب", description: "أكثر من 400 مم/سنة", color: "#7c3aed", icon: Cloud },
  { id: "semi-arid", label: "مناخ شبه جاف", description: "بين 200 و 400 مم/سنة", color: "#06b6d4", icon: Droplets },
  { id: "arid", label: "مناخ جاف", description: "أقل من 200 مم/سنة", color: "#f59e0b", icon: Sun },
]

const climateData: Record<string, {
  name: string
  regions: string[]
  rainfall: string
  temp: string
  description: string
  funFact: string
  icon: typeof Cloud
}> = {
  humid: {
    name: "المنطقة الرطبة",
    regions: ["بنزرت", "جندوبة", "باجة", "الكاف", "طبرقة"],
    rainfall: "400 - 1500 مم سنوياً",
    temp: "معتدل صيفاً وبارد شتاءً",
    description: "تقع في أقصى الشمال وتتميز بأمطار غزيرة وغابات كثيفة. هذه المنطقة هي سلة غذاء تونس!",
    funFact: "جبال خمير تستقبل أكثر من 1500 مم من الأمطار سنوياً، وهي الأعلى في تونس!",
    icon: Cloud
  },
  "semi-arid": {
    name: "المنطقة شبه الجافة",
    regions: ["تونس", "سوسة", "صفاقس", "القيروان", "المنستير", "المهدية"],
    rainfall: "200 - 400 مم سنوياً",
    temp: "حار وجاف صيفاً، معتدل شتاءً",
    description: "تمتد في الوسط والساحل الشرقي. مناخها مثالي لزراعة الزيتون والحبوب.",
    funFact: "الساحل التونسي (سوسة والمنستير) يتميز بمناخ متوسطي رائع يجذب السياح!",
    icon: Droplets
  },
  arid: {
    name: "المنطقة الجافة",
    regions: ["قابس", "مدنين", "تطاوين", "قبلي", "توزر", "قفصة"],
    rainfall: "أقل من 200 مم سنوياً",
    temp: "حار جداً صيفاً (قد تتجاوز 45°)",
    description: "تغطي الجنوب التونسي وتشمل الصحراء. رغم قلة الأمطار، تزرع فيها التمور الشهيرة!",
    funFact: "واحات توزر ونفطة تنتج أجود أنواع التمور في العالم، خاصة دقلة النور!",
    icon: Sun
  }
}

const quizQuestions = [
  {
    question: "ما هو نوع المناخ السائد في شمال تونس؟",
    options: ["مناخ جاف", "مناخ شبه جاف", "مناخ رطب", "مناخ استوائي"],
    correctIndex: 2
  },
  {
    question: "كم تبلغ كمية الأمطار في المنطقة الجافة؟",
    options: ["أكثر من 400 مم", "بين 200 و 400 مم", "أقل من 200 مم", "لا تمطر أبداً"],
    correctIndex: 2
  },
  {
    question: "أي ولاية تقع في المنطقة الرطبة؟",
    options: ["تطاوين", "صفاقس", "جندوبة", "قابس"],
    correctIndex: 2
  }
]

export default function Unit2Map1Page() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedGovId, setSelectedGovId] = useState<string | null>(null)
  const [hoveredGovId, setHoveredGovId] = useState<string | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const { isMusicOn, toggleMusic: toggleSiteMusic } = useBackgroundMusicToggle()

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    if (!isSoundEnabled) return
    playSoundSimple(type, 0.3)
  }

  const handleLegendClick = (id: string) => {
    playSound("pop")
    setSelectedGovId(null)
    setActiveCategory(activeCategory === id ? null : id)
  }

  const toggleMusic = () => {
    toggleSiteMusic()
    playSound("click")
  }

  const selectedGov = useMemo(
    () => (selectedGovId ? governorates.find((g) => g.id === selectedGovId) : undefined),
    [selectedGovId]
  )

  const selectedClimate = useMemo(() => {
    if (selectedGov) {
      const climateId = selectedGov.climate === "semi_arid" ? "semi-arid" : selectedGov.climate
      return climateData[climateId]
    }
    if (activeCategory) return climateData[activeCategory]
    return null
  }, [activeCategory, selectedGov])
  const SelectedIcon = selectedClimate?.icon || Sparkles

  const handleGovernorateSelect = (id: string) => {
    const gov = governorates.find((g) => g.id === id)
    if (!gov) return
    setSelectedGovId(id)
    const climateId = gov.climate === "semi_arid" ? "semi-arid" : gov.climate
    setActiveCategory(climateId)
    playSound("pop")
  }

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
              mapIndex={1}
              totalMaps={2}
              lessonTitle={UNIT_2_LESSON_1}
              mapTitle={UNIT_2_MAP_CLIMATE}
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
                          ? "border-purple-400 shadow-lg ring-2 ring-purple-200" 
                          : "border-gray-100 hover:border-purple-200"
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
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن المناخ">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-purple-200 overflow-hidden">
              <InteractiveTunisiaMap
                title={UNIT_2_MAP_CLIMATE}
                mapMode="climate"
                activeLegendCategory={activeCategory}
                selectedGovernorateId={selectedGovId}
                hoveredGovernorateId={hoveredGovId}
                onSelectGovernorate={handleGovernorateSelect}
                onHoverGovernorate={setHoveredGovId}
              />
            </div>

            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-600"></div>
                <span>رطب</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-500"></div>
                <span>شبه جاف</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span>جاف</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedClimate} />
                </div>
                <div className="flex-1">
                  {selectedClimate ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: legendItems.find(l => l.id === activeCategory)?.color }}
                        >
                          <SelectedIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-purple-700">{selectedClimate.name}</h3>
                      </div>
                      <div className="space-y-2 text-foreground">
                        <p className="leading-relaxed">{selectedClimate.description}</p>
                        <div className="bg-purple-50 rounded-xl p-3 mt-3">
                          <p className="text-sm">
                            <strong className="text-purple-600">كمية الأمطار:</strong> {selectedClimate.rainfall}
                          </p>
                          <p className="text-sm mt-1">
                            <strong className="text-purple-600">الحرارة:</strong> {selectedClimate.temp}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>الولايات:</strong> {selectedClimate.regions.join("، ")}
                        </p>
                      </div>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="text-foreground leading-relaxed">
                        مرحباً!{" "}
                        <strong className="text-purple-600">
                          الوحدة الثانية: الفلاحة والصيد البحري في البلاد التونسية
                        </strong>
                        <br />
                        في هذا الدرس نقرأ خريطة المناخات: رطب، شبه جاف، وجاف.
                        <br /><br />
                        <strong className="text-purple-600">اضغط على أحد الألوان في المفتاح</strong> لتكتشف معلومات عن كل منطقة مناخية في تونس!
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
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  تتميز تونس بثلاثة أنواع من المناخ تتوزع من <strong className="text-purple-600">الشمال إلى الجنوب</strong>:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                    <Cloud className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-purple-700">المناخ الرطب:</strong> شمال البلاد، أمطار غزيرة تتجاوز 400 مم.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl">
                    <Droplets className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-cyan-700">المناخ شبه الجاف:</strong> الوسط والساحل، أمطار معتدلة.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                    <Sun className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-amber-700">المناخ الجاف:</strong> الجنوب، أمطار نادرة وحرارة مرتفعة.</p>
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
