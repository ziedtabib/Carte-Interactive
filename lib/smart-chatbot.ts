type UnitId = 1 | 2 | 3 | 4

/**
 * Fallback local intelligent: courte réponse pédagogique en arabe.
 * Utilisée automatiquement si DeepSeek est indisponible.
 */
export function smartResponse(message: string, unit: number): string {
  const u: UnitId = unit >= 1 && unit <= 4 ? (unit as UnitId) : 1
  const text = message.trim()

  if (!text) {
    return "مرحباً! اكتب سؤالك عن الدرس وسأشرح لك بطريقة بسيطة."
  }

  const genericHints: Record<UnitId, string> = {
    1: "تذكّر: الكثافة السكانية هي عدد السكان في الكيلومتر المربع. في تونس يكثر السكان في الساحل والعاصمة.",
    2: "تذكّر: مناخ تونس يتدرج من رطب شمالاً إلى جاف جنوباً، وهذا يؤثر مباشرة في نوع الزراعة.",
    3: "تذكّر: تتركز الصناعة حيث توجد الموارد والطاقة والنقل واليد العاملة.",
    4: "تذكّر: السياحة تقوى في المناطق الساحلية والمواقع الأثرية ذات الخدمات الجيدة.",
  }

  if (u === 2) {
    if (text.includes("رطب")) {
      return "المناخ الرطب يوجد أساساً في شمال تونس. أمطاره أكثر، لذلك تنجح فيه بعض الزراعات مثل الحبوب والأشجار المثمرة."
    }
    if (text.includes("جاف")) {
      return "المناخ الجاف يتركز في الجنوب. الأمطار فيه قليلة، لذلك يعتمد الناس أكثر على الواحات وزراعة التمور."
    }
    if (text.includes("شبه")) {
      return "المناخ شبه الجاف يقع غالباً في الوسط. أمطاره متوسطة، ولذلك يناسب زراعات مثل الزيتون والحبوب."
    }
  }

  return `${genericHints[u]}\n\nإذا أردت، أستطيع أن أشرح الفكرة بخريطة الدرس خطوة بخطوة.`
}
