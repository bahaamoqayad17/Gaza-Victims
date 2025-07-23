import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Upload as UploadIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

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
            <h1 className="text-xl font-bold">Document Case</h1>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" />
              Anonymous
            </Badge>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Victim Information"}
                {currentStep === 2 && "Incident Details"}
                {currentStep === 3 && "Documentation"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Full name" />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="Age" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" placeholder="Occupation or role" />
                  </div>

                  <div>
                    <Label htmlFor="photo">Portrait Photo</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload a dignified portrait photo
                      </p>
                      <Input type="file" accept="image/*" className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background">Background</Label>
                    <Textarea 
                      id="background" 
                      placeholder="Brief background about the victim's life..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date of Incident</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="circumstances">Circumstances</Label>
                    <Textarea 
                      id="circumstances" 
                      placeholder="Description of what happened..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="witnesses">Witness Information (Optional)</Label>
                    <Textarea 
                      id="witnesses" 
                      placeholder="Any witness accounts or references..."
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>Additional Evidence</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload supporting documentation
                      </p>
                      <Input type="file" multiple className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="source">Source of Information</Label>
                    <Input id="source" placeholder="How you obtained this information" />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional relevant information..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Submission Summary</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Your identity remains completely anonymous</li>
                      <li>• All files are encrypted during transmission</li>
                      <li>• Case will be reviewed before publication</li>
                      <li>• You will receive a reference number for tracking</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ⚠️ Please ensure all information is accurate and that you have the right to share this documentation.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button>Submit Documentation</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;