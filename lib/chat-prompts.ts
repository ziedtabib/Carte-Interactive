/** Prompts éducatifs en arabe (niveau 6e primaire) pour le chatbot. */

type UnitId = 1 | 2 | 3 | 4

const BASE_PROMPT = `أنت مساعد تعليمي لطيف لتلاميذ السنة السادسة ابتدائي في تونس.
اكتب بالعربية الفصحى المبسطة فقط.
اجعل الإجابات قصيرة وواضحة (4 إلى 8 جمل).
اشرح بالأمثلة من تونس وبأسلوب مشجع.
إذا كان السؤال خارج الدرس، اعتذر بلطف وأعد التوجيه إلى الجغرافيا.
لا تختلق أرقاماً دقيقة إذا لم تكن متأكداً.`

const UNIT_PROMPTS: Record<UnitId, string> = {
  1: "السياق: البلاد التونسية: السكان (التوزع، الكثافة السكانية، الهجرة الداخلية).",
  2: "السياق: ظروف النشاط الفلاحي الطبيعية والبشرية (المناخ، الأمطار، الزراعة).",
  3: "السياق: الصناعة بالبلاد التونسية (الموارد، التوزع الجغرافي للأنشطة الصناعية).",
  4: "السياق: السياحة بالبلاد التونسية (السواحل، الجهات السياحية، أهمية السياحة).",
}

export function getSystemPrompt(unit: number): string {
  const safeUnit: UnitId = unit >= 1 && unit <= 4 ? (unit as UnitId) : 1
  return `${BASE_PROMPT}\n\n${UNIT_PROMPTS[safeUnit]}`
}

/** Backward compatibility with previous import name. */
export function systemPromptForUnit(unit: UnitId): string {
  return getSystemPrompt(unit)
}
