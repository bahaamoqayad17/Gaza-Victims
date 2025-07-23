import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle, Shield, Send, Upload, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ReportAdditional = () => {
  const [formData, setFormData] = useState({
    caseId: "",
    name: "",
    email: "",
    contact: "",
    relationship: "",
    additionalInfo: "",
    evidenceDescription: "",
    correctionType: [] as string[],
    urgency: "medium",
    newEvidence: false,
    witnessTes: false,
    correction: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Additional information submitted:", formData);
    // Handle form submission
  };

  const handleCorrectionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        correctionType: [...prev.correctionType, type]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        correctionType: prev.correctionType.filter(t => t !== type)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="outline" asChild className="mb-4">
            <Link to="/case/001">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case
            </Link>
          </Button>

          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Report Additional Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Submit additional evidence, witness testimony, or corrections to help improve case documentation.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Case Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Case Information</h4>
                  <div className="space-y-2">
                    <Label htmlFor="case-id">Case ID (if known)</Label>
                    <Input
                      id="case-id"
                      value={formData.caseId}
                      onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                      placeholder="e.g., FAR-2025-001"
                    />
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Your Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Alternative Contact (Optional)</Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                        placeholder="Phone or other contact method"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to Victim</Label>
                      <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family">Family Member</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="witness">Witness</SelectItem>
                          <SelectItem value="community">Community Member</SelectItem>
                          <SelectItem value="organization">Organization Representative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Information Type */}
                <div className="space-y-4">
                  <h4 className="font-medium">Type of Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-evidence"
                        checked={formData.newEvidence}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, newEvidence: checked as boolean }))}
                      />
                      <Label htmlFor="new-evidence">New Evidence (documents, photos, videos)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="witness-testimony"
                        checked={formData.witnessTes}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, witnessTes: checked as boolean }))}
                      />
                      <Label htmlFor="witness-testimony">Witness Testimony</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="correction"
                        checked={formData.correction}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, correction: checked as boolean }))}
                      />
                      <Label htmlFor="correction">Correction to Existing Information</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="additional-info">Additional Information</Label>
                    <Textarea
                      id="additional-info"
                      value={formData.additionalInfo}
                      onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                      placeholder="Please provide detailed information..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  {formData.newEvidence && (
                    <div className="space-y-2">
                      <Label htmlFor="evidence-description">Evidence Description</Label>
                      <Textarea
                        id="evidence-description"
                        value={formData.evidenceDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, evidenceDescription: e.target.value }))}
                        placeholder="Describe the evidence you're submitting..."
                        rows={3}
                      />
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">File upload functionality would be implemented here</p>
                        <p className="text-xs text-gray-400 mt-1">Accepted formats: PDF, DOCX, JPG, PNG, MP4</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Urgency Level */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General additional information</SelectItem>
                          <SelectItem value="medium">Medium - Important details</SelectItem>
                          <SelectItem value="high">High - Critical corrections</SelectItem>
                          <SelectItem value="urgent">Urgent - Time-sensitive evidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Security & Privacy</p>
                      <p className="text-muted-foreground">
                        All submissions are handled confidentially. We use encryption to protect sensitive information 
                        and will verify all additional information before adding it to the case record.
                      </p>
                    </div>
                  </div>
                </div>

                {/* reCAPTCHA placeholder */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">reCAPTCHA verification would appear here</p>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg">
                  <Send className="w-4 w-4 mr-2" />
                  Submit Additional Information
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReportAdditional;