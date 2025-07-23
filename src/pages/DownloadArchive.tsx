import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, FileImage, FileVideo, Filter, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const DownloadArchive = () => {
  const [includeMedia, setIncludeMedia] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleDownload = () => {
    // Implementation would handle the download logic here
    console.log("Downloading archive with filters:", {
      includeMedia,
      includePhotos,
      includeVideos,
      statusFilter,
      locationFilter,
      dateFrom,
      dateTo
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Archive Download Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Media Content</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="include-media" 
                      checked={includeMedia}
                      onCheckedChange={(checked) => setIncludeMedia(checked as boolean)}
                    />
                    <Label htmlFor="include-media">Include media files</Label>
                  </div>
                  
                  {includeMedia && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-photos" 
                          checked={includePhotos}
                          onCheckedChange={(checked) => setIncludePhotos(checked as boolean)}
                        />
                        <Label htmlFor="include-photos" className="flex items-center gap-2">
                          <FileImage className="w-4 h-4" />
                          Photos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="include-videos" 
                          checked={includeVideos}
                          onCheckedChange={(checked) => setIncludeVideos(checked as boolean)}
                        />
                        <Label htmlFor="include-videos" className="flex items-center gap-2">
                          <FileVideo className="w-4 h-4" />
                          Videos
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Content Filters
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="documented">Documented</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location-filter">Location</Label>
                    <Input
                      id="location-filter"
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date From
                    </Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-to">Date To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Download Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Download Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Archives are provided in ZIP format</li>
                  <li>• Large archives may take several minutes to prepare</li>
                  <li>• Download links are valid for 24 hours</li>
                  <li>• Media files significantly increase archive size</li>
                </ul>
              </div>

              {/* Download Button */}
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Prepare Archive Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DownloadArchive;