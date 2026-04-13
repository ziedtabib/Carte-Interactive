"use client"

import { useRef, useState } from "react"
import { MessageCircle, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type UnitTheme = "red" | "purple" | "pink" | "green"

/** État d’affichage sous le titre (null = aucune réponse encore) */
type ChatBanner = null | "demo" | "live" | "quota" | "auth" | "api"

function applyMetaToBanner(ev: { mock?: boolean; apiError?: string }): ChatBanner {
  const err = ev.apiError
  if (err === "quota") return "quota"
  if (err === "auth") return "auth"
  if (err === "network" || err === "api" || err === "invalid_response") return "api"
  if (ev.mock === true) return "demo"
  return "live"
}

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

interface AIChatbotProps {
  unitNumber: 1 | 2 | 3 | 4
  theme: UnitTheme
}

export function AIChatbot({ unitNumber, theme }: AIChatbotProps) {
  const th = themeClass[theme]
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        unitNumber === 1
          ? "مرحباً! أنا مساعدك الذكي في درس السكان والكثافة. ما سؤالك؟"
          : unitNumber === 2
            ? "أهلاً! يمكنني شرح المناخ والفلاحة بأسلوب بسيط. ما الذي يهمّك؟"
            : unitNumber === 3
              ? "مرحباً! اسألني عن الصناعة والموارد في تونس."
              : "مرحباً! لنتحدث عن السياحة والسواحل التونسية.",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [banner, setBanner] = useState<ChatBanner>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () =>
    requestAnimationFrame(() =>
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
    )

  const fetchReply = async (nextMsgs: { role: "user" | "assistant"; content: string }[]) => {
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit: unitNumber,
          stream: true,
          messages: nextMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const ct = res.headers.get("content-type") ?? ""
      if (ct.includes("ndjson") && res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let lineBuf = ""
        let assistantContent = ""
        setMessages([...nextMsgs, { role: "assistant", content: "" }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          lineBuf += decoder.decode(value, { stream: true })
          const lines = lineBuf.split("\n")
          lineBuf = lines.pop() ?? ""
          for (const raw of lines) {
            if (!raw.trim()) continue
            let ev: { type?: string; mock?: boolean; apiError?: string; text?: string }
            try {
              ev = JSON.parse(raw) as { type?: string; mock?: boolean; apiError?: string; text?: string }
            } catch {
              continue
            }
            if (ev.type === "meta") {
              setBanner(applyMetaToBanner(ev))
            }
            if (ev.type === "token" && typeof ev.text === "string") {
              assistantContent += ev.text
              setMessages([...nextMsgs, { role: "assistant", content: assistantContent }])
              scrollToBottom()
            }
          }
        }
        if (lineBuf.trim()) {
          try {
            const ev = JSON.parse(lineBuf) as {
              type?: string
              mock?: boolean
              apiError?: string
              text?: string
            }
            if (ev.type === "meta") setBanner(applyMetaToBanner(ev))
            if (ev.type === "token" && typeof ev.text === "string") {
              assistantContent += ev.text
              setMessages([...nextMsgs, { role: "assistant", content: assistantContent }])
            }
          } catch {
            /* ignore */
          }
        }
        if (!assistantContent.trim()) {
          setMessages([
            ...nextMsgs,
            { role: "assistant", content: "حدث خطأ، حاول لاحقاً." },
          ])
        }
        scrollToBottom()
        return
      }

      const data = (await res.json()) as {
        reply?: string
        mock?: boolean
        apiError?: string
      }
      const reply = typeof data.reply === "string" ? data.reply : "حدث خطأ، حاول لاحقاً."
      setBanner(applyMetaToBanner({ mock: data.mock, apiError: data.apiError }))
      setMessages([...nextMsgs, { role: "assistant", content: reply }])
    } catch {
      setBanner(null)
      setMessages([...nextMsgs, { role: "assistant", content: "تعذّر الاتصال بالخادم. تحقق من الشبكة." }])
    } finally {
      setLoading(false)
      scrollToBottom()
    }
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    const nextMsgs = [...messages, { role: "user" as const, content: text }]
    setMessages(nextMsgs)
    await fetchReply(nextMsgs)
  }

  const sendWithText = async (text: string) => {
    if (loading) return
    const nextMsgs = [...messages, { role: "user" as const, content: text }]
    setMessages(nextMsgs)
    await fetchReply(nextMsgs)
  }

  const suggestions =
    unitNumber === 1
      ? ["ما معنى الكثافة السكانية؟", "ما هي الهجرة الداخلية؟"]
      : unitNumber === 2
        ? ["ما الفرق بين المناخ الرطب والجاف؟", "أين تنتشر الزيتون؟"]
        : unitNumber === 3
          ? ["ما دور الموارد في الصناعة؟", "أين تتركز المصانع غالباً؟"]
          : ["لماذا السياحة مهمة لتونس؟", "ما خصائص السواحل؟"]

  return (
    <div className={cn("rounded-3xl p-5 shadow-xl border-2 relative overflow-hidden", th.card)}>
      <div className="relative flex flex-col gap-3 min-h-[300px] max-h-[440px]">
        <div className="flex items-center gap-2">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", th.headerBg)}>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className={cn("font-bold text-lg leading-tight", th.headerText)}>مساعد الدرس الذكي</h3>
            {banner === "demo" && (
              <span className="text-[11px] text-muted-foreground font-normal mt-0.5">
                وضع تجريبي — أضف DEEPSEEK_API_KEY في .env.local لتفعيل الإجابات الحية (DeepSeek)
              </span>
            )}
            {banner === "live" && (
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal mt-0.5">
                متصل بـ DeepSeek — إجابات مباشرة
              </span>
            )}
            {banner === "quota" && (
              <span className="text-[11px] text-amber-800 dark:text-amber-200 font-normal mt-0.5">
                حدّ الاستخدام أو الرصيد منتهٍ — راجع حسابك على منصة DeepSeek
              </span>
            )}
            {banner === "auth" && (
              <span className="text-[11px] text-destructive font-normal mt-0.5">
                مفتاح DEEPSEEK_API_KEY غير صالح أو مفقود — تحقق من .env.local
              </span>
            )}
            {banner === "api" && (
              <span className="text-[11px] text-destructive/90 font-normal mt-0.5">
                تعذّر الاتصال بالخادم أو استجابة غير صالحة — تحقق من الشبكة أو حاول لاحقاً
              </span>
            )}
          </div>
        </div>

        <div ref={scrollRef} className="flex flex-col gap-2 flex-1 overflow-y-auto rounded-2xl bg-white/50 p-3 border border-black/5 min-h-[160px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[95%] rounded-2xl px-3 py-2 text-sm leading-relaxed text-right transition-opacity duration-200",
                msg.role === "user" ? cn("self-end rounded-br-sm", th.bubbleUser) : cn("self-start rounded-bl-sm", th.bubbleBot)
              )}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm self-start py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الكتابة…</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => void sendWithText(s)}
              className="text-xs rounded-full px-3 py-1.5 bg-white/80 border border-black/10 hover:bg-white transition-colors disabled:opacity-50"
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            dir="rtl"
            disabled={loading}
          />
          <Button type="button" size="icon" className="rounded-xl shrink-0" onClick={send} disabled={loading} aria-label="إرسال">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
