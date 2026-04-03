"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, HelpCircle, BookOpen, Cloud, Droplets, Sun, Volume2, VolumeX, Music, MicOff, Wheat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveMapImage } from "@/components/interactive-map-image"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import { playSoundSimple, toggleBackgroundMusic } from "@/lib/sounds"

const AGRICULTURE_PRODUCTION_MAP_SRC =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151140-z7ROZKNoVWQsjp3l0z2kqG1ExhulTc.png"

const UNIT_2_LESSON_2 = "الدرس 2: توزع الإنتاج الفلاحي في المجال التونسي وتطورها"
const UNIT_2_MAP_PRODUCTION = "الخريطة: توزع الإنتاج الفلاحي في المجال التونسي"

const quizQuestions = [
  {
    question: "أين يتركز إنتاج الحبوب في تونس غالباً؟",
    options: ["الجنوب الصحراوي", "الشمال الغربي", "الجزر فقط", "الشرق فقط"],
    correctIndex: 1
  },
  {
    question: "ما العلاقة بين المناخ والإنتاج الفلاحي؟",
    options: ["لا علاقة", "الأمطار تحدد أنواع المحاصيل", "المناخ لا يؤثر", "الزراعة فقط في الصحراء"],
    correctIndex: 1
  },
  {
    question: "أي منطقة مناسبة لزراعة الزيتون والحبوب شبه الجافة؟",
    options: ["الجنوب فقط", "الوسط والساحل", "الشمال الغربي فقط", "لا يوجد"],
    correctIndex: 1
  }
]

export default function Unit2Map2Page() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isMusicOn, setIsMusicOn] = useState(false)

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    if (!isSoundEnabled) return
    playSoundSimple(type, 0.3)
  }

  const toggleMusic = () => {
    const newState = !isMusicOn
    setIsMusicOn(newState)
    toggleBackgroundMusic(newState)
    playSound("click")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-cyan-50 to-amber-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="border-b-4 border-purple-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-purple-600 hover:bg-purple-50 rounded-xl">
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <h1 className="text-base md:text-lg font-bold text-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-right">
              <div className="hidden sm:flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                <Cloud className="w-5 h-5 text-purple-600 shrink-0" />
                <span>الوحدة الثانية</span>
              </div>
              <span className="text-purple-600 leading-snug">الفلاحة والصيد البحري في البلاد التونسية</span>
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
          unit={2}
          mapIndex={2}
          totalMaps={2}
          lessonTitle={UNIT_2_LESSON_2}
          mapTitle={UNIT_2_MAP_PRODUCTION}
          theme="purple"
        />
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-purple-700">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                تذكير سريع
              </h3>
              <ul className="space-y-3 text-sm text-foreground leading-relaxed">
                <li className="flex gap-2">
                  <Cloud className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <span>الشمال: حبوب، غابات، أمطار أوفى.</span>
                </li>
                <li className="flex gap-2">
                  <Droplets className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>الوسط والساحل: زيتون، حبوب، خضر.</span>
                </li>
                <li className="flex gap-2">
                  <Sun className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <span>الجنوب: واحات، تمور، محاصيل تتحمل الجفاف.</span>
                </li>
              </ul>
            </div>
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن الإنتاج الفلاحي">
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
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Wheat className="w-5 h-5 text-amber-600" />
              <span>اقرأ توزع المحاصيل والأنشطة الفلاحية على الخريطة</span>
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-purple-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving />
                </div>
                <div className="flex-1">
                  <SpeechBubble direction="right">
                    <p className="text-foreground leading-relaxed">
                      هذه الخريطة تعرض <strong className="text-purple-600">توزع الإنتاج الفلاحي</strong> في المجال التونسي: أين تتركز الحبوب، الزيتون، الخضر، والمحاصيل الجنوبية.
                      <br /><br />
                      قارن بين الشمال والوسط والجنوب، واذكر أمثلة من محيطك الجغرافي!
                    </p>
                  </SpeechBubble>
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
                  <strong className="text-purple-600">الإنتاج الفلاحي</strong> يتأثر بالمناخ والتربة والمياه وبالبنية التحتية (طرق، تعاونيات، أسواق).
                </p>
                <p>
                  ربط دائماً بين نوع المحصول والظروف الطبيعية في كل جهة من البلاد.
                </p>
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
