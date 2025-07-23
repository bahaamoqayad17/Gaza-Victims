import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, ArrowLeft, Shield, AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Mock case data
const caseData = {
  id: "001",
  name: "Sarah M.",
  age: 8,
  gender: "Female",
  location: "Aleppo, Syria",
  date: "2025-07-20",
  status: "documented",
  incidentType: "Bombing",
  occupation: "Student",
  imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=400&fit=crop&crop=face",
  background: "Sarah was a bright 8-year-old who loved painting and playing with her dolls. Her teacher remembers her as a curious child who always asked thoughtful questions. 'She wanted to be an artist when she grew up,' her mother recalls through tears.",
  circumstances: "Sarah was killed during a bombing of her residential area. She was playing in her room when the attack occurred. Her family tried to reach the shelter but didn't make it in time.",
  witnesses: ["Mother", "Father", "Neighbors"],
  submittedDate: "2025-07-21",
  caseNumber: "FAR-2025-001",
  familyRelationship: "left behind her mother, father, and two younger brothers",
  perpetrator: "Syrian Government Forces",
  verified: true,
  thirdPartyVerified: false,
  newsLink: "https://example.com/news/sarah-m",
  timeline: [
    { date: "2025-07-20", event: "Incident occurred" },
    { date: "2025-07-21", event: "Case submitted" },
    { date: "2025-07-22", event: "Initial verification completed" }
  ]
};

const CaseDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />


      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Victim Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Victim Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=400&fit=crop&crop=face" 
                      alt={`${caseData.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                     <div>
                       <h3 className="font-semibold text-lg">{caseData.name}</h3>
                       <p className="text-muted-foreground">Age {caseData.age} • {caseData.gender} • {caseData.occupation}</p>
                       <p className="text-muted-foreground italic text-sm mt-1">{caseData.familyRelationship}</p>
                     </div>
                     
                     <div className="flex flex-wrap gap-1 mb-2 text-xs">
                       <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300">Documented</span>
                       {caseData.verified && (
                         <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">Verified</span>
                       )}
                       {caseData.thirdPartyVerified && (
                         <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">Third Party Verified</span>
                       )}
                       <span className="bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300">Proof of ID</span>
                       <span className="bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300">Proof of Death</span>
                     </div>
                     
                     <div className="space-y-2">
                       <div className="flex items-center gap-2 text-sm">
                         <MapPin className="w-4 h-4 text-muted-foreground" />
                         {caseData.location}
                       </div>
                       <div className="flex items-center gap-2 text-sm">
                         <Calendar className="w-4 h-4 text-muted-foreground" />
                         {caseData.date}
                       </div>
                       <div className="text-sm">
                         <span>Perpetrator: {caseData.perpetrator}</span>
                       </div>
                       <div className="text-sm">
                         <span>Enforced legal response: 
                           <span className="text-red-600"> NONE, since 3 days</span>
                         </span>
                       </div>
                       {caseData.newsLink && (
                         <div className="text-sm">
                           <span>Incident news story: </span>
                           <a 
                             href={caseData.newsLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 hover:text-blue-800 underline text-xs"
                           >
                             {caseData.newsLink}
                           </a>
                         </div>
                       )}
                     </div>
                     <p className="text-sm">{caseData.background}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Their life in few images */}
            <Card>
              <CardHeader>
                <CardTitle>Their life in few images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Sample images of a child's life */}
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=300&fit=crop" 
                      alt="Sarah playing with toys"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop" 
                      alt="Sarah at school"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop" 
                      alt="Sarah drawing"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                      alt="Sarah with family"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-primary/60 ml-1"></div>
                      </div>
                      <p className="text-xs text-muted-foreground">Video of Sarah painting</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle>Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Type of Incident</h4>
                  <Badge variant="outline">{caseData.incidentType}</Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Circumstances</h4>
                  <p className="text-sm leading-relaxed">{caseData.circumstances}</p>
                </div>

                {caseData.witnesses && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Witness Information</h4>
                      <p className="text-sm leading-relaxed">{caseData.witnesses}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Proof of Identity */}
            <Card>
              <CardHeader>
                <CardTitle>Proof of Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center filter blur-sm">
                      <div className="w-32 h-32 bg-gray-300 rounded mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Identity Document</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="outline" size="sm">
                      Login to View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proof of Death */}
            <Card>
              <CardHeader>
                <CardTitle>Proof of Death</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center filter blur-sm">
                      <div className="w-32 h-32 bg-gray-300 rounded mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Death Certificate</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Button variant="outline" size="sm" className="mb-2">
                      Login to View
                    </Button>
                    <p className="text-xs text-center text-amber-600 px-4">
                      ⚠️ Graphic content warning. Viewer discretion advised.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident News Story */}
            <Card>
              <CardHeader>
                <CardTitle>Incident News Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">News article screenshot would appear here</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Related News Coverage:</h4>
                  <div className="space-y-1 text-sm">
                    <a href={caseData.newsLink} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                      <span className="w-3 h-3">📰</span>
                      {caseData.newsLink}
                    </a>
                    <a href="https://example.com/news/related-1" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                      <span className="w-3 h-3">📰</span>
                      https://example.com/news/related-1
                    </a>
                    <a href="https://example.com/news/related-2" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1">
                      <span className="w-3 h-3">📰</span>
                      https://example.com/news/related-2
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Incident Location</h4>
                  <p className="text-muted-foreground">{caseData.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">Approximate coordinates: 36.2021° N, 37.1343° E</p>
                </div>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">Interactive map with location marker would appear here</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>• Submitter identity protected</p>
                <p>• All data encrypted</p>
                <p>• Verified by independent sources</p>
                <p>• Suitable for legal documentation</p>
              </CardContent>
            </Card>

            {/* Case Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Case Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case Number:</span>
                  <span className="font-mono">{caseData.caseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span>{caseData.submittedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {caseData.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                  <Link to="/report-additional">
                    Report Additional Information
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Download Case File
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CaseDetail;