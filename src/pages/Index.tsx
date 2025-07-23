import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Users, HelpCircle, ChevronDown, Clock, Menu } from "lucide-react";
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
    deathDetails: "Sarah was killed during a targeted bombing of her school. She had stayed late to prepare lessons for the next day when the attack occurred. Security cameras showed she tried to reach the shelter but didn't make it in time.",
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop"
    ]
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
    deathDetails: "Ahmed was caught in a missile strike while delivering aid to a residential building. Witnesses report he was helping evacuate elderly residents when the second wave of attacks hit the area.",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=300&fit=crop"
    ]
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
    deathDetails: "Maria died when artillery shells hit the hospital where she worked. She was in the intensive care unit attending to critical patients when the attack began. She refused to leave her patients behind.",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1452378174528-3024x3024?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop"
    ]
  }
];

const timelineData = [
  { year: "2023", months: [
    { name: "Oct", cases: 23 }, 
    { name: "Sep", cases: 31 }, 
    { name: "Aug", cases: 18 }, 
    { name: "Jul", cases: 27 }
  ]},
  { year: "2022", months: [
    { name: "Dec", cases: 15 }, 
    { name: "Nov", cases: 22 }, 
    { name: "Oct", cases: 29 }, 
    { name: "Sep", cases: 34 }
  ]},
  { year: "2021", months: [
    { name: "Dec", cases: 12 }, 
    { name: "Nov", cases: 19 }
  ]}
];

const Index = () => {
  const [expandedVictim, setExpandedVictim] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h1 className="text-xl md:text-2xl font-bold">Archive</h1>
            </div>
            <nav className="flex gap-4 md:gap-6">
              <Link to="/browse" className="text-xs md:text-sm hover:underline">Browse</Link>
              <Link to="/map" className="text-xs md:text-sm hover:underline">Map</Link>
              <Link to="/upload" className="text-xs md:text-sm hover:underline">Document</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 
          fixed md:relative 
          z-50 md:z-auto
          w-64 md:w-48 lg:w-56 
          border-r bg-background md:bg-muted/20 
          min-h-screen 
          transition-transform duration-300 ease-in-out
        `}>
          <div className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm md:text-base lg:text-lg font-semibold">Timeline</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-2">
              {timelineData.map((yearData) => (
                <Collapsible key={yearData.year}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:bg-muted/50 p-2 rounded">
                    <span className="font-medium text-sm lg:text-base">{yearData.year}</span>
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-2 lg:pl-4 space-y-1">
                    {yearData.months.map((month) => (
                      <button
                        key={month.name}
                        className="flex w-full items-center justify-between text-left text-xs lg:text-sm text-muted-foreground hover:text-foreground p-1 hover:bg-muted/30 rounded"
                      >
                        <span>{month.name}</span>
                        <span className="text-xs">({month.cases})</span>
                      </button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <section className="py-8 md:py-16 border-b">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">Victims Archive</h2>
              <p className="text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto text-sm md:text-base">
                Documenting lives lost to preserve memory and seek accountability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="sm" className="md:size-default">
                  <Link to="/upload">Submit Documentation</Link>
                </Button>
                <Button variant="outline" asChild size="sm" className="md:size-default">
                  <Link to="/browse">Browse Records</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Recent Cases */}
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Recent Documentation</h3>
              
              <TooltipProvider>
                <Carousel className="max-w-5xl mx-auto">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {recentCases.map((victim) => (
                      <CarouselItem key={victim.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className="hover:shadow-lg transition-shadow mx-auto max-w-sm">
                          <CardContent className="p-3 md:p-4 lg:p-6">
                          {/* Photo carousel */}
                          <div className="mb-3 md:mb-4">
                            <Carousel className="w-full">
                              <CarouselContent>
                                {victim.images.map((image, index) => (
                                  <CarouselItem key={index}>
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-muted border rounded">
                                      <img 
                                        src={image} 
                                        alt={`${victim.name} - Photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="left-1 h-6 w-6 md:left-2 md:h-8 md:w-8" />
                              <CarouselNext className="right-1 h-6 w-6 md:right-2 md:h-8 md:w-8" />
                            </Carousel>
                          </div>
                        
                          {/* Victim info */}
                          <div className="text-center space-y-2 md:space-y-3">
                            <div>
                              <h4 className="text-base md:text-lg font-semibold">{victim.name}</h4>
                              <p className="text-xs md:text-sm text-muted-foreground">Age {victim.age}</p>
                            </div>
                            
                            <div className="space-y-1 md:space-y-2">
                              <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{victim.location}</span>
                              </div>
                              <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span className="truncate">{victim.date}</span>
                              </div>
                            </div>

                            {/* Cause of death */}
                            <div className="text-xs md:text-sm">
                              <span className="text-muted-foreground">Cause:</span> <span className="break-words">{victim.causeOfDeath}</span>
                            </div>

                            {/* Action taken with tooltip */}
                            <div className="flex items-center justify-center gap-1 text-xs md:text-sm">
                              <span className="text-muted-foreground">Action taken:</span>
                              <span className="break-words">{victim.actionTaken}</span>
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

                            {/* Life story and death details */}
                            <div className="space-y-2">
                              <Collapsible 
                                open={expandedVictim === victim.id}
                                onOpenChange={(open) => setExpandedVictim(open ? victim.id : null)}
                              >
                                <CollapsibleTrigger className="text-xs text-primary hover:underline">
                                  {expandedVictim === victim.id ? 'Hide details' : 'Who were they?'}
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-2 md:mt-3 space-y-2 md:space-y-3 text-xs leading-relaxed border-t pt-2 md:pt-3">
                                  <div>
                                    <h5 className="font-medium text-foreground mb-1">Who were they?</h5>
                                    <p className="text-muted-foreground text-left">{victim.lifeStory}</p>
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-foreground mb-1">How did they die?</h5>
                                    <p className="text-muted-foreground text-left">{victim.deathDetails}</p>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </TooltipProvider>
            </div>
          </section>
        </main>
      </div>

      {/* Statistics */}
      <section className="py-8 md:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div>
              <div className="text-xl md:text-3xl font-bold mb-1 md:mb-2">1,247</div>
              <div className="text-xs md:text-sm text-muted-foreground">Cases Documented</div>
            </div>
            <div>
              <div className="text-xl md:text-3xl font-bold mb-1 md:mb-2">89</div>
              <div className="text-xs md:text-sm text-muted-foreground">Locations</div>
            </div>
            <div>
              <div className="text-xl md:text-3xl font-bold mb-1 md:mb-2">156</div>
              <div className="text-xs md:text-sm text-muted-foreground">Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>All submissions are anonymous and encrypted.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;