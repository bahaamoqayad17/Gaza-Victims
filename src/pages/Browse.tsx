import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, MapPin, ArrowLeft, HelpCircle, Download, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";

// Mock data - expanded to 10 victims
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
      "https://images.unsplash.com/photo-1535268647677-300dbf3078d1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=300&fit=crop&crop=face"
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
  },
  {
    id: "005",
    name: "Elena R.",
    age: 31,
    location: "Damascus, Syria",
    date: "2023-06-18",
    status: "verified",
    causeOfDeath: "Chemical Attack",
    actionTaken: "investigating",
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "006",
    name: "David L.",
    age: 45,
    location: "Bucha, Ukraine",
    date: "2023-05-27",
    status: "documented",
    causeOfDeath: "Execution",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1542190891-2093d38760f2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "007",
    name: "Fatima A.",
    age: 19,
    location: "Gaza, Palestine",
    date: "2023-04-14",
    status: "investigating",
    causeOfDeath: "Airstrike",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "008",
    name: "Michael T.",
    age: 38,
    location: "Donetsk, Ukraine",
    date: "2023-03-09",
    status: "verified",
    causeOfDeath: "Landmine",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "009",
    name: "Amira H.",
    age: 26,
    location: "Kabul, Afghanistan",
    date: "2023-02-22",
    status: "documented",
    causeOfDeath: "Targeted Killing",
    actionTaken: "investigating",
    images: [
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop"
    ]
  },
  {
    id: "010",
    name: "Carlos M.",
    age: 52,
    location: "Caracas, Venezuela",
    date: "2023-01-15",
    status: "verified",
    causeOfDeath: "Police Brutality",
    actionTaken: "pending",
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=300&fit=crop"
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
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Archive
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl font-bold truncate">Browse Cases</h1>
            </div>
            <LanguageSelector />
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/download">
                <Download className="w-4 h-4 mr-2" />
                Download Archive
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/map">
                <MapPin className="w-4 h-4 mr-2" />
                Map View
              </Link>
            </Button>
          </div>
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
                        {victim.actionTaken === 'pending' && (
                          <span className="text-red-500 text-xs ml-1">
                            for {Math.floor((new Date().getTime() - new Date(victim.date).getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        )}
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">This showcases the legal action taken thus far.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Status badge and report button */}
                      <div className="flex items-center justify-center gap-2">
                        <Badge 
                          variant={victim.status === 'verified' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {victim.status}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                          <Link to="/report">
                            <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          </Link>
                        </Button>
                      </div>
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
      
      <Footer />
    </div>
  );
};

export default Browse;