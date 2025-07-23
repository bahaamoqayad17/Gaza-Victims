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
import { Header } from "@/components/Header";
import { VictimCard } from "@/components/VictimCard";
import { Footer } from "@/components/Footer";

// Mock data - expanded to 10 victims
const cases = [
    {
      id: "001",
      name: "Sarah M.",
      age: 28,
      gender: "Female",
      location: "Aleppo, Syria",
      date: "2023-10-15",
      status: "documented",
      causeOfDeath: "Armed Conflict",
      actionTaken: "pending",
      verified: false,
      thirdPartyVerified: false,
      newsLink: "https://example.com/news/sarah-m",
      lifeStory: "Sarah was a primary school teacher who dedicated her life to educating children in her community. She was known for her kindness and commitment to her students.",
      deathDetails: "Sarah was killed during a bombing of her residential area. She was in her classroom when the attack occurred.",
      familyRelationship: "left behind her parents and younger sister",
      occupation: "A primary school teacher",
      perpetrator: "Syrian Government Forces",
      images: [
        "/src/assets/sarah-teacher.jpg",
        "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=400&h=300&fit=crop"
      ]
    },
  {
    id: "002", 
    name: "Ahmed K.",
    age: 34,
    gender: "Male",
    location: "Kharkiv, Ukraine",
    date: "2023-09-22",
    status: "verified",
    causeOfDeath: "Civilian Attack",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/ahmed-k",
    lifeStory: "Ahmed was an engineer who spent his weekends volunteering at local shelters. His wife describes him as someone who 'always put others first.'",
    deathDetails: "Ahmed was caught in a missile strike while delivering aid to a residential building.",
    familyRelationship: "left behind his wife and elderly parents",
    occupation: "An engineer",
    perpetrator: "Russian Armed Forces",
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
    gender: "Female",
    location: "Mariupol, Ukraine",
    date: "2023-08-30",
    status: "investigating",
    causeOfDeath: "Siege",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/maria-l",
    lifeStory: "Maria was a nurse who worked tirelessly during the conflict, often staying beyond her shifts to care for patients.",
    deathDetails: "Maria died when artillery shells hit the hospital where she worked. She refused to leave her patients behind.",
    familyRelationship: "left behind her teenage daughter and sister",
    occupation: "A nurse",
    perpetrator: "Russian Armed Forces",
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
    gender: "Male",
    location: "Yangon, Myanmar",
    date: "2023-07-12",
    status: "documented",
    causeOfDeath: "Civil Unrest",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/chen-w",
    lifeStory: "Chen was a university student studying journalism. He believed in the power of truth and was known for his courage.",
    deathDetails: "Chen was shot during a peaceful protest while documenting police actions with his camera.",
    familyRelationship: "left behind his parents and younger sister",
    occupation: "A journalism student",
    perpetrator: "Myanmar Military",
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
    gender: "Female",
    location: "Damascus, Syria",
    date: "2023-06-18",
    status: "verified",
    causeOfDeath: "Chemical Attack",
    actionTaken: "investigating",
    verified: true,
    thirdPartyVerified: true,
    newsLink: "https://example.com/news/elena-r",
    lifeStory: "Elena was a doctor who volunteered at refugee camps. She was passionate about providing medical care to those in need.",
    deathDetails: "Elena died from exposure to chemical weapons during an attack on a medical facility.",
    familyRelationship: "left behind her husband and twin daughters",
    occupation: "A doctor",
    perpetrator: "Syrian Government Forces",
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
    gender: "Male",
    location: "Bucha, Ukraine",
    date: "2023-05-27",
    status: "documented",
    causeOfDeath: "Execution",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/david-l",
    lifeStory: "David was a local shop owner who helped distribute food and supplies to elderly residents during the siege.",
    deathDetails: "David was executed by occupying forces after being found helping civilians evacuate.",
    familyRelationship: "left behind his wife and elderly mother",
    occupation: "A shop owner", 
    perpetrator: "Russian Armed Forces",
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
    gender: "Female",
    location: "Gaza, Palestine",
    date: "2023-04-14",
    status: "investigating",
    causeOfDeath: "Airstrike",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/fatima-a",
    lifeStory: "Fatima was an art student who used her creativity to bring joy to children in refugee camps.",
    deathDetails: "Fatima was killed in her family home during a nighttime airstrike.",
    familyRelationship: "left behind her parents and younger brother",
    occupation: "An art student",
    perpetrator: "Israeli Defense Forces",
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
    gender: "Male",
    location: "Donetsk, Ukraine",
    date: "2023-03-09",
    status: "verified",
    causeOfDeath: "Landmine",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: true,
    newsLink: "https://example.com/news/michael-t",
    lifeStory: "Michael was a humanitarian worker who specialized in mine clearance. He had already saved countless lives.",
    deathDetails: "Michael was killed by an unmarked landmine while clearing a path to a school.",
    familyRelationship: "left behind his wife and two children",
    occupation: "A humanitarian worker",
    perpetrator: "Russian Armed Forces",
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
    gender: "Female",
    location: "Kabul, Afghanistan",
    date: "2023-02-22",
    status: "documented",
    causeOfDeath: "Targeted Killing",
    actionTaken: "investigating",
    verified: true,
    thirdPartyVerified: false,
    newsLink: "https://example.com/news/amira-h",
    lifeStory: "Amira was a women's rights activist and teacher who continued to educate girls in secret.",
    deathDetails: "Amira was shot outside her home by unknown assailants after receiving death threats for her activism.",
    familyRelationship: "left behind her mother and three sisters",
    occupation: "A teacher and activist",
    perpetrator: "Taliban",
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
    gender: "Male",
    location: "Caracas, Venezuela",
    date: "2023-01-15",
    status: "verified",
    causeOfDeath: "Police Brutality",
    actionTaken: "pending",
    verified: true,
    thirdPartyVerified: true,
    newsLink: "https://example.com/news/carlos-m",
    lifeStory: "Carlos was a community organizer who worked to improve living conditions in his neighborhood.",
    deathDetails: "Carlos was beaten to death during a peaceful protest demanding better living conditions.",
    familyRelationship: "left behind his wife and teenage son",
    occupation: "A community organizer",
    perpetrator: "Venezuelan Police",
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
  const [causeFilter, setCauseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Extract unique statuses and causes from cases data
  const uniqueStatuses = [...new Set(cases.map(c => c.status))];
  const uniqueCauses = [...new Set(cases.map(c => c.causeOfDeath))];

  // Filter and sort cases
  const filteredCases = cases.filter(victim => {
    const matchesSearch = victim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         victim.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || victim.status === statusFilter;
    const matchesCause = causeFilter === "all" || victim.causeOfDeath === causeFilter;
    
    return matchesSearch && matchesStatus && matchesCause;
  }).sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "age":
        return a.age - b.age;
      case "recent":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={causeFilter} onValueChange={setCauseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cause of Death" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Causes</SelectItem>
                {uniqueCauses.map(cause => (
                  <SelectItem key={cause} value={cause}>
                    {cause}
                  </SelectItem>
                ))}
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
        <p className="text-sm text-muted-foreground mb-4">
          All cases have been vetted at least once by a human who corroborated facts with both official and field sources.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredCases.length} cases found
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/upload">Submit Case</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/download-archive">
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
            {filteredCases.map((victim) => (
              <VictimCard 
                key={victim.id} 
                victim={victim} 
                showReportButton={true}
                clickable={true}
              />
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