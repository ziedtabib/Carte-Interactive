"use client"

import { useMemo } from "react"
import { flows, migrationRegionsByName } from "@/data/migrationData"

interface MigrationFlowsProps {
  visible: boolean
  /** ID unique du marqueur SVG (évite les collisions si plusieurs cartes) */
  markerId: string
}

export function MigrationFlows({ visible, markerId }: MigrationFlowsProps) {
  const lineData = useMemo(
    () =>
      flows
        .map((f) => {
          const from = migrationRegionsByName[f.from]
          const to = migrationRegionsByName[f.to]
          if (!from || !to) return null
          return { key: `${f.from}-${f.to}`, from: from.center, to: to.center }
        })
        .filter(Boolean) as Array<{ key: string; from: { x: number; y: number }; to: { x: number; y: number } }>,
    []
  )

  const markerUrl = `url(#${markerId})`

  return (
    <g id="flows" visibility={visible ? "visible" : "hidden"} aria-hidden={!visible}>
      <defs>
        <style>{`
          @keyframes tn-flow-dash {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -36; }
          }
          .tn-migration-flow-line {
            animation: tn-flow-dash 1.6s linear infinite;
          }
        `}</style>
        <marker id={markerId} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#0f172a" />
        </marker>
      </defs>

      {lineData.map((line) => (
        <line
          key={line.key}
          x1={line.from.x}
          y1={line.from.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeDasharray="10 8"
          markerEnd={markerUrl}
          className="tn-migration-flow-line"
        />
      ))}
    </g>
  )
}
