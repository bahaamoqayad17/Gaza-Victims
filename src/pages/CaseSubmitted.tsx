import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Copy, Camera, FileText, AlertTriangle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const CaseSubmitted = () => {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const caseNumber = searchParams.get('caseNumber') || 'UNKNOWN';

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(caseNumber);
      setCopied(true);
      toast.success("Case number copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy case number");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                Case Submitted Successfully
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Your documentation has been received and will be reviewed by our team
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Case Number */}
              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">
                  Your Case Reference Number
                </h3>
                <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border">
                  <span className="font-mono text-lg text-green-700 dark:text-green-300 tracking-wider">
                    {caseNumber}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyNumber}
                    className="ml-2"
                  >
                    {copied ? "Copied!" : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                      Please Save This Information
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                      This case number is your only way to track and review your submission. Please:
                    </p>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      <li className="flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Take a screenshot of this page
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Write down the case number in a safe place
                      </li>
                      <li className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        Copy the number to your notes or password manager
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="space-y-4">
                <h3 className="font-semibold">What Happens Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Initial Review</p>
                      <p className="text-sm text-muted-foreground">Our team will verify and review your submission within 7-14 days</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Verification Process</p>
                      <p className="text-sm text-muted-foreground">Evidence will be authenticated and cross-referenced with other sources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Publication</p>
                      <p className="text-sm text-muted-foreground">Once verified, the case will be published in our public database</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="font-semibold">Need to Make Changes?</h3>
                <p className="text-sm text-muted-foreground">
                  You can review your submission, add additional information, or request changes using your case number.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <Link to="/review-case">Review Your Submission</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/browse">Browse All Cases</Link>
                  </Button>
                </div>
              </div>
              
              {/* Back to Home */}
              <div className="text-center pt-4">
                <Button variant="ghost" asChild>
                  <Link to="/">← Back to Home</Link>
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

export default CaseSubmitted;