import { NextResponse } from "next/server"
import { systemPromptForUnit } from "@/lib/chat-prompts"

export const runtime = "nodejs"

const NDJSON = "application/x-ndjson; charset=utf-8"

type ChatMessage = { role: "user" | "assistant"; content: string }

type ApiErrorKind = "quota" | "auth" | "api"

function classifyOpenAiFailure(status: number, errBody: string): ApiErrorKind {
  let code: string | undefined
  try {
    code = (JSON.parse(errBody) as { error?: { code?: string } })?.error?.code
  } catch {
    /* ignore */
  }
  if (status === 429 || code === "insufficient_quota") return "quota"
  if (status === 401 || code === "invalid_api_key") return "auth"
  return "api"
}

/** Message utilisateur (arabe) quand l’API OpenAI refuse la requête */
function openAiFailureUserMessage(status: number, errBody: string): string {
  const kind = classifyOpenAiFailure(status, errBody)
  if (kind === "quota") {
    return "لا يمكنني الاتصال بالذكاء الاصطناعي: حساب OpenAI تجاوز الحصة أو لم يُفعّل الدفع. ادخل إلى platform.openai.com ثم قسم Billing (الفوترة) لإضافة رصيد أو تفعيل الاشتراك، ثم أعد المحاولة."
  }
  if (kind === "auth") {
    return "مفتاح API غير صالح. تحقّق من OPENAI_API_KEY في ملف .env.local ثم أعد تشغيل الخادم (npm run dev)."
  }
  return "تعذّر الحصول على إجابة من مزوّد الذكاء الاصطناعي. تحقّق من الشبكة أو من OPENAI_MODEL و OPENAI_BASE_URL."
}

export async function POST(req: Request) {
  let wantStream = false
  try {
    const body = await req.json()
    wantStream = body.stream === true
    const messages = body.messages as ChatMessage[]
    const unit = body.unit as 1 | 2 | 3 | 4

    if (!Array.isArray(messages) || !unit || unit < 1 || unit > 4) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "")

    if (!apiKey) {
      const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
      const reply = mockReply(unit, lastUser)
      if (wantStream) {
        return ndjsonStream([
          { type: "meta" as const, mock: true },
          { type: "token" as const, text: reply },
          { type: "done" as const },
        ])
      }
      return NextResponse.json({ reply, mock: true })
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
    const openaiPayload = {
      model,
      messages: [{ role: "system" as const, content: systemPromptForUnit(unit) }, ...messages],
      temperature: 0.6,
      max_tokens: 900,
      stream: wantStream,
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openaiPayload),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Chat API error:", res.status, errText)
      const apiError = classifyOpenAiFailure(res.status, errText)
      const reply = openAiFailureUserMessage(res.status, errText)
      if (wantStream) {
        return ndjsonStream([
          { type: "meta" as const, mock: false, apiError },
          { type: "token" as const, text: reply },
          { type: "done" as const },
        ])
      }
      return NextResponse.json({ reply, mock: false, apiError })
    }

    if (wantStream && res.body) {
      return streamOpenAIToNdjson(res.body)
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>
    }
    const reply =
      data.choices?.[0]?.message?.content?.trim() ?? "عذراً، لم أتمكن من الإجابة."
    return NextResponse.json({ reply, mock: false })
  } catch (e) {
    console.error(e)
    const reply = mockReply(1, "")
    if (wantStream) {
      return ndjsonStream([
        { type: "meta", mock: true },
        { type: "token", text: reply },
        { type: "done" },
      ])
    }
    return NextResponse.json({ error: "Chat failed", reply, mock: true }, { status: 200 })
  }
}

function encoder() {
  return new TextEncoder()
}

function ndjsonStream(
  events: Array<{ type: string; mock?: boolean; apiError?: ApiErrorKind; text?: string }>
) {
  const enc = encoder()
  const stream = new ReadableStream({
    start(controller) {
      for (const ev of events) {
        controller.enqueue(enc.encode(JSON.stringify(ev) + "\n"))
      }
      controller.close()
    },
  })
  return new Response(stream, {
    headers: {
      "Content-Type": NDJSON,
      "Cache-Control": "no-store",
    },
  })
}

function streamOpenAIToNdjson(openaiBody: ReadableStream<Uint8Array>) {
  const enc = encoder()
  const dec = new TextDecoder()
  const reader = openaiBody.getReader()

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(enc.encode(JSON.stringify({ type: "meta", mock: false }) + "\n"))
      let buffer = ""
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += dec.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""
          for (const line of lines) {
            emitOpenAIChunkLine(line, controller, enc)
          }
        }
        if (buffer.trim()) emitOpenAIChunkLine(buffer, controller, enc)
      } finally {
        reader.releaseLock()
      }
      controller.enqueue(enc.encode(JSON.stringify({ type: "done" }) + "\n"))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": NDJSON,
      "Cache-Control": "no-store",
    },
  })
}

function emitOpenAIChunkLine(
  line: string,
  controller: ReadableStreamDefaultController,
  enc: TextEncoder
) {
  const trimmed = line.trim()
  if (!trimmed.startsWith("data:")) return
  const data = trimmed.slice(5).trim()
  if (data === "[DONE]") return
  try {
    const json = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: string | null } }>
    }
    const piece = json.choices?.[0]?.delta?.content
    if (piece) {
      controller.enqueue(enc.encode(JSON.stringify({ type: "token", text: piece }) + "\n"))
    }
  } catch {
    /* skip malformed chunks */
  }
}

/** Fallback when no API key or error — still educational Arabic content. */
function mockReply(unit: 1 | 2 | 3 | 4, userText: string): string {
  const t = userText.trim()
  if (!t) return "مرحباً! اكتب سؤالك عن الدرس وسأساعدك بشرح مبسط."

  const hints: Record<1 | 2 | 3 | 4, string> = {
    1: "تذكّر: الكثافة السكانية تعني عدد السكان في كل كم². في تونس، الساحل والعاصمة أكثر كثافة من الجنوب. هل تريد أن أشرح الفرق بين الهجرة الداخلية والخارجية؟",
    2: "المناخ في تونس يتنوع: رطب في الشمال، شبه جاف في الوسط، وجاف في الجنوب. الأمطار تقلّ عادةً من الشمال نحو الجنوب. ما الذي تريد معرفته عن المحاصيل؟",
    3: "الصناعة تحتاج موارد وبشراً ونقلاً. الخرائط تساعدنا على فهم أين تتركز المصانع. هل سؤالك عن الطاقة أم عن التوزع الجغرافي؟",
    4: "السياحة مرتبطة بالسواحل والمناخ والمواقع. تونس معروفة بشواطئها وتراثها. ما الوجهة التي تودّ معرفة المزيد عنها؟",
  }

  if (t.length < 3) return hints[unit]
  return `${hints[unit]}\n\n(لتفعيل الذكاء الاصطناعي الحقيقي: أنشئ ملف .env.local في المشروع وأضف OPENAI_API_KEY=sk-... ثم أعد تشغيل الخادم.)`
}
