import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Archive
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl font-bold truncate">About Us</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Our Mission
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
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" id="name" className="w-full px-3 py-2 border rounded-md" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="email" className="w-full px-3 py-2 border rounded-md" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium mb-1">Contact Information</label>
                  <input type="text" id="contact" className="w-full px-3 py-2 border rounded-md" placeholder="Phone or alternative contact" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <textarea id="message" rows={4} className="w-full px-3 py-2 border rounded-md" required></textarea>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Type of inquiry:</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Report technical issue</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">We would like to help</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Legal violation</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Other</span>
                    </label>
                  </div>
                </div>

                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">reCAPTCHA verification would appear here</p>
                </div>

                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;