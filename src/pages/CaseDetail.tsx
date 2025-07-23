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
  age: 28,
  location: "Aleppo, Syria",
  date: "2023-10-15",
  status: "documented",
  incidentType: "Armed Conflict",
  occupation: "Teacher",
  imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b3e5?w=400&h=400&fit=crop&crop=face",
  background: "Sarah was a primary school teacher who dedicated her life to educating children in her community. She was known for her kindness and commitment to her students.",
  circumstances: "Sarah was killed during a bombing of civilian areas in Aleppo. She was walking to school when the attack occurred.",
  witnesses: "Multiple witnesses confirmed the civilian nature of the attack.",
  submittedDate: "2023-10-20",
  caseNumber: "VIC-2023-001",
  timeline: [
    { date: "2023-10-15", event: "Incident occurred" },
    { date: "2023-10-20", event: "Case documented" },
    { date: "2023-10-25", event: "Witness statements collected" },
    { date: "2023-11-01", event: "Case verified" }
  ]
};

const CaseDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Content Warning */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4" />
            <span>This case contains sensitive content documenting violence against civilians.</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Victim Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Victim Profile
                  <Badge variant={caseData.status === 'verified' ? 'default' : 'secondary'}>
                    {caseData.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0">
                    <img 
                      src={caseData.imageUrl} 
                      alt={`${caseData.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{caseData.name}</h3>
                      <p className="text-muted-foreground">Age {caseData.age} • {caseData.occupation}</p>
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
                    </div>
                    <p className="text-sm">{caseData.background}</p>
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
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Report Additional Information
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