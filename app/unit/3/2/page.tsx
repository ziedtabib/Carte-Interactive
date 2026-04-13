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
import { playSoundSimple } from "@/lib/sounds"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"

const INDUSTRY_PLACEHOLDER_MAP_SRC =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%27%C3%A9cran%202026-03-03%20151140-z7ROZKNoVWQsjp3l0z2kqG1ExhulTc.png"

const UNIT_3_LESSON_2 =
  "الدرس 2: التوزع الجغرافي للصناعة التونسية وتطور أهم منتجاتها"
const UNIT_3_MAP_INDUSTRY = "الخريطة: توزع الصناعات بالبلاد التونسية"

const quizQuestions = [
  {
    question: "ماذا تبيّن خريطة توزع الصناعات؟",
    options: ["المناخ فقط", "تمركز المصانع والقطاعات الصناعية", "عدد السياح فقط", "الحدود الإدارية"],
    correctIndex: 1
  },
  {
    question: "أي عامل مهم لتوطين الصناعة؟",
    options: ["الموارد والطاقة والنقل", "اللون فقط", "عدد الأشجار", "الارتفاع عن سطح البحر فقط"],
    correctIndex: 0
  },
  {
    question: "لماذا تتمركز كثير من الوحدات الصناعية قرب الموانئ والطرق السريعة؟",
    options: ["للزينة", "لتسهيل التوريد والتصدير", "لقلة السكان", "للبرودة فقط"],
    correctIndex: 1
  }
]

export default function Unit3Map2Page() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const { isMusicOn, toggleMusic: toggleSiteMusic } = useBackgroundMusicToggle()

  const playSound = (type: "click" | "pop" | "success" | "magic") => {
    if (!isSoundEnabled) return
    playSoundSimple(type, 0.3)
  }

  const toggleMusic = () => {
    toggleSiteMusic()
    playSound("click")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-sky-50 to-slate-50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="border-b-4 border-pink-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-foreground hover:text-pink-600 hover:bg-pink-50 rounded-xl">
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            
            <h1 className="text-base md:text-lg font-bold text-foreground flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-right">
              <div className="hidden sm:flex items-center gap-2 bg-pink-100 px-3 py-1 rounded-full">
                <MoveRight className="w-5 h-5 text-pink-600 shrink-0" />
                <span>الوحدة الثالثة</span>
              </div>
              <span className="text-pink-600 leading-snug">الصناعة بالبلاد التونسية</span>
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
          unit={3}
          mapIndex={2}
          totalMaps={2}
          lessonTitle={UNIT_3_LESSON_2}
          mapTitle={UNIT_3_MAP_INDUSTRY}
          theme="pink"
        />
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 order-2 lg:order-1 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-pink-700">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-pink-600" />
                </div>
                كيف تقرأ الخريطة؟
              </h3>
              <ul className="space-y-2 text-sm text-foreground leading-relaxed">
                <li>• لاحظ تمركز المناطق الصناعية الكبرى.</li>
                <li>• اربط بين القرب من الميناء أو الطريق السيار والأنشطة.</li>
                <li>• قارن بين جهات البلاد من حيث نوعية الصناعات.</li>
              </ul>
            </div>
            
            <QuizDialog questions={quizQuestions} title="اختبر معلوماتك عن توزع الصناعة">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-l from-pink-600 to-sky-500 hover:from-pink-700 hover:to-sky-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <HelpCircle className="w-6 h-6 ml-2" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-pink-200 overflow-hidden">
              <InteractiveMapImage
                src={INDUSTRY_PLACEHOLDER_MAP_SRC}
                alt="توزع الصناعات بالبلاد التونسية"
                title={UNIT_3_MAP_INDUSTRY}
              />
            </div>
          </div>

          <aside className="lg:col-span-4 order-3 space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-pink-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving />
                </div>
                <div className="flex-1">
                  <SpeechBubble direction="right">
                    <p className="text-foreground leading-relaxed">
                      هذه الخريطة تساعدك على فهم <strong className="text-pink-600">التوزع الجغرافي للصناعة</strong> في تونس: أين تتركز المصانع، وما العلاقة بالموارد والنقل والأسواق.
                      <br /><br />
                      استخدم ما تعلّمته في الدرس الأول عن الموارد والظروف البشرية لشرح ما تراه!
                    </p>
                  </SpeechBubble>
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
                  <strong className="text-pink-600">الدرس 2</strong> يوضح كيف تتوزع الصناعات وتتطور أهم المنتجات في المجال التونسي.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-pink-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-pink-700">التمركز:</strong> غالباً قرب الموانئ، العاصمة، والمناطق ذات البنية التحتية.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-sky-700">التحديات:</strong> التنافس، الطاقة، التكوين، والولوج للأسواق.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <Home className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-slate-700">تذكّر:</strong> اربط المورد، الموقع، والسوق أو التصدير.
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
