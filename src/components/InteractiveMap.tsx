import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

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
];

export const InteractiveMap = () => {
  const [hoveredVictim, setHoveredVictim] = useState<string | null>(null);

  return (
    <Card className="w-full h-64 bg-muted/20 relative overflow-hidden">
      <CardContent className="p-4 h-full">
        <div className="relative w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 rounded-lg border-2 border-dashed border-muted-foreground/20">
          {/* Map background pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M50,100 Q100,50 150,100 T250,100 T350,100"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted-foreground"
              />
              <path
                d="M20,150 Q120,120 220,150 T380,150"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-muted-foreground"
              />
            </svg>
          </div>

          {/* Map dots for victims */}
          {mockVictims.map((victim, index) => {
            const x = 20 + (index * 70) + (index % 2 * 30);
            const y = 40 + (index % 3 * 40);
            const isHovered = hoveredVictim === victim.id;

            return (
              <div
                key={victim.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setHoveredVictim(victim.id)}
                onMouseLeave={() => setHoveredVictim(null)}
              >
                {/* Red dot */}
                <div 
                  className={`w-3 h-3 bg-red-500 rounded-full shadow-lg transition-all duration-200 ${
                    isHovered ? 'scale-150 ring-2 ring-red-300' : ''
                  }`}
                >
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-30"></div>
                </div>

                {/* Hover card */}
                {isHovered && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-2 min-w-32 z-10">
                    <div className="text-xs font-semibold">{victim.name}</div>
                    <div className="text-xs text-muted-foreground">{victim.location}</div>
                    <div className="text-xs text-muted-foreground">{new Date(victim.date).toLocaleDateString()}</div>
                    <Badge variant="destructive" className="text-xs mt-1">
                      Victim
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}

          {/* Map label */}
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Recent Cases - Ukraine</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;