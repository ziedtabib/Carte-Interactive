"use client"

import { useRef, useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UnitTheme = "red" | "purple" | "pink" | "green"

const themeClass: Record<
  UnitTheme,
  { card: string; headerBg: string; headerText: string; bubbleUser: string; bubbleBot: string }
> = {
  red: {
    card: "bg-gradient-to-br from-yellow-100 via-green-100 to-red-100 border-red-200",
    headerBg: "bg-yellow-500",
    headerText: "text-yellow-900",
    bubbleUser: "bg-red-600 text-white",
    bubbleBot: "bg-white border border-red-200 text-foreground",
  },
  purple: {
    card: "bg-gradient-to-br from-amber-100 via-cyan-100 to-purple-100 border-purple-200",
    headerBg: "bg-amber-400",
    headerText: "text-amber-900",
    bubbleUser: "bg-purple-600 text-white",
    bubbleBot: "bg-white border border-purple-200 text-foreground",
  },
  pink: {
    card: "bg-gradient-to-br from-pink-100 via-sky-100 to-slate-100 border-pink-200",
    headerBg: "bg-sky-500",
    headerText: "text-sky-950",
    bubbleUser: "bg-pink-600 text-white",
    bubbleBot: "bg-white border border-pink-200 text-foreground",
  },
  green: {
    card: "bg-gradient-to-br from-lime-100 via-green-100 to-orange-100 border-green-200",
    headerBg: "bg-orange-500",
    headerText: "text-orange-950",
    bubbleUser: "bg-green-600 text-white",
    bubbleBot: "bg-white border border-green-200 text-foreground",
  },
}

function replyForUnit(unit: 1 | 2 | 3 | 4, raw: string): string {
  const t = raw.trim()
  if (!t) return "اكتب سؤالك أعلاه، وسأحاول مساعدتك!"

  const has = (...subs: string[]) => subs.some((s) => t.includes(s))

  if (unit === 1) {
    if (has("كثاف", "سكان", "توزيع")) {
      return "الكثافة السكانية تعني عدد السكان لكل كم². في تونس، السكان يتركزون غالباً على الساحل والعاصمة، بينما الجنوب أقل كثافة بسبب المناخ."
    }
    if (has("خريطة", "مفتاح", "لون", "ألوان")) {
      return "استخدم مفتاح الخريطة: الأحمر كثافة عالية جداً، الأخضر مرتفعة، الأصفر ضعيفة، البرتقالي ضعيفة جداً. اضغط على لون لقراءة التفاصيل."
    }
    if (has("هجرة", "تنقل")) {
      return "الهجرة الداخلية تفسر جزءاً من توزيع السكان: كثير من التونسيين ينتقلون نحو الساحل والعاصمة بحثاً عن عمل وخدمات."
    }
    if (has("تونس", "عاصمة", "صفاقس", "جنوب")) {
      return "تونس الكبرى من أكثر المناطق كثافة. صفاقس مدينة كبيرة على الساحل. الجنوب كثافته أقل لكنه غني ثقافياً وجغرافياً."
    }
    return "يمكنني مساعدتك في أسئلة عن الكثافة السكانية، مفتاح الخريطة، أو أسباب توزيع السكان. جرّب أن تسأل عن «الكثافة» أو «الخريطة»."
  }

  if (unit === 2) {
    if (has("مناخ", "أمطار", "حرارة")) {
      return "تونس تعرف مناخاً رطباً في الشمال، شبه جاف في الوسط والساحل، وجافاً في الجنوب. كمية الأمطار تقل من الشمال نحو الجنوب."
    }
    if (has("رطب", "شمال")) {
      return "الشمال الغربي يستقبل أمطاراً أكثر، وهذا يفسر غطاءً نباتياً أغنى مقارنة بالجنوب."
    }
    if (has("جاف", "صحراء", "جنوب")) {
      return "الجنوب جاف: أمطار قليلة وحرارة مرتفعة صيفاً، مع مساحات صحراوية لكن أيضاً واحات مميزة."
    }
    return "اسألني عن المناخات في تونس: الفرق بين الرطب والشبه الجاف والجاف، أو عن الأمطار والحرارة."
  }

  if (unit === 3) {
    if (has("هجرة", "داخلية", "انتقال")) {
      return "الهجرة الداخلية تعني انتقال السكان داخل البلاد. مناطق مثل الساحل والعاصمة تستقبل سكاناً، بينما بعض المناطق الداخلية تفقد سكاناً."
    }
    if (has("استقبال", "إيجاب")) {
      return "حصيلة هجرية إيجابية تعني أن المنطقة تستقبل أكثر مما تفقد من السكان."
    }
    if (has("سلب", "طرد")) {
      return "حصيلة سلبية تعني أن المنطقة تفقد سكاناً نحو مناطق أخرى غالباً للعمل أو الخدمات."
    }
    return "يمكنني توضيح الهجرة الداخلية، الحصيلة الإيجابية والسلبية، واتجاهات الحركة على الخريطة."
  }

  if (unit === 4) {
    if (has("زيتون", "حبوب", "تمور", "صيد", "فلاحة")) {
      return "تونس معروفة بالزيتون والحبوب في الشمال، والتمور في الواحات، والصيد البحري على السواحل. كل منطقة ترتبط بمناخها وتربتها."
    }
    if (has("شمال", "جنوب")) {
      return "الشمال يصلح لحبوب وزيتون بفضل الأمطار. الجنوب يناسب النخيل والواحات. الساحل يربط الفلاحة والصيد."
    }
    return "اسأل عن الموارد الفلاحية، أنواع المحاصيل، أو أين تنتشر الزراعة والصيد في تونس."
  }

  return "جرب صياغة سؤالك بكلمات مفتاحية من الدرس (مثلاً: كثافة، مناخ، هجرة، محصول)."
}

interface ChapterChatbotProps {
  unitNumber: 1 | 2 | 3 | 4
  theme: UnitTheme
}

export function ChapterChatbot({ unitNumber, theme }: ChapterChatbotProps) {
  const th = themeClass[theme]
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    {
      role: "bot",
      text:
        unitNumber === 1
          ? "مرحباً! أنا مساعدك في درس الكثافات السكانية. ما سؤالك؟"
          : unitNumber === 2
            ? "أهلاً! اسألني عن المناخات في تونس."
            : unitNumber === 3
              ? "مرحباً! يمكنني مساعدتك في درس الصناعة والموارد والتوزيع الجغرافي."
              : "مرحباً! اسألني عن السياحة والسواحل في تونس.",
    },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    setInput("")
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: replyForUnit(unitNumber, text) }])
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    })
  }

  const suggestions =
    unitNumber === 1
      ? ["ما معنى الكثافة السكانية؟", "كيف أقرأ مفتاح الخريطة؟"]
      : unitNumber === 2
        ? ["ما الفرق بين المناخ الرطب والجاف؟", "أين تسقط أكثر الأمطار؟"]
        : unitNumber === 3
          ? ["ما هي الهجرة الداخلية؟", "ما معنى حصيلة هجرية إيجابية؟"]
          : ["أين يزرع الزيتون؟", "ما أهمية الصيد البحري؟"]

  return (
    <div className={cn("rounded-3xl p-5 shadow-xl border-2 relative overflow-hidden", th.card)}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative flex flex-col gap-3 min-h-[280px] max-h-[420px]">
        <div className="flex items-center gap-2">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", th.headerBg)}>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className={cn("font-bold text-lg", th.headerText)}>مساعد الدرس</h3>
        </div>

        <div
          ref={scrollRef}
          className="flex flex-col gap-2 flex-1 overflow-y-auto rounded-2xl bg-white/50 p-3 border border-black/5 min-h-[140px]"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed text-right",
                msg.role === "user" ? cn("self-end rounded-br-sm", th.bubbleUser) : cn("self-start rounded-bl-sm", th.bubbleBot)
              )}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setInput("")
                setMessages((m) => [
                  ...m,
                  { role: "user", text: s },
                  { role: "bot", text: replyForUnit(unitNumber, s) },
                ])
                requestAnimationFrame(() => {
                  scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
                })
              }}
              className="text-xs rounded-full px-3 py-1.5 bg-white/80 border border-black/10 hover:bg-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            dir="rtl"
          />
          <Button type="button" size="icon" className="rounded-xl shrink-0" onClick={sendMessage} aria-label="إرسال">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
