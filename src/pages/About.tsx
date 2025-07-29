import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Shield, Users, Globe, Heart, Hand } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";

const About = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {t('ourMission')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                We are dedicated to documenting and preserving the memory of victims of violence, 
                ensuring their stories are not forgotten and contributing to justice and accountability efforts worldwide.
              </p>
              <p>
                Every life has value, and every story deserves to be told. Through careful documentation 
                and verification, we create a permanent record that honors the victims and supports 
                legal and humanitarian efforts.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Truth & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Every case undergoes rigorous verification processes to ensure accuracy 
                  and reliability for legal documentation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  Dignity & Respect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We treat every victim and their families with the utmost dignity, 
                  respecting their privacy and cultural sensitivities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-purple-500" />
                  Global Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We provide multilingual access to ensure communities worldwide 
                  can document and access information in their native languages.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How We Work */}
          <Card>
            <CardHeader>
              <CardTitle>How We Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Documentation Process</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Secure submission system</li>
                    <li>• Multi-source verification</li>
                    <li>• Expert review and validation</li>
                    <li>• Secure archival storage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• End-to-end encryption</li>
                    <li>• Anonymous submission options</li>
                    <li>• Protected witness identities</li>
                    <li>• GDPR compliance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Can You Help */}
          <Card>
            <CardHeader>
              <CardTitle>How Can You Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                There are many ways to contribute to preserving memory and seeking justice:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Submit verified documentation</li>
                    <li>• Share witness testimonies</li>
                    <li>• Provide additional evidence</li>
                    <li>• Help with verification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Technical expertise</li>
                    <li>• Translation services</li>
                    <li>• Legal assistance</li>
                    <li>• Advocacy efforts</li>
                  </ul>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> This platform is completely voluntary and non-profit. 
                  All contributions are made by volunteers dedicated to preserving memory and seeking accountability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card id="contact">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you need assistance, have questions about the documentation process, 
                or require support as a survivor or family member, please reach out to us.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contact">Contact Number (Optional)</Label>
                  <Input id="contact" placeholder="Your contact number" />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" rows={4} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Select all that apply:</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="technical" />
                      <Label htmlFor="technical" className="text-sm">Report technical issue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="help" />
                      <Label htmlFor="help" className="text-sm">We would like to help <span className="bg-green-100 text-green-800 px-1 rounded text-xs">Volunteer</span></Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="legal" />
                      <Label htmlFor="legal" className="text-sm">Legal violation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="other" />
                      <Label htmlFor="other" className="text-sm">Other</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="recaptcha" />
                  <Label htmlFor="recaptcha" className="text-sm">I'm not a robot (reCAPTCHA)</Label>
                </div>
                
                <Button className="w-full">Submit</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;