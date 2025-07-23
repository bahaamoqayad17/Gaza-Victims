import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Users, HelpCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock victim data for demonstration
const recentCases = [
  {
    id: "001",
    name: "Sarah M.",
    age: 28,
    location: "Aleppo",
    date: "2023-10-15",
    status: "documented",
    causeOfDeath: "Armed conflict",
    actionTaken: "pending",
    lifeStory: "Sarah was a dedicated teacher who loved working with children. Her colleagues remember her infectious laughter and her dream of opening a school for underprivileged kids. 'She believed every child deserved a chance to learn,' her sister recalls.",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=300&fit=crop&crop=face"
  },
  {
    id: "002", 
    name: "Ahmed K.",
    age: 34,
    location: "Kharkiv",
    date: "2023-09-22",
    status: "verified",
    causeOfDeath: "Bombing",
    actionTaken: "pending",
    lifeStory: "Ahmed was an engineer who spent his weekends volunteering at local shelters. His wife describes him as someone who 'always put others first.' He had been planning to start a family and dreamed of building sustainable housing.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face"
  },
  {
    id: "003",
    name: "Maria L.",
    age: 42,
    location: "Mariupol", 
    date: "2023-08-30",
    status: "investigating",
    causeOfDeath: "Shelling",
    actionTaken: "pending",
    lifeStory: "Maria was a nurse who worked tirelessly during the conflict, often staying beyond her shifts to care for patients. Her daughter remembers her saying, 'Healing is the only way to fight darkness.' She loved gardening and classical music.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face"
  }
];

const timelineData = [
  { year: "2023", months: ["October", "September", "August", "July"] },
  { year: "2022", months: ["December", "November", "October", "September"] },
  { year: "2021", months: ["December", "November"] }
];

const Index = () => {
  const [expandedVictim, setExpandedVictim] = useState<string | null>(null);

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

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/20 min-h-screen">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <div className="space-y-2">
              {timelineData.map((yearData) => (
                <Collapsible key={yearData.year}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:bg-muted/50 p-2 rounded">
                    <span className="font-medium">{yearData.year}</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4 space-y-1">
                    {yearData.months.map((month) => (
                      <button
                        key={month}
                        className="block w-full text-left text-sm text-muted-foreground hover:text-foreground p-1 hover:bg-muted/30 rounded"
                      >
                        {month}
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
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
              
              <TooltipProvider>
                <Carousel className="max-w-5xl mx-auto">
                  <CarouselContent>
                    {recentCases.map((victim) => (
                      <CarouselItem key={victim.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            {/* Large ID-style portrait */}
                            <div className="aspect-[4/3] w-full mb-4 overflow-hidden bg-muted border">
                              <img 
                                src={victim.imageUrl} 
                                alt={`${victim.name}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Victim info */}
                            <div className="text-center space-y-3">
                              <div>
                                <h4 className="text-lg font-semibold">{victim.name}</h4>
                                <p className="text-sm text-muted-foreground">Age {victim.age}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {victim.location}
                                </div>
                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {victim.date}
                                </div>
                              </div>

                              {/* Cause of death */}
                              <div className="text-sm">
                                <span className="text-muted-foreground">Cause:</span> {victim.causeOfDeath}
                              </div>

                              {/* Action taken with tooltip */}
                              <div className="flex items-center justify-center gap-1 text-sm">
                                <span className="text-muted-foreground">Action taken:</span>
                                <span>{victim.actionTaken}</span>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">This showcases the legal action taken thus far.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>

                              {/* Status badge */}
                              <Badge 
                                variant={victim.status === 'verified' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {victim.status}
                              </Badge>

                              {/* Clickable life story */}
                              <Collapsible 
                                open={expandedVictim === victim.id}
                                onOpenChange={(open) => setExpandedVictim(open ? victim.id : null)}
                              >
                                <CollapsibleTrigger className="text-xs text-primary hover:underline">
                                  {expandedVictim === victim.id ? 'Hide story' : 'Read their story'}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-3 text-xs text-muted-foreground leading-relaxed border-t pt-3">
                                  {victim.lifeStory}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </TooltipProvider>
            </div>
          </section>
        </main>
      </div>

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