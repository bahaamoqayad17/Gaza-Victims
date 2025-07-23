import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Mock victim data for demonstration
const recentCases = [
  {
    id: "001",
    name: "Sarah M.",
    age: 28,
    location: "Aleppo",
    date: "2023-10-15",
    status: "documented",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: "002", 
    name: "Ahmed K.",
    age: 34,
    location: "Kharkiv",
    date: "2023-09-22",
    status: "verified",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: "003",
    name: "Maria L.",
    age: 42,
    location: "Mariupol", 
    date: "2023-08-30",
    status: "investigating",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Archive</h1>
            <nav className="flex gap-6">
              <Link to="/browse" className="text-sm hover:underline">Browse</Link>
              <Link to="/map" className="text-sm hover:underline">Map</Link>
              <Link to="/upload" className="text-sm hover:underline">Document</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Victims Archive</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Documenting lives lost to preserve memory and seek accountability.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link to="/upload">Submit Documentation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/browse">Browse Records</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-8 text-center">Recent Documentation</h3>
          
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {recentCases.map((victim) => (
                <CarouselItem key={victim.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                        <img 
                          src={victim.imageUrl} 
                          alt={`${victim.name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardTitle className="text-lg">{victim.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Age {victim.age}</p>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {victim.location}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {victim.date}
                      </div>
                      <Badge 
                        variant={victim.status === 'verified' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {victim.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1,247</div>
              <div className="text-sm text-muted-foreground">Cases Documented</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">89</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">156</div>
              <div className="text-sm text-muted-foreground">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>All submissions are anonymous and encrypted.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;