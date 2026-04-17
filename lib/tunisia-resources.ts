/**
 * Points de ressources (énergie + mines) positionnés en % sur la carte de base `carte1.jpg`.
 * (0,0) = coin haut-gauche de l’image, repère adapté à la forme de la Tunisie sur cette carte.
 */

export type ResourceType = "phosphate" | "oil" | "gas" | "electric" | "iron"

export interface TunisiaResourcePoint {
  id: string
  /** Nom affiché (arabe) */
  name: string
  x: number
  y: number
  /** WGS84 — pour projection sur la carte vectorielle (GeoJSON GADM) */
  lat: number
  lng: number
  type: ResourceType
  /** Texte détaillé pour la fenêtre d’information */
  description: string
}

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  oil: "نفط",
  gas: "غاز",
  phosphate: "فوسفاط",
  electric: "كهرباء",
  iron: "حديد",
}

/** Symboles visuels (émojis + couleur sémantique côté composant) */
export const RESOURCE_TYPE_EMOJI: Record<ResourceType, string> = {
  oil: "🟦",
  gas: "🟪",
  phosphate: "🔶",
  electric: "⚡",
  iron: "🔺",
}

export const TUNISIA_RESOURCE_POINTS: TunisiaResourcePoint[] = [
  {
    id: "el-borma",
    name: "حقل البرمة",
    x: 45,
    y: 72,
    lat: 31.816,
    lng: 9.234,
    type: "oil",
    description:
      "من أهم حقول النفط والغاز في الجنوب التونسي؛ يربط الجنوب بشبكة الأنابيب نحو الساحل والتصدير.",
  },
  {
    id: "gafsa-phosphate",
    name: "مناجم قفصة (فوسفاط)",
    x: 37,
    y: 48,
    lat: 34.425,
    lng: 8.784,
    type: "phosphate",
    description:
      "تتركز مناجم الفوسفاط في حوض قفصة؛ خام استراتيجي للأسمدة والصناعات الكيماوية.",
  },
  {
    id: "metlaoui",
    name: "المتلوي",
    x: 35,
    y: 46,
    lat: 34.321,
    lng: 8.401,
    type: "phosphate",
    description: "منطقة فوسفاط تاريخية قرب قفصة، مرتبطة بسلسلة استغلال ونقل الخام.",
  },
  {
    id: "skhira",
    name: "الصخيرة",
    x: 58,
    y: 54,
    lat: 34.748,
    lng: 10.022,
    type: "oil",
    description: "محطة ومرفأ مهمّ لتصدير النفط؛ تتلقى الموائع عبر أنابيب من الجنوب.",
  },
  {
    id: "tunis-thermal",
    name: "مولد حراري — تونس",
    x: 50,
    y: 26,
    lat: 36.806,
    lng: 10.181,
    type: "electric",
    description: "العاصمة تضمّ توليداً كهربائياً حرارياً يغذي الاستهلاك والصناعة الكثيفة.",
  },
  {
    id: "bizerte-thermal",
    name: "مولد حراري — بنزرت",
    x: 48,
    y: 18,
    lat: 37.274,
    lng: 9.873,
    type: "electric",
    description: "منشأة ساحلية تساهم في تزويد الشمال بالطاقة.",
  },
  {
    id: "beni-mtir",
    name: "بني مطير (مائي)",
    x: 41,
    y: 28,
    lat: 36.757,
    lng: 8.752,
    type: "electric",
    description: "توليد كهربائي مائي يستغل السدود والتضاريس في الشمال الغربي.",
  },
  {
    id: "tazarka-offshore",
    name: "تازركة (بحرية)",
    x: 57,
    y: 34,
    lat: 36.405,
    lng: 10.712,
    type: "gas",
    description: "مدخرات وحقول بحرية للغاز الطبيعي قبالة الساحل الشرقي.",
  },
  {
    id: "jerissa-iron",
    name: "الجريصة (حديد)",
    x: 39,
    y: 22,
    lat: 36.482,
    lng: 8.408,
    type: "iron",
    description: "من أهم مواقع خام الحديد في الشمال الغربي.",
  },
  {
    id: "tabarka-lead-context",
    name: "طبرقة — منطقة معدنية",
    x: 36,
    y: 18,
    lat: 36.954,
    lng: 8.758,
    type: "iron",
    description: "منطقة تاريخية لاستغلال معادن؛ للربط مع دروس التوزع الجغرافي للموارد.",
  },
  {
    id: "douleb",
    name: "الدولاب",
    x: 43,
    y: 41,
    lat: 35.333,
    lng: 9.033,
    type: "oil",
    description: "حقل مرتبط بشبكة الأنابيب نحو الساحل والبنية التحتية الصناعية.",
  },
  {
    id: "gabes-coast",
    name: "قابس — سواحل",
    x: 52,
    y: 60,
    lat: 33.884,
    lng: 10.098,
    type: "gas",
    description: "ربط صناعي وطاقوي على الساحل الجنوبي الشرقي.",
  },
]

/** Alias pratique pour les exemples / cartes SVG (même données que `TUNISIA_RESOURCE_POINTS`). */
export const resourcesData = TUNISIA_RESOURCE_POINTS
