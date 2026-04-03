"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Governorate data with simplified paths
const governorates = [
  { id: "tunis", name: "تونس", path: "M180 45 L195 40 L210 45 L215 55 L205 65 L190 60 L180 50 Z", center: { x: 195, y: 52 } },
  { id: "ariana", name: "أريانة", path: "M170 35 L185 30 L195 38 L185 45 L175 42 Z", center: { x: 182, y: 38 } },
  { id: "ben-arous", name: "بن عروس", path: "M185 60 L205 62 L210 72 L195 78 L182 70 Z", center: { x: 195, y: 68 } },
  { id: "manouba", name: "منوبة", path: "M155 40 L175 38 L180 48 L170 55 L155 50 Z", center: { x: 165, y: 46 } },
  { id: "nabeul", name: "نابل", path: "M210 50 L240 45 L250 70 L240 100 L210 90 L205 65 Z", center: { x: 225, y: 70 } },
  { id: "zaghouan", name: "زغوان", path: "M170 55 L190 58 L200 75 L190 90 L165 85 L160 65 Z", center: { x: 178, y: 72 } },
  { id: "bizerte", name: "بنزرت", path: "M150 5 L200 0 L215 20 L205 40 L185 35 L165 35 L145 25 Z", center: { x: 175, y: 22 } },
  { id: "beja", name: "باجة", path: "M100 25 L150 20 L160 35 L155 55 L130 60 L105 50 L95 35 Z", center: { x: 128, y: 40 } },
  { id: "jendouba", name: "جندوبة", path: "M45 30 L100 25 L105 50 L90 65 L55 60 L40 45 Z", center: { x: 72, y: 45 } },
  { id: "kef", name: "الكاف", path: "M55 60 L95 55 L110 75 L100 100 L60 95 L45 75 Z", center: { x: 78, y: 78 } },
  { id: "siliana", name: "سليانة", path: "M100 55 L140 52 L155 70 L150 95 L120 100 L100 85 Z", center: { x: 125, y: 75 } },
  { id: "sousse", name: "سوسة", path: "M200 90 L230 85 L240 105 L225 120 L200 115 Z", center: { x: 215, y: 102 } },
  { id: "monastir", name: "المنستير", path: "M215 115 L240 110 L250 125 L235 135 L215 125 Z", center: { x: 230, y: 122 } },
  { id: "mahdia", name: "المهدية", path: "M200 125 L235 120 L250 145 L235 175 L200 165 Z", center: { x: 220, y: 145 } },
  { id: "kairouan", name: "القيروان", path: "M140 80 L195 75 L210 95 L200 130 L165 140 L135 120 L130 95 Z", center: { x: 165, y: 105 } },
  { id: "kasserine", name: "القصرين", path: "M50 90 L100 85 L120 110 L115 150 L70 155 L40 130 Z", center: { x: 82, y: 120 } },
  { id: "sidi-bouzid", name: "سيدي بوزيد", path: "M100 110 L155 105 L175 135 L170 175 L120 180 L95 150 Z", center: { x: 135, y: 142 } },
  { id: "sfax", name: "صفاقس", path: "M165 140 L210 130 L235 160 L230 210 L180 220 L155 185 Z", center: { x: 192, y: 175 } },
  { id: "gafsa", name: "قفصة", path: "M40 145 L95 140 L115 175 L100 220 L50 225 L25 190 Z", center: { x: 70, y: 182 } },
  { id: "tozeur", name: "توزر", path: "M10 200 L50 195 L70 230 L55 270 L15 265 L5 235 Z", center: { x: 35, y: 235 } },
  { id: "kebili", name: "قبلي", path: "M55 225 L115 215 L135 260 L110 310 L55 300 L45 260 Z", center: { x: 85, y: 262 } },
  { id: "gabes", name: "قابس", path: "M150 185 L200 175 L225 215 L200 250 L150 245 L140 210 Z", center: { x: 175, y: 215 } },
  { id: "medenine", name: "مدنين", path: "M155 250 L215 240 L245 280 L235 330 L180 340 L145 300 Z", center: { x: 192, y: 290 } },
  { id: "tataouine", name: "تطاوين", path: "M120 300 L185 290 L210 340 L190 420 L120 430 L90 370 Z", center: { x: 150, y: 365 } },
]

// Density data for each governorate
const densityData: Record<string, { density: string; population: string; category: string }> = {
  "tunis": { density: "أكثر من 500", population: "1,056,000", category: "very-high" },
  "ariana": { density: "100-500", population: "576,000", category: "high" },
  "ben-arous": { density: "100-500", population: "631,000", category: "high" },
  "manouba": { density: "100-500", population: "379,000", category: "high" },
  "nabeul": { density: "100-500", population: "787,000", category: "high" },
  "zaghouan": { density: "40-100", population: "176,000", category: "medium" },
  "bizerte": { density: "100-500", population: "568,000", category: "high" },
  "beja": { density: "40-100", population: "303,000", category: "medium" },
  "jendouba": { density: "40-100", population: "401,000", category: "medium" },
  "kef": { density: "40-100", population: "243,000", category: "medium" },
  "siliana": { density: "40-100", population: "223,000", category: "medium" },
  "sousse": { density: "100-500", population: "674,000", category: "high" },
  "monastir": { density: "100-500", population: "548,000", category: "high" },
  "mahdia": { density: "100-500", population: "410,000", category: "high" },
  "kairouan": { density: "40-100", population: "570,000", category: "medium" },
  "kasserine": { density: "40-100", population: "439,000", category: "medium" },
  "sidi-bouzid": { density: "40-100", population: "429,000", category: "medium" },
  "sfax": { density: "100-500", population: "955,000", category: "high" },
  "gafsa": { density: "أقل من 40", population: "337,000", category: "low" },
  "tozeur": { density: "أقل من 40", population: "107,000", category: "low" },
  "kebili": { density: "أقل من 40", population: "156,000", category: "low" },
  "gabes": { density: "40-100", population: "374,000", category: "medium" },
  "medenine": { density: "أقل من 40", population: "479,000", category: "low" },
  "tataouine": { density: "أقل من 40", population: "149,000", category: "low" },
}

const categoryColors: Record<string, string> = {
  "very-high": "#dc2626", // red
  "high": "#16a34a", // green
  "medium": "#eab308", // yellow
  "low": "#f97316", // orange
}

interface TunisiaMapProps {
  highlightCategory?: string
  onGovernorateClick?: (id: string, name: string, data: typeof densityData[string]) => void
}

export function TunisiaMap({ highlightCategory, onGovernorateClick }: TunisiaMapProps) {
  const [hoveredGov, setHoveredGov] = useState<string | null>(null)

  const getGovernorateColor = (id: string) => {
    const data = densityData[id]
    if (!data) return "#e5e7eb"
    
    const baseColor = categoryColors[data.category]
    
    if (highlightCategory && highlightCategory !== data.category) {
      return "#e5e7eb" // Gray out non-matching
    }
    
    return baseColor
  }

  const getStrokeWidth = (id: string) => {
    if (hoveredGov === id) return 3
    if (highlightCategory && densityData[id]?.category === highlightCategory) return 2
    return 1
  }

  return (
    <div className="relative w-full h-full">
      <svg 
        viewBox="0 0 260 450" 
        className="w-full h-full drop-shadow-lg"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="260" height="450" fill="#e0f2fe" rx="10" />
        
        {/* Mediterranean Sea label */}
        <text x="245" y="30" fontSize="8" fill="#0ea5e9" fontWeight="bold" textAnchor="end">
          البحر الأبيض المتوسط
        </text>
        
        {/* Governorates */}
        {governorates.map((gov) => {
          const isHighlighted = highlightCategory ? densityData[gov.id]?.category === highlightCategory : true
          const isHovered = hoveredGov === gov.id
          
          return (
            <g key={gov.id}>
              <path
                d={gov.path}
                fill={getGovernorateColor(gov.id)}
                stroke={isHovered ? "#1e40af" : "#374151"}
                strokeWidth={getStrokeWidth(gov.id)}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  isHighlighted && "hover:brightness-110",
                  !isHighlighted && "opacity-40"
                )}
                style={{
                  filter: isHovered ? "brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : undefined,
                  transform: isHovered ? "scale(1.02)" : undefined,
                  transformOrigin: `${gov.center.x}px ${gov.center.y}px`
                }}
                onMouseEnter={() => setHoveredGov(gov.id)}
                onMouseLeave={() => setHoveredGov(null)}
                onClick={() => onGovernorateClick?.(gov.id, gov.name, densityData[gov.id])}
              />
              {/* Governorate name (show on hover or always for larger ones) */}
              {isHovered && (
                <text
                  x={gov.center.x}
                  y={gov.center.y}
                  fontSize="8"
                  fill="#1f2937"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none"
                  style={{ textShadow: "0 0 3px white, 0 0 3px white" }}
                >
                  {gov.name}
                </text>
              )}
            </g>
          )
        })}
        
        {/* Scale bar */}
        <g transform="translate(20, 420)">
          <line x1="0" y1="0" x2="50" y2="0" stroke="#374151" strokeWidth="2" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="2" />
          <line x1="50" y1="-3" x2="50" y2="3" stroke="#374151" strokeWidth="2" />
          <text x="25" y="12" fontSize="7" fill="#374151" textAnchor="middle">50 كم</text>
        </g>
        
        {/* North arrow */}
        <g transform="translate(230, 400)">
          <polygon points="0,15 5,0 10,15 5,12" fill="#374151" />
          <text x="5" y="22" fontSize="8" fill="#374151" textAnchor="middle">N</text>
        </g>
      </svg>
      
      {/* Hover tooltip */}
      {hoveredGov && (
        <div className="absolute top-4 left-4 bg-white rounded-xl p-3 shadow-lg border-2 border-primary/20 animate-fade-in z-10">
          <p className="font-bold text-foreground">{governorates.find(g => g.id === hoveredGov)?.name}</p>
          <p className="text-sm text-muted-foreground">
            الكثافة: {densityData[hoveredGov]?.density} ن/كم²
          </p>
        </div>
      )}
    </div>
  )
}
