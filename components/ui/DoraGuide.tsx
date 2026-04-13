"use client"

import { ExplorerCharacter } from "@/components/explorer-character"
import { SpeechBubble } from "@/components/speech-bubble"

export type DoraState = "idle" | "explaining" | "happy" | "sad"

interface DoraGuideProps {
  state: DoraState
  message: string
}

export function DoraGuide({ state, message }: DoraGuideProps) {
  const accent =
    state === "happy"
      ? "border-emerald-200 bg-emerald-50"
      : state === "sad"
        ? "border-rose-200 bg-rose-50"
        : "border-red-200 bg-white"

  return (
    <div className={`rounded-3xl p-4 shadow-xl border-2 ${accent}`}>
      <div className="flex items-start gap-4">
        <ExplorerCharacter size="sm" waving={state !== "idle"} />
        <div className="flex-1">
          <SpeechBubble direction="right" className="text-base">
            {message}
          </SpeechBubble>
        </div>
      </div>
    </div>
  )
}
