"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, Wheat, TreePine, Grape, Fish, Volume2, VolumeX, Palmtree, Leaf, Music, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveMapImage } from "@/components/interactive-map-image"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { cn } from "@/lib/utils"
import { playSoundSimple } from "@/lib/sounds"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"

const UNIT_4_LESSON_1 =
  "الدرس 1: ظروف النشاط السياحي والمناطق السياحية بالبلاد التونسية"
const UNIT_4_MAP_COASTAL = "الخريطة: المناطق الساحلية بالبلاد التونسية"

const legendItems = [
  { id: "olives", label: "زيتون", description: "أشجار الزيتون في الوسط والساحل", color: "#84cc16", icon: TreePine },
  { id: "cereals", label: "حبوب", description: "زراعة القمح والشعير", color: "#ec4899", icon: Wheat },
  { id: "dates", label: "نخيل وتمور", description: "واحات الجنوب", color: "#f97316", icon: Palmtree },
  { id: "grapes", label: "كروم", description: "زراعة العنب", color: "#8b5cf6", icon: Grape },
  { id: "vegetables", label: "خضر وفواكه", description: "الزراعات السقوية", color: "#10b981", icon: Leaf },
  { id: "fishing", label: "صيد بحري", description: "موانئ الصيد", color: "#0ea5e9", icon: Fish },
]

const resourcesData: Record<string, {
  name: string
  regions: string[]
  description: string
  details: string
  funFact: string
}> = {
  olives: {
    name: "زراعة الزيتون",
    regions: ["صفاقس", "سوسة", "المنستير", "المهدية", "القيروان"],
    description: "تونس من أكبر منتجي زيت الزيتون في العالم! تنتشر أشجار الزيتون في الوسط والساحل.",
    details: "زيت الزيتون التونسي يُصدَّر إلى أوروبا وأمريكا",
    funFact: "تونس تحتوي على أكثر من 80 مليون شجرة زيتون!"
  },
  cereals: {
    name: "زراعة الحبوب",
    regions: ["الكاف", "سليانة", "باجة", "جندوبة", "بنزرت"],
    description: "الشمال الغربي هو مخزن الحبوب في تونس. يُزرع فيه القمح الصلب والشعير.",
    details: "الأمطار الوفيرة في الشمال تساعد على زراعة الحبوب",
    funFact: "الخبز التونسي يُصنع من القمح الصلب المزروع محلياً!"
  },
  dates: {
    name: "واحات النخيل",
    regions: ["توزر", "قبلي", "قابس", "مدنين"],
    description: "واحات الجنوب تنتج أجود أنواع التمور في العالم، خاصة دقلة النور الشهيرة.",
    details: "الواحات توفر مياه الري من الآبار الجوفية",
    funFact: "تمر دقلة النور يُسمى إصبع الضوء لشكله المميز!"
  },
  grapes: {
    name: "زراعة الكروم",
    regions: ["نابل", "بن عروس", "بنزرت", "زغوان"],
    description: "تنتشر زراعة العنب في الشمال الشرقي والساحل. يُستخدم في إنتاج العصائر والفواكه.",
    details: "المناخ المعتدل يناسب زراعة الكروم",
    funFact: "عنب تونس معروف بحلاوته منذ العصر الروماني!"
  },
  vegetables: {
    name: "الخضر والفواكه",
    regions: ["نابل", "بنزرت", "المنستير", "صفاقس"],
    description: "الزراعات السقوية تنتشر حول المدن الكبرى. تشمل الطماطم والفلفل والبرتقال.",
    details: "تُستخدم المياه الجوفية والسدود للري",
    funFact: "هريسة تونس مصنوعة من الفلفل الأحمر المحلي!"
  },
  fishing: {
    name: "الصيد البحري",
    regions: ["صفاقس", "قابس", "المهدية", "بنزرت", "طبرقة"],
    description: "السواحل التونسية غنية بالأسماك. موانئ الصيد توفر الأسماك الطازجة للسوق المحلي.",
    details: "البحر المتوسط مصدر مهم للثروة السمكية",
    funFact: "جزر قرقنة في صفاقس مشهورة بصيد الأخطبوط!"
  }
}

const quizQuestions = [
  {
    question: "أين تنتشر زراعة الزيتون بكثرة في تونس؟",
    options: ["الشمال الغربي", "الوسط والساحل", "الجنوب الصحراوي", "الجبال فقط"],
    correctIndex: 1
  },
  {
    question: "ما هو المحصول الرئيسي في واحات الجنوب؟",
    options: ["القمح", "الزيتون", "التمر", "العنب"],
    correctIndex: 2
  },
  {
    question: "لماذا يُزرع القمح في الشمال الغربي؟",
    options: ["المناخ الحار", "وفرة الأمطار", "قرب البحر", "التربة الرملية"],
    correctIndex: 1
  }
]

export default function Unit4Map1Page() {
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

  const selectedResource = activeCategory ? resourcesData[activeCategory] : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-lime-50 to-orange-50">
      <header className="sticky top-0 z-50 shadow-md">
        <div className="border-b-4 border-green-200 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 pb-2">
            <div className="flex h-16 items-center justify-between">
              <Link href="/">
                <Button variant="ghost" className="text-foreground hover:bg-green-50 hover:text-green-600 rounded-xl">
                  <ArrowRight className="ml-2 h-5 w-5" />
                  العودة للرئيسية
                </Button>
              </Link>

              <h1 className="flex flex-1 flex-col items-center gap-1 text-center text-base font-bold text-foreground sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:text-right md:text-lg">
                <div className="hidden items-center gap-2 rounded-full bg-green-100 px-3 py-1 sm:flex">
                  <Leaf className="h-5 w-5 shrink-0 text-green-600" />
                  <span>الوحدة الرابعة</span>
                </div>
                <span className="leading-snug text-green-600">السياحة بالبلاد التونسية</span>
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
              unit={4}
              mapIndex={1}
              totalMaps={1}
              lessonTitle={UNIT_4_LESSON_1}
              mapTitle={UNIT_4_MAP_COASTAL}
              theme="green"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                مفتاح الخريطة
              </h3>
              
              <div className="space-y-2">
                {legendItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLegendClick(item.id)}
                      className={cn(
                        "w-full p-3 rounded-2xl border-2 transition-all duration-300 text-right",
                        "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
                        activeCategory === item.id 
                          ? "border-green-400 shadow-lg ring-2 ring-green-200" 
                          : "border-gray-100 hover:border-green-200"
                      )}
                      style={{
                        backgroundColor: activeCategory === item.id ? `${item.color}15` : "white"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                          style={{ backgroundColor: item.color }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{item.label}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن السياحة">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-green-200 overflow-hidden">
              <InteractiveMapImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151140-z7ROZKNoVWQsjp3l0z2kqG1ExhulTc.png"
                alt="خريطة المناطق الساحلية بالبلاد التونسية"
                title={UNIT_4_MAP_COASTAL}
                highlightColor={activeCategory ? legendItems.find(l => l.id === activeCategory)?.color : undefined}
              />
            </div>
            
            <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center gap-4 text-xs flex-wrap">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-lime-500"></div>
                <span>زيتون</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-pink-500"></div>
                <span>حبوب</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500"></div>
                <span>نخيل</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-purple-500"></div>
                <span>كروم</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span>خضر</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-sky-500"></div>
                <span>صيد</span>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedResource} />
                </div>
                <div className="flex-1">
                  {selectedResource ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: legendItems.find(l => l.id === activeCategory)?.color }}
                        >
                          {(() => {
                            const Icon = legendItems.find(l => l.id === activeCategory)?.icon || Leaf
                            return <Icon className="w-5 h-5 text-white" />
                          })()}
                        </div>
                        <h3 className="font-bold text-xl text-green-700">{selectedResource.name}</h3>
                      </div>
                      <div className="space-y-2 text-foreground">
                        <p className="leading-relaxed">{selectedResource.description}</p>
                        <div className="bg-green-50 rounded-xl p-3 mt-3">
                          <p className="text-sm">{selectedResource.details}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>المناطق:</strong> {selectedResource.regions.join("، ")}
                        </p>
                      </div>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="text-foreground leading-relaxed">
                        مرحباً! <strong className="text-green-600">الوحدة الرابعة: السياحة بالبلاد التونسية</strong>
                        <br />
                        في هذا الدرس نستكشف ظروف النشاط السياحي والمناطق الساحلية.
                        <br /><br />
                        <strong className="text-green-600">اضغط على أحد الرموز في المفتاح</strong> لاستكشاف الخريطة!
                      </p>
                    </SpeechBubble>
                  )}
                </div>
              </div>
            </div>

            <ChapterChatbot unitNumber={4} theme="green" />

            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-green-200">
              <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 text-foreground leading-relaxed">
                <p>
                  <strong className="text-green-600">السياحة</strong> ترتبط بالمناخ، بالسواحل، بالمواقع التاريخية وبخدمات
                  الاستقبال.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl">
                    <Fish className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-sky-700">السواحل:</strong> جذب سياحي كبير (شواطئ، مطاعم، أنشطة بحرية).</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-lime-50 rounded-xl">
                    <Palmtree className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-lime-700">المواقع:</strong> نوع المناطق السياحية يختلف بين الشمال والجنوب.</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl">
                    <Wheat className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p><strong className="text-orange-700">الخريطة:</strong> تقرأ توزع المناطق الساحلية في المجال التونسي.</p>
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
