import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Map Content */}
      <div className="container mx-auto px-4 py-8">
        <InteractiveMap />
      </div>
      
      <Footer />
    </div>
  );
};

export default Map;