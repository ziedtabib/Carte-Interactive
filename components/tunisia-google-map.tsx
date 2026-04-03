"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { governorates, majorCities, type GovernorateData } from "@/lib/tunisia-geojson"
import { playSoundSimple } from "@/lib/sounds"
import { Loader2 } from "lucide-react"

type MapType = "density" | "climate" | "migration" | "agriculture"

interface TunisiaGoogleMapProps {
  mapType: MapType
  selectedFilter: string | null
  onGovernorateClick: (governorate: GovernorateData) => void
  showCityMarkers?: boolean
  showMigrationArrows?: boolean
}

const densityColors: Record<string, string> = {
  very_high: "#DC2626",
  high: "#22C55E", 
  medium: "#F59E0B",
  low: "#FACC15"
}

const climateColors: Record<string, string> = {
  humid: "#7C3AED",
  semi_arid: "#38BDF8",
  arid: "#F59E0B"
}

const migrationColors: Record<string, string> = {
  positive: "#EC4899",
  negative: "#38BDF8"
}

export function TunisiaGoogleMap({
  mapType,
  selectedFilter,
  onGovernorateClick,
  showCityMarkers = false,
  showMigrationArrows = false
}: TunisiaGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const circlesRef = useRef<google.maps.Circle[]>([])
  const polylinesRef = useRef<google.maps.Polyline[]>([])

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places", "geometry"]
        })

        const google = await loader.load()
        
        if (!mapRef.current) return

        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 34.0, lng: 9.5 },
          zoom: 6.5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#333333" }]
            },
            {
              featureType: "water",
              elementType: "geometry.fill",
              stylers: [{ color: "#a8d5e5" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry.fill", 
              stylers: [{ color: "#f5f5dc" }]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#666666" }, { weight: 2 }]
            }
          ]
        })

        setMap(mapInstance)
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("تعذر تحميل الخريطة")
        setIsLoading(false)
      }
    }

    initMap()
  }, [])

  // Get color based on map type and governorate data
  const getColor = useCallback((gov: GovernorateData): string => {
    switch (mapType) {
      case "density":
        return densityColors[gov.density] || "#cccccc"
      case "climate":
        return climateColors[gov.climate] || "#cccccc"
      case "migration":
        return migrationColors[gov.migration] || "#cccccc"
      default:
        return "#cccccc"
    }
  }, [mapType])

  // Check if governorate matches filter
  const matchesFilter = useCallback((gov: GovernorateData): boolean => {
    if (!selectedFilter) return true
    switch (mapType) {
      case "density":
        return gov.density === selectedFilter
      case "climate":
        return gov.climate === selectedFilter
      case "migration":
        return gov.migration === selectedFilter
      default:
        return true
    }
  }, [mapType, selectedFilter])

  // Update map markers/circles when map or settings change
  useEffect(() => {
    if (!map) return

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.setMap(null))
    circlesRef.current.forEach(circle => circle.setMap(null))
    polylinesRef.current.forEach(line => line.setMap(null))
    markersRef.current = []
    circlesRef.current = []
    polylinesRef.current = []

    // Create circles for each governorate
    governorates.forEach(gov => {
      const isHighlighted = matchesFilter(gov)
      const color = getColor(gov)
      
      const circle = new google.maps.Circle({
        center: gov.center,
        radius: gov.density === "very_high" ? 25000 : 
                gov.density === "high" ? 30000 : 
                gov.density === "medium" ? 35000 : 40000,
        fillColor: color,
        fillOpacity: isHighlighted ? 0.6 : 0.2,
        strokeColor: isHighlighted ? color : "#999999",
        strokeWeight: isHighlighted ? 3 : 1,
        map: map,
        clickable: true
      })

      circle.addListener("click", () => {
        playSoundSimple("pop", 0.3)
        onGovernorateClick(gov)
      })

      circle.addListener("mouseover", () => {
        circle.setOptions({ 
          fillOpacity: 0.8,
          strokeWeight: 4 
        })
      })

      circle.addListener("mouseout", () => {
        circle.setOptions({ 
          fillOpacity: isHighlighted ? 0.6 : 0.2,
          strokeWeight: isHighlighted ? 3 : 1
        })
      })

      circlesRef.current.push(circle)

      // Add label marker
      const labelMarker = new google.maps.Marker({
        position: gov.center,
        map: map,
        label: {
          text: gov.nameAr,
          color: "#000000",
          fontSize: "11px",
          fontWeight: "bold"
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0,
        }
      })
      markersRef.current.push(labelMarker)
    })

    // Add city markers if enabled
    if (showCityMarkers) {
      majorCities.forEach(city => {
        const marker = new google.maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: map,
          title: city.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#DC2626",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 8
          }
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="text-align:center;font-family:sans-serif;padding:5px;">
            <strong>${city.name}</strong><br/>
            <span style="color:#666;">${city.population.toLocaleString('ar-TN')} ساكن</span>
          </div>`
        })

        marker.addListener("click", () => {
          playSoundSimple("click", 0.3)
          infoWindow.open(map, marker)
        })

        markersRef.current.push(marker)
      })
    }

    // Add migration arrows if enabled
    if (showMigrationArrows && mapType === "migration") {
      const migrationFlows = [
        { from: { lat: 35.0354, lng: 9.4839 }, to: { lat: 36.8065, lng: 10.1815 } },
        { from: { lat: 35.1676, lng: 8.8365 }, to: { lat: 35.8254, lng: 10.6084 } },
        { from: { lat: 34.425, lng: 8.7842 }, to: { lat: 34.7406, lng: 10.7603 } },
        { from: { lat: 36.1742, lng: 8.7049 }, to: { lat: 36.8065, lng: 10.1815 } },
        { from: { lat: 36.5011, lng: 8.7803 }, to: { lat: 37.2744, lng: 9.8739 } },
      ]

      migrationFlows.forEach(flow => {
        const line = new google.maps.Polyline({
          path: [flow.from, flow.to],
          geodesic: true,
          strokeColor: "#1E40AF",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 4,
              fillColor: "#1E40AF",
              fillOpacity: 1,
              strokeWeight: 1
            },
            offset: "100%"
          }],
          map: map
        })
        polylinesRef.current.push(line)
      })
    }
  }, [map, mapType, selectedFilter, showCityMarkers, showMigrationArrows, getColor, matchesFilter, onGovernorateClick])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
        <div className="text-center p-8">
          <p className="text-destructive text-lg mb-2">{error}</p>
          <p className="text-muted-foreground text-sm">يرجى التأكد من اتصالك بالإنترنت</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-primary/20 shadow-xl">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-foreground">جاري تحميل الخريطة...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
