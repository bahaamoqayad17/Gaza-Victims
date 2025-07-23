import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle, Shield, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";

const ReportCase = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
    reportType: [] as string[],
    caseId: "",
    urgency: "medium"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report submitted:", formData);
    // Handle form submission
  };

  const handleReportTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        reportType: [...prev.reportType, type]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        reportType: prev.reportType.filter(t => t !== type)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/browse">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-xl font-bold">Report Case</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Report an Issue
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Use this form to report technical issues, content violations, or provide additional information about cases.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Contact Information</h4>
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
                  <div className="space-y-2">
                    <Label htmlFor="contact">Additional Contact (Optional)</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      placeholder="Phone number or alternative contact method"
                    />
                  </div>
                </div>

                <Separator />

                {/* Report Type */}
                <div className="space-y-4">
                  <h4 className="font-medium">Report Type</h4>
                  <div className="space-y-3">
                    {[
                      { id: "technical", label: "Report technical issue" },
                      { id: "help", label: "We would like to help" },
                      { id: "violation", label: "Legal violation" },
                      { id: "other", label: "Other" }
                    ].map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={formData.reportType.includes(type.id)}
                          onCheckedChange={(checked) => handleReportTypeChange(type.id, checked as boolean)}
                        />
                        <Label htmlFor={type.id}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Case Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Case Information (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="case-id">Case ID</Label>
                      <Input
                        id="case-id"
                        value={formData.caseId}
                        onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                        placeholder="If reporting about a specific case"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Please provide detailed information about your report..."
                    rows={6}
                    required
                  />
                </div>

                {/* Security Notice */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Security & Privacy</p>
                      <p className="text-muted-foreground">
                        Your report will be handled confidentially. We use encryption to protect sensitive information 
                        and will only share details with authorized personnel as necessary for investigation.
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
                  <Send className="w-4 h-4 mr-2" />
                  Submit Report
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

export default ReportCase;