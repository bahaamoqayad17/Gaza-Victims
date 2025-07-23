import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Calendar, MapPin, ArrowLeft } from "lucide-react";
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
    incidentType: "Armed Conflict",
    imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: "002", 
    name: "Ahmed K.",
    age: 34,
    location: "Kharkiv, Ukraine",
    date: "2023-09-22",
    status: "verified",
    incidentType: "Civilian Attack",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: "003",
    name: "Maria L.",
    age: 42,
    location: "Mariupol, Ukraine", 
    date: "2023-08-30",
    status: "investigating",
    incidentType: "Siege",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: "004",
    name: "Chen W.",
    age: 25,
    location: "Yangon, Myanmar",
    date: "2023-07-12",
    status: "documented",
    incidentType: "Civil Unrest",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cases.map((victim) => (
            <Link key={victim.id} to={`/case/${victim.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
                    <img 
                      src={victim.imageUrl} 
                      alt={`${victim.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-base">{victim.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Age {victim.age}</p>
                </CardHeader>
                <CardContent className="text-center space-y-2 pt-0">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {victim.location}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {victim.date}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {victim.incidentType}
                  </div>
                  <Badge 
                    variant={victim.status === 'verified' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {victim.status}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

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