export type MigrationType = "positive" | "negative"

export interface MigrationRegion {
  id: string
  nameAr: string
  migrationType: MigrationType
  explanationAr: string
  center: { x: number; y: number }
  path: string
}

export interface MigrationFlow {
  from: string
  to: string
}

export const positiveRegions = [
  "تونس",
  "صفاقس",
  "سوسة",
  "نابل",
  "المنستير",
  "مدنين",
  "قبلي",
  "توزر",
] as const
export const negativeRegions = ["القصرين", "سيدي بوزيد", "قفصة", "جندوبة", "الكاف", "سليانة"] as const

export const flows: MigrationFlow[] = [
  { from: "القصرين", to: "تونس" },
  { from: "سيدي بوزيد", to: "سوسة" },
  { from: "قفصة", to: "صفاقس" },
  { from: "جندوبة", to: "تونس" },
  { from: "الكاف", to: "نابل" },
]

export const migrationRegions: MigrationRegion[] = [
  {
    id: "jendouba",
    nameAr: "جندوبة",
    migrationType: "negative",
    explanationAr: "منطقة ذات حصيلة هجرية سلبية بسبب انتقال الشباب نحو الساحل والعاصمة.",
    center: { x: 198, y: 300 },
    path: "M70 65 L126 58 L150 92 L132 136 L80 140 L58 102 Z",
  },
  {
    id: "kef",
    nameAr: "الكاف",
    migrationType: "negative",
    explanationAr: "الكاف من مناطق الطرد حيث يهاجر السكان بحثا عن فرص عمل أفضل.",
    center: { x: 208, y: 334 },
    path: "M58 135 L128 136 L132 198 L84 224 L52 188 Z",
  },
  {
    id: "siliana",
    nameAr: "سليانة",
    migrationType: "negative",
    explanationAr: "تسجل سليانة هجرة داخلية نحو المدن الساحلية والخدمات الحضرية.",
    center: { x: 214, y: 360 },
    path: "M130 142 L188 140 L210 182 L188 228 L136 226 L118 196 Z",
  },
  {
    id: "tunis",
    nameAr: "تونس",
    migrationType: "positive",
    explanationAr: "تونس الكبرى منطقة استقبال رئيسية بفضل التعليم، الشغل، والخدمات.",
    center: { x: 246, y: 300 },
    path: "M170 62 L228 56 L252 88 L236 124 L186 128 L160 94 Z",
  },
  {
    id: "nabeul",
    nameAr: "نابل",
    migrationType: "positive",
    explanationAr: "نابل تستقبل مهاجرين داخليين بفضل الاقتصاد والخدمات السياحية.",
    center: { x: 272, y: 316 },
    path: "M254 88 L314 84 L338 120 L320 168 L270 172 L244 128 Z",
  },
  {
    id: "sousse",
    nameAr: "سوسة",
    migrationType: "positive",
    explanationAr: "سوسة من أهم مناطق الاستقبال على الساحل الشرقي.",
    center: { x: 260, y: 356 },
    path: "M226 202 L292 198 L320 242 L300 304 L246 308 L216 256 Z",
  },
  {
    id: "monastir",
    nameAr: "المنستير",
    migrationType: "positive",
    explanationAr: "المنستير تستقطب السكان عبر الأنشطة الصناعية والخدمات.",
    center: { x: 268, y: 372 },
    path: "M284 276 L334 272 L354 304 L344 344 L300 350 L274 322 Z",
  },
  {
    id: "kasserine",
    nameAr: "القصرين",
    migrationType: "negative",
    explanationAr: "القصرين من أبرز مناطق الطرد باتجاه الساحل والعاصمة.",
    center: { x: 200, y: 406 },
    path: "M116 236 L186 234 L210 286 L186 346 L128 350 L96 292 Z",
  },
  {
    id: "sidi_bouzid",
    nameAr: "سيدي بوزيد",
    migrationType: "negative",
    explanationAr: "تشهد سيدي بوزيد هجرة داخلية نتيجة محدودية فرص الشغل المحلية.",
    center: { x: 222, y: 426 },
    path: "M188 306 L252 302 L278 352 L254 414 L198 418 L166 360 Z",
  },
  {
    id: "sfax",
    nameAr: "صفاقس",
    migrationType: "positive",
    explanationAr: "صفاقس قطب اقتصادي كبير يستقبل مهاجرين من عدة ولايات.",
    center: { x: 252, y: 448 },
    path: "M242 352 L314 350 L344 410 L320 480 L262 484 L228 420 Z",
  },
  {
    id: "gafsa",
    nameAr: "قفصة",
    migrationType: "negative",
    explanationAr: "قفصة منطقة ذات حصيلة هجرية سلبية باتجاه المدن الساحلية.",
    center: { x: 206, y: 462 },
    path: "M88 360 L164 356 L200 432 L174 514 L108 520 L66 450 Z",
  },
  {
    id: "medenine",
    nameAr: "مدنين",
    migrationType: "positive",
    explanationAr: "مدنين تستقبل سكاناً من الجهات الداخلية بفضل النشاط السياحي والخدمات.",
    center: { x: 282, y: 446 },
    path: "M262 420 L302 416 L318 448 L308 478 L268 482 L252 452 Z",
  },
  {
    id: "kebili",
    nameAr: "قبلي",
    migrationType: "positive",
    explanationAr: "قبلي منطقة استقبال نسبية في الجنوب الغربي بفضل الفلاحة والواحات.",
    center: { x: 192, y: 494 },
    path: "M168 472 L218 468 L232 508 L210 528 L172 524 L156 492 Z",
  },
  {
    id: "tozeur",
    nameAr: "توزر",
    migrationType: "positive",
    explanationAr: "توزر تستقطب مهاجرين داخليين بفضل السياحة الصحراوية والأنشطة الفلاحية.",
    center: { x: 154, y: 472 },
    path: "M132 448 L176 444 L188 478 L170 502 L138 498 L124 468 Z",
  },
]

export const migrationRegionsByName = Object.fromEntries(
  migrationRegions.map((region) => [region.nameAr, region])
) as Record<string, MigrationRegion>
