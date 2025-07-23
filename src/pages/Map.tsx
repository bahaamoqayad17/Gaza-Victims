import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center justify-between flex-1">
              <h1 className="text-xl font-bold">Interactive Map</h1>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Map Content */}
      <div className="container mx-auto px-4 py-8">
        <InteractiveMap />
      </div>
      
      <Footer />
    </div>
  );
};

export default Map;