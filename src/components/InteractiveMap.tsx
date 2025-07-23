import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Minus } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface VictimData {
  id: string;
  name: string;
  location: string;
  date: string;
  lat: number;
  lng: number;
}

const mockVictims: VictimData[] = [
  { id: "001", name: "Sarah M.", location: "Kyiv", date: "2025-07-20", lat: 50.4501, lng: 30.5234 },
  { id: "002", name: "Ahmed K.", location: "Kharkiv", date: "2025-07-19", lat: 49.9935, lng: 36.2304 },
  { id: "003", name: "Maria L.", location: "Mariupol", date: "2025-07-18", lat: 47.0971, lng: 37.5431 },
  { id: "004", name: "David L.", location: "Bucha", date: "2025-07-17", lat: 50.5489, lng: 30.2097 },
  { id: "005", name: "Michael T.", location: "Donetsk", date: "2025-07-16", lat: 48.0159, lng: 37.8028 },
  { id: "006", name: "Elena R.", location: "Lviv", date: "2025-07-15", lat: 49.8397, lng: 24.0297 },
  { id: "007", name: "Petro K.", location: "Odesa", date: "2025-07-14", lat: 46.4825, lng: 30.7233 },
  { id: "008", name: "Oksana V.", location: "Dnipro", date: "2025-07-13", lat: 48.4647, lng: 35.0462 },
];

export const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hoveredVictim, setHoveredVictim] = useState<string | null>(null);
  const [zoom, setZoom] = useState(6);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set mapbox access token - for demo purposes, using a placeholder
    mapboxgl.accessToken = 'your-mapbox-token-here';
    
    // Initialize map centered on Ukraine
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [31.1656, 48.3794], // Center of Ukraine
      zoom: zoom,
      interactive: true
    });

    // Add zoom controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each victim
    const newMarkers: mapboxgl.Marker[] = [];
    mockVictims.forEach((victim) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'relative w-4 h-4 cursor-pointer';
      markerElement.innerHTML = `
        <div class="w-4 h-4 bg-red-500 rounded-full shadow-lg border-2 border-white">
          <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
        </div>
      `;

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([victim.lng, victim.lat])
        .addTo(map.current!);

      // Add hover popup
      const popup = new mapboxgl.Popup({
        offset: 15,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="text-xs">
          <div class="font-semibold">${victim.name}</div>
          <div class="text-gray-600">${victim.location}</div>
          <div class="text-gray-600">${new Date(victim.date).toLocaleDateString()}</div>
        </div>
      `);

      markerElement.addEventListener('mouseenter', () => {
        setHoveredVictim(victim.id);
        marker.setPopup(popup).togglePopup();
      });

      markerElement.addEventListener('mouseleave', () => {
        setHoveredVictim(null);
        popup.remove();
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Update zoom state when map zoom changes
    map.current.on('zoom', () => {
      if (map.current) {
        setZoom(Math.round(map.current.getZoom()));
      }
    });

    return () => {
      markers.forEach(marker => marker.remove());
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
            <p className="text-sm text-muted-foreground">Interactive Map of Ukraine</p>
            <p className="text-xs text-muted-foreground mt-1">Mapbox integration requires API key</p>
          </div>
        </div>
        
        {/* Mapbox container */}
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Manual zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white rounded shadow-lg">
          <Button size="sm" variant="ghost" onClick={handleZoomIn} className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleZoomOut} className="h-8 w-8 p-0">
            <Minus className="h-4 w-4" />
          </Button>
        </div>

        {/* Map label */}
        <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>Recent Cases - Ukraine ({mockVictims.length} cases)</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;