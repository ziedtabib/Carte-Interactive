import { NextResponse } from "next/server"
import { getSystemPrompt } from "@/lib/chat-prompts"
import { smartResponse } from "@/lib/smart-chatbot"

export const runtime = "nodejs"

const NDJSON = "application/x-ndjson; charset=utf-8"
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
const REQUEST_TIMEOUT_MS = 4500

type ChatMessage = { role: "user" | "assistant"; content: string }
type ApiErrorKind = "auth" | "quota" | "network" | "invalid_response" | "api"

type ChatResult = {
  message: string
  mock: boolean
  apiError: ApiErrorKind | null
}

type InputMessage = {
  role?: string
  content?: string
  parts?: Array<{ type?: string; text?: string }>
}

function parseUnit(raw: unknown): 1 | 2 | 3 | 4 | null {
  const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw) : NaN
  if (!Number.isInteger(n) || n < 1 || n > 4) return null
  return n as 1 | 2 | 3 | 4
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return []
  const out: ChatMessage[] = []
  for (const m of input as InputMessage[]) {
    const role = m?.role === "assistant" ? "assistant" : "user"
    const content =
      typeof m?.content === "string"
        ? m.content
        : Array.isArray(m?.parts)
          ? m.parts
              .filter((p) => p?.type === "text" && typeof p?.text === "string")
              .map((p) => p.text as string)
              .join("\n")
          : ""
    if (content.trim()) out.push({ role, content: content.trim() })
  }
  return out
}

function classifyDeepSeekFailure(status: number, bodyText: string): ApiErrorKind {
  const low = bodyText.toLowerCase()
  if (status === 401 || status === 403 || low.includes("api key")) return "auth"
  if (status === 429 || low.includes("quota") || low.includes("rate limit")) return "quota"
  return "api"
}

async function callDeepSeek(
  messages: ChatMessage[],
  unit: 1 | 2 | 3 | 4,
  stream: boolean
): Promise<Response> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error("missing_api_key")
  }

  const payload = {
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    temperature: 0.7,
    stream,
    messages: [{ role: "system", content: getSystemPrompt(unit) }, ...messages],
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

function asFallback(messages: ChatMessage[], unit: 1 | 2 | 3 | 4, apiError: ApiErrorKind | null): ChatResult {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? ""
  const message = smartResponse(lastUser, unit)
  return { message, mock: true, apiError }
}

export async function POST(req: Request) {
  let wantStream = false
  let unit: 1 | 2 | 3 | 4 = 1
  let messages: ChatMessage[] = []

  try {
    const body = await req.json()
    wantStream = body.stream === true
    const parsedUnit = parseUnit(body.unit)
    if (parsedUnit === null) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    unit = parsedUnit
    messages = normalizeMessages(body.messages)

    if (!Array.isArray(body.messages)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    let res: Response
    try {
      res = await callDeepSeek(messages, unit, wantStream)
    } catch (e) {
      const apiError = e instanceof Error && e.message === "missing_api_key" ? "auth" : "network"
      const fallback = asFallback(messages, unit, apiError)
      if (wantStream) {
        return ndjsonFromResult(fallback)
      }
      return NextResponse.json({ message: fallback.message, reply: fallback.message, mock: true, apiError })
    }

    if (!res.ok) {
      const errText = await res.text()
      const apiError = classifyDeepSeekFailure(res.status, errText)
      const fallback = asFallback(messages, unit, apiError)
      if (wantStream) {
        return ndjsonFromResult(fallback)
      }
      return NextResponse.json({ message: fallback.message, reply: fallback.message, mock: true, apiError })
    }

    if (wantStream && res.body) {
      return streamDeepSeekToNdjson(res.body)
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>
    }
    const message = data.choices?.[0]?.message?.content?.trim()
    if (!message) {
      const fallback = asFallback(messages, unit, "invalid_response")
      return NextResponse.json({ message: fallback.message, reply: fallback.message, mock: true, apiError: "invalid_response" })
    }
    return NextResponse.json({ message, reply: message, mock: false, apiError: null })
  } catch {
    const fallback = asFallback(messages, unit, "api")
    if (wantStream) return ndjsonFromResult(fallback)
    return NextResponse.json({ message: fallback.message, reply: fallback.message, mock: true, apiError: "api" }, { status: 200 })
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

function ndjsonFromResult(result: ChatResult) {
  return ndjsonStream([
    { type: "meta", mock: result.mock, apiError: result.apiError ?? undefined },
    { type: "token", text: result.message },
    { type: "done" },
  ])
}

function streamDeepSeekToNdjson(sseBody: ReadableStream<Uint8Array>) {
  const enc = encoder()
  const dec = new TextDecoder()
  const reader = sseBody.getReader()

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
            emitDeepSeekChunkLine(line, controller, enc)
          }
        }
        if (buffer.trim()) emitDeepSeekChunkLine(buffer, controller, enc)
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

function emitDeepSeekChunkLine(
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
