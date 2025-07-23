import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, MapPin, Users, ChevronDown, Clock, Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VictimCard } from "@/components/VictimCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useTranslation } from "@/lib/translations";
import { formatDate } from "@/lib/dateUtils";
import victimSarah from "@/assets/victim-sarah.jpg";

// Mock victim data for demonstration
const recentCases = [{
  id: "001",
  name: "Sarah M.",
  age: 8,
  gender: "Female",
  location: "Aleppo",
  date: "2025-07-20",
  status: "documented",
  causeOfDeath: "Bombing",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/sarah-m",
  lifeStory: "Sarah was a bright 8-year-old who loved painting and playing with her dolls. Her teacher remembers her as a curious child who always asked thoughtful questions. 'She wanted to be an artist when she grew up,' her mother recalls through tears.",
  deathDetails: "Sarah was killed during a bombing of her residential area. She was playing in her room when the attack occurred. Her family tried to reach the shelter but didn't make it in time.",
  familyRelationship: "left behind her mother, father, and two younger brothers",
  occupation: "A student",
  perpetrator: "Syrian Government Forces",
  images: ["https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=400&fit=crop&crop=face", "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=300&fit=crop&crop=face"]
}, {
  id: "002",
  name: "Ahmed K.",
  age: 34,
  gender: "Male",
  location: "Kharkiv",
  date: "2025-07-19",
  status: "verified",
  causeOfDeath: "Bombing",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: true,
  newsLink: "https://example.com/news/ahmed-k",
  lifeStory: "Ahmed was an engineer who spent his weekends volunteering at local shelters. His wife describes him as someone who 'always put others first.' He had been planning to start a family and dreamed of building sustainable housing.",
  deathDetails: "Ahmed was caught in a missile strike while delivering aid to a residential building. Witnesses report he was helping evacuate elderly residents when the second wave of attacks hit the area.",
  familyRelationship: "left behind his wife and elderly parents",
  occupation: "An engineer",
  perpetrator: "Russian Armed Forces",
  images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=300&fit=crop"]
}, {
  id: "003",
  name: "Maria L.",
  age: 42,
  gender: "Female",
  location: "Mariupol",
  date: "2025-07-18",
  status: "investigating",
  causeOfDeath: "Shelling",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/maria-l",
  lifeStory: "Maria was a nurse who worked tirelessly during the conflict, often staying beyond her shifts to care for patients. Her daughter remembers her saying, 'Healing is the only way to fight darkness.' She loved gardening and classical music.",
  deathDetails: "Maria died when artillery shells hit the hospital where she worked. She was in the intensive care unit attending to critical patients when the attack began. She refused to leave her patients behind.",
  familyRelationship: "left behind her teenage daughter and sister",
  occupation: "A nurse",
  perpetrator: "Russian Armed Forces",
  images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1452378174528-3024x3024?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop"]
}, {
  id: "004",
  name: "Chen W.",
  age: 25,
  gender: "Male",
  location: "Yangon",
  date: "2025-07-17",
  status: "documented",
  causeOfDeath: "Civil Unrest",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/chen-w",
  lifeStory: "Chen was a university student studying journalism. He believed in the power of truth and was known for his courage in standing up for justice. His friends describe him as someone who never backed down from doing what was right.",
  deathDetails: "Chen was shot during a peaceful protest while documenting police actions with his camera. Witnesses say he was clearly identified as press but was targeted nonetheless.",
  familyRelationship: "left behind his parents and younger sister",
  occupation: "A journalism student",
  perpetrator: "Myanmar Military",
  images: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop"]
}, {
  id: "005",
  name: "Elena R.",
  age: 31,
  gender: "Female",
  location: "Damascus",
  date: "2025-07-16",
  status: "verified",
  causeOfDeath: "Chemical attack",
  actionTaken: "investigating",
  verified: true,
  thirdPartyVerified: true,
  newsLink: "https://example.com/news/elena-r",
  lifeStory: "Elena was a doctor who volunteered at refugee camps. She was passionate about providing medical care to those in need and often worked without pay to help families escape conflict zones.",
  deathDetails: "Elena died from exposure to chemical weapons during an attack on a medical facility. She was treating patients when the attack occurred and refused to abandon them.",
  familyRelationship: "left behind her husband and twin daughters",
  occupation: "A doctor",
  perpetrator: "Syrian Government Forces",
  images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=400&h=300&fit=crop"]
}, {
  id: "006",
  name: "David L.",
  age: 45,
  gender: "Male",
  location: "Bucha",
  date: "2025-07-15",
  status: "documented",
  causeOfDeath: "Execution",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/david-l",
  lifeStory: "David was a local shop owner who helped distribute food and supplies to elderly residents during the siege. His neighbors remember him as a kind man who always helped others, even when resources were scarce.",
  deathDetails: "David was executed by occupying forces after being found helping civilians evacuate. His body was discovered with his hands tied behind his back.",
  familyRelationship: "left behind his wife and elderly mother",
  occupation: "A shop owner",
  perpetrator: "Russian Armed Forces",
  images: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1542190891-2093d38760f2?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop"]
}, {
  id: "007",
  name: "Fatima A.",
  age: 19,
  gender: "Female",
  location: "Gaza",
  date: "2025-07-14",
  status: "investigating",
  causeOfDeath: "Airstrike",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/fatima-a",
  lifeStory: "Fatima was an art student who used her creativity to bring joy to children in refugee camps. She taught art classes and organized cultural events to help preserve Palestinian heritage.",
  deathDetails: "Fatima was killed in her family home during a nighttime airstrike. The building collapsed, trapping her and several family members inside.",
  familyRelationship: "left behind her parents and younger brother",
  occupation: "An art student",
  perpetrator: "Israeli Defense Forces",
  images: ["https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop"]
}, {
  id: "008",
  name: "Michael T.",
  age: 38,
  gender: "Male",
  location: "Donetsk",
  date: "2025-07-13",
  status: "verified",
  causeOfDeath: "Landmine",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: true,
  newsLink: "https://example.com/news/michael-t",
  lifeStory: "Michael was a humanitarian worker who specialized in mine clearance. He had already saved countless lives by safely removing unexploded ordnance from civilian areas.",
  deathDetails: "Michael was killed by an unmarked landmine while clearing a path to a school. He died instantly, but his work had already made the surrounding area safe for children to return.",
  familyRelationship: "left behind his wife and two children",
  occupation: "A humanitarian worker",
  perpetrator: "Russian Armed Forces",
  images: ["https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"]
}, {
  id: "009",
  name: "Amira H.",
  age: 26,
  gender: "Female",
  location: "Kabul",
  date: "2025-07-12",
  status: "documented",
  causeOfDeath: "Targeted killing",
  actionTaken: "investigating",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/amira-h",
  lifeStory: "Amira was a women's rights activist and teacher who continued to educate girls in secret after schools were closed. She believed education was the key to freedom and never stopped fighting for women's rights.",
  deathDetails: "Amira was shot outside her home by unknown assailants. She had received death threats for her activism but refused to leave the country, saying her work was too important.",
  familyRelationship: "left behind her mother and three sisters",
  occupation: "A teacher and activist",
  perpetrator: "Taliban",
  images: ["https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop"]
}, {
  id: "010",
  name: "Carlos M.",
  age: 52,
  gender: "Male",
  location: "Caracas",
  date: "2025-07-11",
  status: "verified",
  causeOfDeath: "Police brutality",
  actionTaken: "pending",
  verified: true,
  thirdPartyVerified: true,
  newsLink: "https://example.com/news/carlos-m",
  lifeStory: "Carlos was a community organizer who worked to improve living conditions in his neighborhood. He organized food distribution programs and advocated for basic services like clean water and electricity.",
  deathDetails: "Carlos was beaten to death during a peaceful protest demanding better living conditions. Multiple witnesses identified the officers involved, but no arrests have been made.",
  familyRelationship: "left behind his wife and teenage son",
  occupation: "A community organizer",
  perpetrator: "Venezuelan Police",
  images: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop&crop=face", "https://images.unsplash.com/photo-1618641986557-1ecd230959aa?w=400&h=300&fit=crop", "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=300&fit=crop"]
}];
const timelineData = [{
  year: "2025",
  months: [{
    name: "Jul",
    cases: 23
  }, {
    name: "Jun",
    cases: 31
  }, {
    name: "May",
    cases: 18
  }, {
    name: "Apr",
    cases: 27
  }]
}, {
  year: "2024",
  months: [{
    name: "Dec",
    cases: 15
  }, {
    name: "Nov",
    cases: 22
  }, {
    name: "Oct",
    cases: 29
  }, {
    name: "Sep",
    cases: 34
  }]
}, {
  year: "2023",
  months: [{
    name: "Dec",
    cases: 12
  }, {
    name: "Nov",
    cases: 19
  }]
}];
const Index = () => {
  const [expandedVictim, setExpandedVictim] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timelineScrollPosition, setTimelineScrollPosition] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2025");
  const {
    currentLanguage
  } = useLanguage();
  const {
    t
  } = useTranslation(currentLanguage);
  return <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showSidebar={true} />

      <div className="flex relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
        
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
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                  ×
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {timelineData.map(yearData => <Collapsible key={yearData.year}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-left hover:bg-muted/50 p-2 rounded" onClick={() => setSelectedYear(yearData.year)}>
                    <span className="font-medium text-sm lg:text-base">
                      {yearData.year} ({yearData.months.reduce((sum, month) => sum + month.cases, 0)})
                    </span>
                    <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-2 lg:pl-4 space-y-1">
                    {yearData.months.map(month => <Link 
                        key={month.name} 
                        to={`/browse?year=${yearData.year}&month=${month.name}`}
                        className="flex w-full items-center justify-between text-left text-xs lg:text-sm text-muted-foreground hover:text-foreground p-1 hover:bg-muted/30 rounded"
                      >
                        <span>{month.name}</span>
                        <span className="text-xs">({month.cases})</span>
                      </Link>)}
                  </CollapsibleContent>
                </Collapsible>)}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          

          {/* Recent Cases */}
          <section className="py-8 md:py-16">
            <div className="container mx-auto px-4">
              <div className="mb-8 md:mb-12">
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-lg md:text-xl leading-relaxed text-foreground">
                    As of <span className="font-mono text-red-600 font-bold">23/07/2025</span>, there are{' '}
                    <span className="text-red-600 font-bold">48,405</span>{' '}
                    <span className="text-red-600 font-bold">reported fatalities</span> in the conflict.
                    Of those numerous cases, the following (and counting) are without a doubt{' '}
                    <span className="text-red-600 font-bold">confirmed cases of state murder</span>.
                  </p>
                  <p className="text-lg md:text-xl text-foreground">
                    We present you with
                  </p>
                  <p className="text-lg md:text-xl text-red-600 font-bold">
                    HARD EVIDENCE
                  </p>
                </div>
              </div>
              
              {/* Mobile: Vertical scroll, Desktop: Grid */}
              <div className="md:hidden space-y-4">
                {recentCases.slice(0, 10).map(victim => <VictimCard key={victim.id} victim={victim} showReportButton={true} clickable={true} />)}
              </div>

              <div className="hidden md:block">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {recentCases.slice(0, 10).map(victim => <VictimCard key={victim.id} victim={victim} showReportButton={true} clickable={true} />)}
                </div>
              </div>
              
            </div>
          </section>

          {/* Interactive Map */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Recent Cases Map</h3>
              <InteractiveMap />
            </div>
          </section>

          {/* Stats */}
          <section className="py-8 md:py-16 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <div className="text-sm text-muted-foreground">
                  <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
                    <Link to="/browse" className="hover:text-foreground whitespace-nowrap">
                      <span className="font-bold text-2xl">2,847</span> Total Cases
                    </Link>
                    <span className="hidden md:inline">•</span>
                    <Link to="/map" className="hover:text-foreground whitespace-nowrap">
                      <span className="font-bold text-2xl">47</span> Locations
                    </Link>
                    <span className="hidden md:inline">•</span>
                    <Link to="/browse?filter=verified" className="hover:text-foreground whitespace-nowrap">
                      <span className="font-bold text-2xl">1,893</span> Verified
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Horizontal Timeline */}
          <section className="py-8 md:py-12 border-b">
            <div className="container mx-auto px-4">
              <HorizontalTimeline />
            </div>
          </section>
        </main>
      </div>

      {/* Show More Button */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Button asChild size="lg" variant="outline">
          <Link to="/browse">
            Show More Cases
          </Link>
        </Button>
      </div>

      <Footer />
    </div>;
};
export default Index;