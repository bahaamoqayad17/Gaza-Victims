import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Shield, Send, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ReportCase = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
    reportType: [] as string[],
    caseId: "",
    urgency: "medium",
    familyComposition: {
      father: false,
      mother: false,
      grandfather: false,
      grandmother: false,
      wife: false,
      brothers: 0,
      sisters: 0,
      son: 0,
      daughter: 0
    }
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

  const handleFamilyTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      familyComposition: {
        ...prev.familyComposition,
        [tag]: checked
      }
    }));
  };

  const handleFamilyCountChange = (type: string, increment: boolean) => {
    setFormData(prev => ({
      ...prev,
      familyComposition: {
        ...prev.familyComposition,
        [type]: Math.max(0, (prev.familyComposition[type as keyof typeof prev.familyComposition] as number) + (increment ? 1 : -1))
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                {t('submitCase')}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('reportFormDescription')}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">{t('contactInformation')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('name')}</Label>
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

                {/* Family Composition */}
                <div className="space-y-4">
                  <h4 className="font-medium">Family Composition (Optional)</h4>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Select family members who are still alive:</p>
                    
                    {/* Checkbox tags for individual family members */}
                    <div className="flex flex-wrap gap-2">
                      {['father', 'mother', 'grandfather', 'grandmother', 'wife'].map((member) => (
                        <div key={member} className="flex items-center space-x-2">
                          <Checkbox
                            id={member}
                            checked={formData.familyComposition[member as keyof typeof formData.familyComposition] as boolean}
                            onCheckedChange={(checked) => handleFamilyTagChange(member, checked as boolean)}
                          />
                          <Label htmlFor={member} className="text-sm capitalize">{member}</Label>
                        </div>
                      ))}
                    </div>

                    {/* Counter for multiple family members */}
                    <div className="grid grid-cols-2 gap-4">
                      {['brothers', 'sisters', 'son', 'daughter'].map((member) => (
                        <div key={member} className="space-y-2">
                          <Label className="text-sm capitalize">{member}</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleFamilyCountChange(member, false)}
                              disabled={formData.familyComposition[member as keyof typeof formData.familyComposition] === 0}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {formData.familyComposition[member as keyof typeof formData.familyComposition]}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleFamilyCountChange(member, true)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
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