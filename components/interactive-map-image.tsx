"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface InteractiveMapImageProps {
  src: string
  alt: string
  title: string
  className?: string
  highlightColor?: string
}

export function InteractiveMapImage({ src, alt, title, className, highlightColor }: InteractiveMapImageProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 1))
  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <div className={cn("relative group", className)}>
      {/* Title */}
      <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4 rounded-t-2xl">
        <h3 className="text-white font-bold text-lg text-center">{title}</h3>
      </div>

      {/* Map Container */}
      <div 
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain select-none"
            draggable={false}
            priority
          />
        </div>

        {/* Highlight overlay */}
        {highlightColor && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 transition-opacity duration-300"
            style={{ backgroundColor: highlightColor }}
          />
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Fullscreen Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-14 left-4 h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0">
          <VisuallyHidden>
            <DialogTitle>{title} - عرض كامل</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
