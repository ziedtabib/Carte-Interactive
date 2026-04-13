import { governorates, type GovernorateData } from "@/lib/tunisia-geojson"

/**
 * Données de densité : la source de vérité est `governorates` dans `tunisia-geojson.ts`.
 * Exemple de correspondance (extrait) :
 * | id (interne) | catégorie légende |
 * |--------------|-------------------|
 * | tunis        | very-high         |
 * | sfax         | high              |
 * | kairouan     | medium            |
 * | kef          | low               |
 */

/** Identifiants de légende alignés sur les pages (ex. unité 1) : مفتاح الخريطة */
export type DensityLegendCategoryId = "very-high" | "high" | "medium" | "low"

/** Couleurs « comme dans le livre » : rouge, vert, jaune, orange */
export const DENSITY_LEGEND_COLORS: Record<DensityLegendCategoryId, string> = {
  "very-high": "#dc2626",
  high: "#16a34a",
  medium: "#eab308",
  low: "#f97316",
}

export const DENSITY_LEGEND_LABELS_AR: Record<DensityLegendCategoryId, string> = {
  "very-high": "كثافة مرتفعة جداً",
  high: "كثافة مرتفعة",
  medium: "كثافة ضعيفة",
  low: "كثافة ضعيفة جداً",
}

/** Propriété NAME_1 du fichier GADM `gadm41_TUN_1.json` → id interne (snake_case). */
export const GADM_NAME_1_TO_GOVERNORATE_ID: Record<string, string> = {
  Ariana: "ariana",
  Béja: "beja",
  "BenArous(TunisSud)": "ben_arous",
  Bizerte: "bizerte",
  Gabès: "gabes",
  Gafsa: "gafsa",
  Jendouba: "jendouba",
  Kairouan: "kairouan",
  Kassérine: "kasserine",
  Kebili: "kebili",
  LeKef: "kef",
  Mahdia: "mahdia",
  Manubah: "manouba",
  Médenine: "medenine",
  Monastir: "monastir",
  Nabeul: "nabeul",
  Sfax: "sfax",
  SidiBouZid: "sidi_bouzid",
  Siliana: "siliana",
  Sousse: "sousse",
  Tataouine: "tataouine",
  Tozeur: "tozeur",
  Tunis: "tunis",
  Zaghouan: "zaghouan",
}

export function densityToLegendId(d: GovernorateData["density"]): DensityLegendCategoryId {
  return (
    {
      very_high: "very-high",
      high: "high",
      medium: "medium",
      low: "low",
    } as const
  )[d]
}

const govById = Object.fromEntries(governorates.map((g) => [g.id, g])) as Record<string, GovernorateData>

export function getGovernorateById(id: string): GovernorateData | undefined {
  return govById[id]
}

/** Nombre de gouvernorats par catégorie de densité (pour compteur / légende). */
export function countGovernoratesByDensityCategory(): Record<DensityLegendCategoryId, number> {
  const out: Record<DensityLegendCategoryId, number> = {
    "very-high": 0,
    high: 0,
    medium: 0,
    low: 0,
  }
  for (const g of governorates) {
    out[densityToLegendId(g.density)]++
  }
  return out
}
