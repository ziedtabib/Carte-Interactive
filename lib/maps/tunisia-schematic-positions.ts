/**
 * Schematic ellipse positions for each governorate in normalized SVG space (viewBox 0 0 100 150).
 * Approximate layout: north → south, not geographic survey accuracy — for education & click targets.
 */
export interface SchematicRegionShape {
  id: string
  cx: number
  cy: number
  rx: number
  ry: number
}

export const TUNISIA_SCHEMATIC_REGIONS: SchematicRegionShape[] = [
  { id: "bizerte", cx: 47, cy: 10, rx: 6, ry: 5 },
  { id: "jendouba", cx: 26, cy: 16, rx: 5, ry: 4 },
  { id: "beja", cx: 36, cy: 20, rx: 5, ry: 4 },
  { id: "kef", cx: 20, cy: 26, rx: 5, ry: 5 },
  { id: "siliana", cx: 40, cy: 30, rx: 4, ry: 4 },
  { id: "tunis", cx: 56, cy: 18, rx: 5, ry: 4 },
  { id: "ariana", cx: 60, cy: 22, rx: 3.5, ry: 3 },
  { id: "ben_arous", cx: 58, cy: 26, rx: 3.5, ry: 3 },
  { id: "manouba", cx: 52, cy: 24, rx: 3.5, ry: 3 },
  { id: "nabeul", cx: 72, cy: 20, rx: 5, ry: 4 },
  { id: "zaghouan", cx: 64, cy: 28, rx: 4, ry: 3 },
  { id: "sousse", cx: 68, cy: 40, rx: 5, ry: 4 },
  { id: "monastir", cx: 74, cy: 46, rx: 4, ry: 3.5 },
  { id: "mahdia", cx: 78, cy: 54, rx: 4, ry: 4 },
  { id: "kairouan", cx: 54, cy: 44, rx: 6, ry: 5 },
  { id: "kasserine", cx: 36, cy: 48, rx: 5, ry: 5 },
  { id: "sidi_bouzid", cx: 46, cy: 56, rx: 5, ry: 5 },
  { id: "sfax", cx: 64, cy: 66, rx: 6, ry: 5 },
  { id: "gafsa", cx: 34, cy: 74, rx: 6, ry: 6 },
  { id: "gabes", cx: 56, cy: 86, rx: 5, ry: 5 },
  { id: "tozeur", cx: 20, cy: 92, rx: 5, ry: 5 },
  { id: "kebili", cx: 30, cy: 102, rx: 6, ry: 6 },
  { id: "medenine", cx: 68, cy: 98, rx: 5, ry: 5 },
  { id: "tataouine", cx: 60, cy: 118, rx: 6, ry: 6 },
]
