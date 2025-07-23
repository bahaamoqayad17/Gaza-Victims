import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Users, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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
            <h1 className="text-xl font-bold">About Us</h1>
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

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you need assistance, have questions about the documentation process, 
                or require support as a survivor or family member, please reach out to us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Report Technical Issues</Button>
                <Button variant="outline">Emergency Resources</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;