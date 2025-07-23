import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, MapPin, ArrowLeft, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

// Mock data
const cases = [
  {
    id: "001",
    name: "Sarah M.",
    age: 28,
    location: "Aleppo, Syria",
    date: "2023-10-15",
    status: "documented",
    causeOfDeath: "Armed Conflict",
    actionTaken: "pending",
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
    location: "Kharkiv, Ukraine",
    date: "2023-09-22",
    status: "verified",
    causeOfDeath: "Civilian Attack",
    actionTaken: "pending",
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
    location: "Mariupol, Ukraine", 
    date: "2023-08-30",
    status: "investigating",
    causeOfDeath: "Siege",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1452378174528-3024x3024?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "004",
    name: "Chen W.",
    age: 25,
    location: "Yangon, Myanmar",
    date: "2023-07-12",
    status: "documented",
    causeOfDeath: "Civil Unrest",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"
    ]
  }
];

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Archive
              </Link>
            </Button>
            <h1 className="text-xl font-bold">Browse Cases</h1>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="documented">Documented</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="age">By Age</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {cases.length} cases found
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/map">
              <MapPin className="w-4 h-4 mr-2" />
              Map View
            </Link>
          </Button>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cases.map((victim) => (
              <Link key={victim.id} to={`/case/${victim.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    {/* Photo carousel */}
                    <div className="mb-4">
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
                        <CarouselPrevious className="left-2 h-6 w-6" />
                        <CarouselNext className="right-2 h-6 w-6" />
                      </Carousel>
                    </div>
                    
                    {/* Victim info */}
                    <div className="text-center space-y-2">
                      <div>
                        <h4 className="text-lg font-semibold">{victim.name}</h4>
                        <p className="text-sm text-muted-foreground">Age {victim.age}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{victim.location}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span className="truncate">{victim.date}</span>
                        </div>
                      </div>

                      {/* Cause of death */}
                      <div className="text-sm">
                        <span className="text-muted-foreground">Cause:</span> <span className="break-words">{victim.causeOfDeath}</span>
                      </div>

                      {/* Action taken with tooltip */}
                      <div className="flex items-center justify-center gap-1 text-sm">
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TooltipProvider>

        {/* Pagination placeholder */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;