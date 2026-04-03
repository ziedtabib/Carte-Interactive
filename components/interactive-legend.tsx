"use client"

import { playSoundSimple } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface LegendItem {
  id: string
  label: string
  color: string
  description?: string
}

interface InteractiveLegendProps {
  title: string
  items: LegendItem[]
  selectedItem: string | null
  onItemClick: (id: string | null) => void
}

export function InteractiveLegend({ title, items, selectedItem, onItemClick }: InteractiveLegendProps) {
  const handleClick = (id: string) => {
    playSoundSimple("pop", 0.3)
    onItemClick(selectedItem === id ? null : id)
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border-2 border-primary/20 p-4 h-full">
      <h3 className="text-xl font-bold text-primary mb-4 text-center border-b-2 border-primary/20 pb-2">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        اضغط على أي لون لتصفيته على الخريطة
      </p>
      <div className="space-y-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
              "hover:scale-102 hover:shadow-md",
              "border-2",
              selectedItem === item.id 
                ? "border-primary bg-primary/10 shadow-md scale-102" 
                : "border-transparent bg-muted/50 hover:bg-muted"
            )}
          >
            <div 
              className={cn(
                "w-8 h-8 rounded-lg border-2 border-foreground/20 shadow-inner transition-transform",
                selectedItem === item.id && "scale-110 ring-2 ring-primary ring-offset-2"
              )}
              style={{ backgroundColor: item.color }}
            />
            <div className="text-right flex-1">
              <span className={cn(
                "font-semibold text-base block",
                selectedItem === item.id ? "text-primary" : "text-foreground"
              )}>
                {item.label}
              </span>
              {item.description && (
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              )}
            </div>
            {selectedItem === item.id && (
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                مُفعّل
              </span>
            )}
          </button>
        ))}
      </div>
      
      {selectedItem && (
        <button
          onClick={() => {
            playSoundSimple("click", 0.3)
            onItemClick(null)
          }}
          className="w-full mt-4 py-2 px-4 bg-muted hover:bg-muted/80 rounded-xl text-muted-foreground text-sm transition-colors"
        >
          إظهار الكل
        </button>
      )}
    </div>
  )
}
