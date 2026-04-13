/**
 * Projection GeoJSON → SVG (equirectangular sur les bornes de la Tunisie).
 * Pas de dépendance externe : suffisant pour un rendu pédagogique net.
 */

export interface LngLatBounds {
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
}

export type ProjectFn = (lng: number, lat: number) => readonly [number, number]

export function expandBounds(bounds: LngLatBounds, padRatio: number): LngLatBounds {
  const dLng = (bounds.maxLng - bounds.minLng) * padRatio
  const dLat = (bounds.maxLat - bounds.minLat) * padRatio
  return {
    minLng: bounds.minLng - dLng,
    maxLng: bounds.maxLng + dLng,
    minLat: bounds.minLat - dLat,
    maxLat: bounds.maxLat + dLat,
  }
}

export function makeProjector(
  bounds: LngLatBounds,
  width: number,
  height: number,
  padRatio = 0.02
): ProjectFn {
  const b = expandBounds(bounds, padRatio)
  const spanLng = b.maxLng - b.minLng
  const spanLat = b.maxLat - b.minLat
  return (lng: number, lat: number) => {
    const x = ((lng - b.minLng) / spanLng) * width
    const y = height - ((lat - b.minLat) / spanLat) * height
    return [x, y] as const
  }
}

function ringToPath(ring: number[][], project: ProjectFn): string {
  if (ring.length < 2) return ""
  const [x0, y0] = project(ring[0][0], ring[0][1])
  let d = `M ${x0} ${y0}`
  for (let i = 1; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1])
    d += ` L ${x} ${y}`
  }
  d += " Z"
  return d
}

/** Polygon ou MultiPolygon GeoJSON → attribut d d’un seul <path> (fill-rule evenodd). */
export function geometryToSvgPath(
  geometry: { type: string; coordinates: unknown },
  project: ProjectFn
): string {
  if (geometry.type === "Polygon") {
    const coords = geometry.coordinates as number[][][]
    const parts = coords.map((ring) => ringToPath(ring, project)).filter(Boolean)
    return parts.join(" ")
  }
  if (geometry.type === "MultiPolygon") {
    const multi = geometry.coordinates as number[][][][]
    const parts: string[] = []
    for (const poly of multi) {
      for (const ring of poly) {
        const p = ringToPath(ring, project)
        if (p) parts.push(p)
      }
    }
    return parts.join(" ")
  }
  return ""
}

export function boundsFromGeoJsonFeatures(
  features: Array<{ geometry: { type: string; coordinates: unknown } }>
): LngLatBounds {
  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  function considerCoord(lng: number, lat: number) {
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
  }

  function walkRing(ring: number[][]) {
    for (const c of ring) {
      if (c.length >= 2) considerCoord(c[0], c[1])
    }
  }

  function walkPolygon(coords: number[][][]) {
    for (const ring of coords) walkRing(ring)
  }

  for (const f of features) {
    const g = f.geometry
    if (!g || !g.coordinates) continue
    if (g.type === "Polygon") walkPolygon(g.coordinates as number[][][])
    else if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates as number[][][][]) walkPolygon(poly)
    }
  }

  if (!Number.isFinite(minLng)) {
    return { minLng: 7.5, maxLng: 11.7, minLat: 30.2, maxLat: 37.5 }
  }
  return { minLng, maxLng, minLat, maxLat }
}
