import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';

// Mock case locations
const caseLocations = [
  { id: '001', name: 'Sarah M.', coordinates: [36.2016, 36.1611], location: 'Aleppo, Syria' },
  { id: '002', name: 'Ahmed K.', coordinates: [36.2527, 49.9935], location: 'Kharkiv, Ukraine' },
  { id: '003', name: 'Maria L.', coordinates: [37.5407, 47.0956], location: 'Mariupol, Ukraine' },
  { id: '004', name: 'Chen W.', coordinates: [96.1561, 16.8409], location: 'Yangon, Myanmar' },
  { id: '005', name: 'Elena R.', coordinates: [36.2765, 33.5138], location: 'Damascus, Syria' },
  { id: '006', name: 'David L.', coordinates: [30.2525, 50.5077], location: 'Bucha, Ukraine' },
  { id: '007', name: 'Fatima A.', coordinates: [34.4669, 31.5017], location: 'Gaza' },
  { id: '008', name: 'Michael T.', coordinates: [37.8022, 48.0159], location: 'Donetsk, Ukraine' },
  { id: '009', name: 'Amira H.', coordinates: [69.2075, 34.5553], location: 'Kabul, Afghanistan' },
  { id: '010', name: 'Carlos M.', coordinates: [-66.8792, 10.4696], location: 'Caracas, Venezuela' }
];

const InteractiveMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenEntered, setTokenEntered] = useState(false);
  const [selectedCase, setSelectedCase] = useState<typeof caseLocations[0] | null>(null);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe' as any,
        zoom: 1.5,
        center: [30, 15],
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add markers for each case
      caseLocations.forEach((caseItem) => {
        const el = document.createElement('div');
        el.className = 'case-marker';
        el.style.cssText = `
          background-color: hsl(var(--destructive));
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.5)';
          el.style.zIndex = '1000';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.zIndex = 'auto';
        });

        el.addEventListener('click', () => {
          setSelectedCase(caseItem);
        });

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(
          `<div class="p-2">
            <h3 class="font-semibold">${caseItem.name}</h3>
            <p class="text-sm text-gray-600">${caseItem.location}</p>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat(caseItem.coordinates as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      });

      // Gentle rotation
      const secondsPerRevolution = 300;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('dragstart', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
      map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
      map.current.on('moveend', () => { spinGlobe(); });

      spinGlobe();
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    if (tokenEntered && mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      map.current?.remove();
    };
  }, [tokenEntered, mapboxToken]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setTokenEntered(true);
    }
  };

  if (!tokenEntered) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Interactive Map Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Mapbox Token Required</p>
              <p>To view the interactive map, please enter your Mapbox public token. You can get one from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a> after creating an account.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="mapbox-token" className="text-sm font-medium">
              Mapbox Public Token
            </label>
            <div className="flex gap-2">
              <Input
                id="mapbox-token"
                type="password"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="font-mono text-xs"
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                Load Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Case Locations ({caseLocations.length} documented)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <div ref={mapContainer} className="absolute inset-0" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Click on markers to view case details. Globe rotates automatically when not interacting.
          </p>
        </CardContent>
      </Card>

      {selectedCase && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Case</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{selectedCase.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedCase.location}</p>
              <Button variant="outline" size="sm" asChild>
                <a href={`/case/${selectedCase.id}`}>View Full Case Details</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;