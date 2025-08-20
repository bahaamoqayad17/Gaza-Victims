import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface LocationData {
  lat: number;
  lng: number;
}

interface VictimData {
  id: string;
  name: string;
  location: string;
  date: string;
  lat: number;
  lng: number;
}
interface InteractiveMapProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  enableSelection?: boolean;
  mapData?: {
    locations: Array<{
      lat: string;
      lng: string;
      locationName: string;
      caseCount: number;
      recentCases: Array<{
        _id: string;
        name: string;
        date?: string;
      }>;
    }>;
  };
}

export const InteractiveMap = ({
  onLocationSelect,
  enableSelection = false,
  mapData,
}: InteractiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState(9);
  const currentMarker = useRef<mapboxgl.Marker | null>(null);
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set mapbox access token - for demo purposes, using a placeholder
    mapboxgl.accessToken = import.meta.env.VITE_MAP_ACCESS_KEY || "";

    // Initialize map centered on Ukraine
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [34.3667, 31.4], // Center of Israel
      zoom: zoom,
      interactive: true,
    });

    map.current.on("load", () => {
      console.log("Map loaded");
    });

    map.current.on("click", (e) => {
      if (!enableSelection) return;

      // Remove existing marker if it exists
      if (currentMarker.current) {
        currentMarker.current.remove();
      }

      const marker = new mapboxgl.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map.current!);

      currentMarker.current = marker;

      onLocationSelect({
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      });
    });

    // Add zoom controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for locations with cases
    const locationsToShow = mapData?.locations.map((v) => ({
      lat: v.lat.toString(),
      lng: v.lng.toString(),
      locationName: v.locationName,
      caseCount: v.caseCount,
      recentCases: v.recentCases,
    }));

    locationsToShow.forEach((location, index) => {
      new mapboxgl.Marker()
        .setLngLat([Number(location.lng), Number(location.lat)])
        .addTo(map.current!);
    });

    // Update zoom state when map zoom changes
    map.current.on("zoom", () => {
      if (map.current) {
        setZoom(Math.round(map.current.getZoom()));
      }
    });

    return () => {
      if (currentMarker.current) {
        currentMarker.current.remove();
      }
      map.current?.remove();
    };
  }, []);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  return (
    <Card className="w-full h-96 relative overflow-hidden">
      <CardContent className="p-0 h-full relative">
        {/* Fallback for when Mapbox token is not available */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center p-4">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Interactive Map of Gaza
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mapbox integration requires API key
            </p>
          </div>
        </div>

        {/* Mapbox container */}
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Manual zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white rounded shadow-lg">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Map label */}
        <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>Recent Cases - Gaza ({mapData?.locations?.length} cases)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
