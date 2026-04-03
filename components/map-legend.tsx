"use client"

import { cn } from "@/lib/utils"

interface LegendItem {
  id: string
  label: string
  color: string
  description?: string
}

interface MapLegendProps {
  title: string
  items: LegendItem[]
  activeItem: string | null
  onItemClick: (id: string) => void
  className?: string
}

export function MapLegend({ title, items, activeItem, onItemClick, className }: MapLegendProps) {
  return (
    <div className={cn("bg-white rounded-2xl p-4 shadow-lg", className)}>
      <h3 className="text-lg font-bold text-foreground mb-4 text-center border-b pb-2">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id === activeItem ? "" : item.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
              "hover:bg-primary/5 cursor-pointer",
              activeItem === item.id && "bg-primary/10 ring-2 ring-primary shadow-md"
            )}
          >
            <div 
              className={cn(
                "w-6 h-6 rounded-lg shadow-inner flex-shrink-0",
                "transition-transform duration-300",
                activeItem === item.id && "scale-125"
              )}
              style={{ backgroundColor: item.color }}
            />
            <div className="text-right flex-1">
              <span className={cn(
                "text-sm font-medium block",
                activeItem === item.id ? "text-primary" : "text-foreground"
              )}>
                {item.label}
              </span>
              {item.description && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
