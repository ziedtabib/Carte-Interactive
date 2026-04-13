"use client"

import { useCallback, useState } from "react"

export interface UseMapSelectionReturn {
  selectedId: string | null
  hoveredId: string | null
  setSelectedId: (id: string | null) => void
  setHoveredId: (id: string | null) => void
  selectOrToggle: (id: string) => void
  clearSelection: () => void
}

/**
 * Shared state for SVG governorate selection (syncs with legend clicks when wired).
 */
export function useMapSelection(initialSelected: string | null = null): UseMapSelectionReturn {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const selectOrToggle = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  return {
    selectedId,
    hoveredId,
    setSelectedId,
    setHoveredId,
    selectOrToggle,
    clearSelection,
  }
}
