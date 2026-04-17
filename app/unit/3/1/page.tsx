"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  HelpCircle,
  BookOpen,
  MoveRight,
  Volume2,
  VolumeX,
  Music,
  MicOff,
  Factory,
  Users,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"
import { QuizDialog } from "@/components/quiz-dialog"
import { InteractiveTunisiaResourcesSvgMap } from "@/components/InteractiveTunisiaResourcesSvgMap"
import { ChapterChatbot } from "@/components/chapter-chatbot"
import { UnitMapNav } from "@/components/unit-map-nav"
import {
  playSoundSimple,
  getBackgroundMusicLoop,
  getBackgroundMusicSrc,
  isMusicPlaying,
  setBackgroundMusicLoop,
  setBackgroundMusicSrc,
  toggleBackgroundMusic,
  UNIT_3_LESSON_1_BACKGROUND_MUSIC_SRC,
} from "@/lib/sounds"
import { RESOURCE_TYPE_LABELS, type TunisiaResourcePoint } from "@/lib/tunisia-resources"
import { useBackgroundMusicToggle } from "@/hooks/useBackgroundMusicToggle"

const UNIT_3_LESSON_1 = "الدرس 1: ظروف النشاط الصناعي: الموارد والظروف البشرية"
const UNIT_3_MAP_RESOURCES = "الخريطة: الموارد الطاقية والمنجمية في البلاد التونسية"

const quizQuestions = [
  {
    question: "ما أهم مورد معدني تونسي معروف عالمياً؟",
    options: ["الرصاص فقط", "الفوسفاط", "الحديد فقط", "الملح فقط"],
    correctIndex: 1,
  },
  {
    question: "ما وظيفة أنابيب النفط والغاز على الخريطة؟",
    options: ["زينة فقط", "نقل الموائع من الحقول نحو الموانئ أو الشبكات", "لا وظيفة", "للري فقط"],
    correctIndex: 1,
  },
  {
    question: "أين يتركز غالباً إنتاج الفوسفاط في تونس؟",
    options: ["الشمال فقط", "جهة قفصة والجنوب الغربي", "الجزر", "الشرق فقط"],
    correctIndex: 1,
  },
]

export default function Unit3Map1Page() {
  const [selectedMapPoint, setSelectedMapPoint] = useState<TunisiaResourcePoint | null>(null)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const { isMusicOn, toggleMusic: toggleSiteMusic } = useBackgroundMusicToggle()

  useEffect(() => {
    const prevSrc = getBackgroundMusicSrc()
    const prevLoop = getBackgroundMusicLoop()
    const prevWasPlaying = isMusicPlaying()
    setBackgroundMusicSrc(UNIT_3_LESSON_1_BACKGROUND_MUSIC_SRC)
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

  const toggleMusic = () => {
    toggleSiteMusic()
    playSound("click")
  }

  const handlePointSelect = (point: TunisiaResourcePoint | null) => {
    setSelectedMapPoint(point)
    if (point && isSoundEnabled) playSound("pop")
  }

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside className="order-2 space-y-4 lg:order-1 lg:col-span-3">
            <div className="rounded-3xl border-2 border-pink-200 bg-white p-5 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-pink-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100">
                  <BookOpen className="h-5 w-5 text-pink-600" />
                </div>
                كيف تستخدم الخريطة؟
              </h3>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground">
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-pink-600" />
                  <span>
                    اختر نوع المورد من <strong className="text-pink-700">المفتاح التفاعلي</strong> فوق الخريطة
                    (الكل، نفط، غاز، فسفاط…).
                  </span>
                </li>
                <li className="flex gap-2">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                  <span>
                    مرّر الفأرة على <strong className="text-sky-700">الرموز</strong> لمعرفة الاسم والنوع، واضغط
                    لقراءة التفاصيل في نافذة منبثقة.
                  </span>
                </li>
              </ul>
            </div>

            <QuizDialog
              questions={quizQuestions}
              title="اختبر معلوماتك عن الموارد الطاقية والمنجمية"
              unitNumber={3}
              mapIndex={1}
            >
              <Button className="w-full rounded-2xl bg-gradient-to-l from-pink-600 to-sky-500 py-6 text-lg shadow-xl transition-all duration-300 hover:scale-[1.02] hover:from-pink-700 hover:to-sky-600 hover:shadow-2xl">
                <HelpCircle className="ml-2 h-6 w-6" />
                اختبر معلوماتك
              </Button>
            </QuizDialog>
          </aside>

          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border-2 border-pink-200 bg-white p-3 shadow-xl sm:p-4">
              <InteractiveTunisiaResourcesSvgMap title={UNIT_3_MAP_RESOURCES} onPointSelect={handlePointSelect} />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground sm:text-sm">
              خريطة متجهية من <code className="rounded bg-pink-50 px-1">/geo/gadm41_TUN_1.json</code> — رموز الموارد
              بإحداثيات جغرافية
              (نسب مئوية).
            </p>
          </div>

          <aside className="order-3 space-y-4 lg:col-span-4">
            <div className="rounded-3xl border-2 border-pink-200 bg-white p-5 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExplorerCharacter size="sm" waving={!selectedMapPoint} />
                </div>
                <div className="min-w-0 flex-1">
                  {selectedMapPoint ? (
                    <SpeechBubble direction="right" className="animate-fade-in">
                      <h3 className="mb-2 text-xl font-bold text-pink-700">{selectedMapPoint.name}</h3>
                      <p className="mb-2 text-sm font-medium text-muted-foreground">
                        {RESOURCE_TYPE_LABELS[selectedMapPoint.type]}
                      </p>
                      <p className="leading-relaxed text-foreground">{selectedMapPoint.description}</p>
                    </SpeechBubble>
                  ) : (
                    <SpeechBubble direction="right">
                      <p className="leading-relaxed text-foreground">
                        مرحباً!{" "}
                        <strong className="text-pink-600">الوحدة الثالثة: الصناعة بالبلاد التونسية</strong>
                        <br />
                        الدرس يتناول <strong className="text-pink-600">الموارد الطاقية والمنجمية</strong>.
                        <br />
                        <br />
                        <strong className="text-pink-600">اضغط على أحد الرموز على الخريطة</strong> لعرض شرح هنا، أو
                        استخدم المفتاح أعلى الخريطة لتصفية الأنواع.
                      </p>
                    </SpeechBubble>
                  )}
                </div>
              </div>
            </div>

            <ChapterChatbot unitNumber={3} theme="pink" />

            <div className="rounded-3xl border-2 border-pink-200 bg-white p-5 shadow-xl">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100">
                  <BookOpen className="h-5 w-5 text-pink-600" />
                </div>
                شرح الدرس
              </h3>
              <div className="space-y-4 leading-relaxed text-foreground">
                <p>
                  <strong className="text-pink-600">الدرس 1</strong> يدعوك لقراءة خريطة الموارد الطاقية والمنجمية
                  وفهم أين تتوفر الطاقة والمواد الأولية التي تغذي الصناعة.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-pink-50 p-3">
                    <Factory className="mt-0.5 h-6 w-6 flex-shrink-0 text-pink-600" />
                    <p>
                      <strong className="text-pink-700">الموارد:</strong> تموضع الرموز على الخريطة يعكس التوزع
                      الجغرافي للحقول والمناجم والمرافق.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-sky-50 p-3">
                    <Users className="mt-0.5 h-6 w-6 flex-shrink-0 text-sky-600" />
                    <p>
                      <strong className="text-sky-700">الظروف البشرية:</strong> السكان، التكوين، النقل، والأسواق التي
                      تستغل هذه الموارد.
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
