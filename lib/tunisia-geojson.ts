// Tunisia governorates data with properties for different map types
export interface GovernorateData {
  id: string
  name: string
  nameAr: string
  center: { lat: number; lng: number }
  population: number
  density: "very_high" | "high" | "medium" | "low"
  climate: "humid" | "semi_arid" | "arid"
  migration: "positive" | "negative"
  agriculture: string[]
}

export const governorates: GovernorateData[] = [
  {
    id: "tunis",
    name: "Tunis",
    nameAr: "تونس",
    center: { lat: 36.8065, lng: 10.1815 },
    population: 1056247,
    density: "very_high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["خضر", "زيتون"]
  },
  {
    id: "ariana",
    name: "Ariana",
    nameAr: "أريانة",
    center: { lat: 36.8625, lng: 10.1956 },
    population: 576088,
    density: "very_high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["خضر", "حبوب"]
  },
  {
    id: "ben_arous",
    name: "Ben Arous",
    nameAr: "بن عروس",
    center: { lat: 36.7471, lng: 10.2306 },
    population: 631842,
    density: "very_high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["خضر", "زيتون"]
  },
  {
    id: "manouba",
    name: "Manouba",
    nameAr: "منوبة",
    center: { lat: 36.8101, lng: 10.0863 },
    population: 379518,
    density: "high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["حبوب", "خضر"]
  },
  {
    id: "nabeul",
    name: "Nabeul",
    nameAr: "نابل",
    center: { lat: 36.4513, lng: 10.7357 },
    population: 787920,
    density: "high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["زيتون", "حمضيات", "خضر"]
  },
  {
    id: "zaghouan",
    name: "Zaghouan",
    nameAr: "زغوان",
    center: { lat: 36.4029, lng: 10.1429 },
    population: 176945,
    density: "medium",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["حبوب", "زيتون"]
  },
  {
    id: "bizerte",
    name: "Bizerte",
    nameAr: "بنزرت",
    center: { lat: 37.2744, lng: 9.8739 },
    population: 568219,
    density: "high",
    climate: "humid",
    migration: "negative",
    agriculture: ["حبوب", "كروم", "غابات"]
  },
  {
    id: "beja",
    name: "Beja",
    nameAr: "باجة",
    center: { lat: 36.7256, lng: 9.1817 },
    population: 303032,
    density: "medium",
    climate: "humid",
    migration: "negative",
    agriculture: ["حبوب", "غابات", "كروم"]
  },
  {
    id: "jendouba",
    name: "Jendouba",
    nameAr: "جندوبة",
    center: { lat: 36.5011, lng: 8.7803 },
    population: 401477,
    density: "medium",
    climate: "humid",
    migration: "negative",
    agriculture: ["حبوب", "غابات", "فلين"]
  },
  {
    id: "kef",
    name: "Kef",
    nameAr: "الكاف",
    center: { lat: 36.1742, lng: 8.7049 },
    population: 243156,
    density: "low",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["حبوب", "رعي"]
  },
  {
    id: "siliana",
    name: "Siliana",
    nameAr: "سليانة",
    center: { lat: 36.0849, lng: 9.3708 },
    population: 223087,
    density: "low",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["حبوب", "زيتون"]
  },
  {
    id: "sousse",
    name: "Sousse",
    nameAr: "سوسة",
    center: { lat: 35.8254, lng: 10.6084 },
    population: 674971,
    density: "very_high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["زيتون", "خضر"]
  },
  {
    id: "monastir",
    name: "Monastir",
    nameAr: "المنستير",
    center: { lat: 35.7643, lng: 10.8113 },
    population: 548828,
    density: "very_high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["زيتون"]
  },
  {
    id: "mahdia",
    name: "Mahdia",
    nameAr: "المهدية",
    center: { lat: 35.5047, lng: 11.0622 },
    population: 410812,
    density: "high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["زيتون", "صيد بحري"]
  },
  {
    id: "sfax",
    name: "Sfax",
    nameAr: "صفاقس",
    center: { lat: 34.7406, lng: 10.7603 },
    population: 955421,
    density: "high",
    climate: "semi_arid",
    migration: "positive",
    agriculture: ["زيتون", "لوز"]
  },
  {
    id: "kairouan",
    name: "Kairouan",
    nameAr: "القيروان",
    center: { lat: 35.6781, lng: 10.0963 },
    population: 570559,
    density: "medium",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["حبوب", "زيتون"]
  },
  {
    id: "kasserine",
    name: "Kasserine",
    nameAr: "القصرين",
    center: { lat: 35.1676, lng: 8.8365 },
    population: 439243,
    density: "low",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["حبوب", "حلفاء", "رعي"]
  },
  {
    id: "sidi_bouzid",
    name: "Sidi Bouzid",
    nameAr: "سيدي بوزيد",
    center: { lat: 35.0354, lng: 9.4839 },
    population: 429912,
    density: "low",
    climate: "semi_arid",
    migration: "negative",
    agriculture: ["زيتون", "لوز", "حبوب"]
  },
  {
    id: "gabes",
    name: "Gabes",
    nameAr: "قابس",
    center: { lat: 33.8815, lng: 10.0982 },
    population: 374300,
    density: "medium",
    climate: "arid",
    migration: "positive",
    agriculture: ["نخيل", "واحات"]
  },
  {
    id: "medenine",
    name: "Medenine",
    nameAr: "مدنين",
    center: { lat: 33.3549, lng: 10.5055 },
    population: 479520,
    density: "low",
    climate: "arid",
    migration: "negative",
    agriculture: ["زيتون", "رعي"]
  },
  {
    id: "tataouine",
    name: "Tataouine",
    nameAr: "تطاوين",
    center: { lat: 32.9297, lng: 10.4518 },
    population: 149453,
    density: "low",
    climate: "arid",
    migration: "negative",
    agriculture: ["رعي", "نخيل"]
  },
  {
    id: "gafsa",
    name: "Gafsa",
    nameAr: "قفصة",
    center: { lat: 34.425, lng: 8.7842 },
    population: 337331,
    density: "low",
    climate: "arid",
    migration: "negative",
    agriculture: ["نخيل", "واحات", "فسفاط"]
  },
  {
    id: "tozeur",
    name: "Tozeur",
    nameAr: "توزر",
    center: { lat: 33.9197, lng: 8.1339 },
    population: 107912,
    density: "low",
    climate: "arid",
    migration: "negative",
    agriculture: ["نخيل", "واحات", "تمور"]
  },
  {
    id: "kebili",
    name: "Kebili",
    nameAr: "قبلي",
    center: { lat: 33.7044, lng: 8.9690 },
    population: 156961,
    density: "low",
    climate: "arid",
    migration: "negative",
    agriculture: ["نخيل", "تمور"]
  }
]

// Major cities for markers
export const majorCities = [
  { name: "تونس العاصمة", lat: 36.8065, lng: 10.1815, population: 1056247 },
  { name: "صفاقس", lat: 34.7406, lng: 10.7603, population: 330440 },
  { name: "سوسة", lat: 35.8254, lng: 10.6084, population: 271428 },
  { name: "القيروان", lat: 35.6781, lng: 10.0963, population: 186653 },
  { name: "بنزرت", lat: 37.2744, lng: 9.8739, population: 142966 },
  { name: "قابس", lat: 33.8815, lng: 10.0982, population: 130853 },
  { name: "قفصة", lat: 34.425, lng: 8.7842, population: 111170 },
  { name: "المنستير", lat: 35.7643, lng: 10.8113, population: 93306 }
]

// Migration flows for Unit 3
export const migrationFlows = [
  { from: { lat: 35.0354, lng: 9.4839 }, to: { lat: 36.8065, lng: 10.1815 }, label: "من سيدي بوزيد إلى تونس" },
  { from: { lat: 35.1676, lng: 8.8365 }, to: { lat: 35.8254, lng: 10.6084 }, label: "من القصرين إلى سوسة" },
  { from: { lat: 34.425, lng: 8.7842 }, to: { lat: 34.7406, lng: 10.7603 }, label: "من قفصة إلى صفاقس" },
  { from: { lat: 36.1742, lng: 8.7049 }, to: { lat: 36.8065, lng: 10.1815 }, label: "من الكاف إلى تونس" },
  { from: { lat: 36.5011, lng: 8.7803 }, to: { lat: 37.2744, lng: 9.8739 }, label: "من جندوبة إلى بنزرت" },
]

// Colors for different map types
export const densityColors = {
  very_high: "#DC2626", // red
  high: "#22C55E",      // green
  medium: "#F59E0B",    // orange
  low: "#FACC15"        // yellow
}

export const climateColors = {
  humid: "#7C3AED",     // purple
  semi_arid: "#38BDF8", // light blue
  arid: "#F59E0B"       // orange/yellow
}

export const migrationColors = {
  positive: "#EC4899",  // pink
  negative: "#38BDF8"   // blue
}

// Fun facts for kids
export const climateFacts: Record<string, string[]> = {
  humid: [
    "في الشمال الغربي تهطل أمطار كثيرة تصل إلى 1000 مم سنويا!",
    "المناخ الرطب يساعد على نمو الغابات الكثيفة",
    "تنمو هنا أشجار الفلين والصنوبر"
  ],
  semi_arid: [
    "معظم سكان تونس يعيشون في هذه المنطقة",
    "تهطل أمطار معتدلة بين 200 و400 مم سنويا",
    "مناخ مناسب لزراعة الزيتون والحبوب"
  ],
  arid: [
    "الصحراء الكبرى تغطي جنوب تونس",
    "الأمطار نادرة جدا وأقل من 100 مم سنويا",
    "الواحات هي مصدر الحياة في الصحراء"
  ]
}

export const densityFacts: Record<string, string[]> = {
  very_high: [
    "أكثر من 500 ساكن في الكيلومتر المربع!",
    "المدن الكبرى مزدحمة جدا",
    "توجد هنا أغلب المصانع والشركات"
  ],
  high: [
    "بين 100 و500 ساكن في الكيلومتر المربع",
    "مدن متوسطة الحجم",
    "توفر فرص عمل كثيرة"
  ],
  medium: [
    "بين 40 و100 ساكن في الكيلومتر المربع",
    "مزيج من المدن الصغيرة والأرياف",
    "الفلاحة هي النشاط الرئيسي"
  ],
  low: [
    "أقل من 40 ساكن في الكيلومتر المربع",
    "مناطق ريفية واسعة",
    "يهاجر السكان نحو المدن بحثا عن العمل"
  ]
}

export const migrationFacts = {
  positive: [
    "تستقطب هذه المنطقة المهاجرين من الداخل",
    "توفر فرص عمل ومستوى معيشة أفضل",
    "تتوسع المدن باستمرار"
  ],
  negative: [
    "يغادر السكان هذه المنطقة بحثا عن فرص أفضل",
    "نقص في الخدمات والبنية التحتية",
    "الشباب يهاجرون نحو الساحل والعاصمة"
  ]
}
