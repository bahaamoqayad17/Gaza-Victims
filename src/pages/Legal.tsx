import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Scale, Shield, Eye, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Use of Platform</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This platform is intended for the documentation of victims of violence and human rights violations. 
                  Users must submit only truthful, verified information and respect the dignity of victims and their families.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Prohibited Content</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• False or misleading information</li>
                  <li>• Content intended to harm or harass</li>
                  <li>• Commercial or promotional material</li>
                  <li>• Content violating local laws</li>
                  <li>• Graphic imagery without proper warnings</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">User Responsibilities</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Verify accuracy of submitted information</li>
                  <li>• Obtain necessary consents for photos/videos</li>
                  <li>• Respect privacy and confidentiality</li>
                  <li>• Report suspected violations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Collection</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We collect only information necessary for documentation purposes. Personal data is protected 
                  through encryption and access controls. Submitter identities are kept confidential unless 
                  explicitly consented to disclosure.
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Data Usage</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Documentation and verification purposes</li>
                  <li>• Supporting legal and humanitarian efforts</li>
                  <li>• Statistical analysis (anonymized)</li>
                  <li>• Research by authorized institutions</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Your Rights</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Access your submitted information</li>
                  <li>• Request corrections or updates</li>
                  <li>• Withdraw consent (where applicable)</li>
                  <li>• Request data deletion (subject to legal requirements)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Content Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Content Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Submission Standards</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• All information must be factual and verifiable</li>
                  <li>• Sources must be credible and documented</li>
                  <li>• Photos must be relevant and authentic</li>
                  <li>• Graphic content must be appropriately marked</li>
                  <li>• Consent required for identifiable individuals</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Review Process</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  All submissions undergo review by trained professionals. Content may be edited 
                  for clarity, accuracy, or sensitivity while preserving the essential facts. 
                  Submitters are contacted if additional information is needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Legal Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Legal Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                The information contained in this archive is for documentation and educational purposes. 
                While we strive for accuracy, we cannot guarantee the completeness or accuracy of all 
                information. Users should verify information independently before relying on it for 
                legal or official purposes.
              </p>
              
              <Separator />
              
              <p className="text-sm leading-relaxed text-muted-foreground">
                This platform is not a substitute for official legal proceedings or formal 
                investigations. The documentation provided here is intended to support, not replace, 
                proper legal channels and institutional responses to human rights violations.
              </p>

              <Separator />

              <div className="flex justify-center pt-4">
                <Button asChild>
                  <Link to="/about#contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Legal;