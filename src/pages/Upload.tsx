import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReviewSubmittedCase from "@/components/UploadSteps/ReviewSubmittedCase";
import FirstStep from "@/components/UploadSteps/FirstStep";
import SecondStep from "@/components/UploadSteps/SecondStep";
import ThirdStep from "@/components/UploadSteps/ThirdStep";
import FourthStep from "@/components/UploadSteps/FourthStep";
import SubmittionSummary from "@/components/UploadSteps/SubmittionSummary";

const Upload = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    occupation: "",
    background: "",
    date: "",
    location: "",
    circumstances: "",
    witnesses: "",
    source: "",
    notes: "",
    consentAgreed: false,
    safetyAcknowledged: false,
  });
  const [familyCounts, setFamilyCounts] = useState({
    daughters: 0,
    sons: 0,
    brothers: 0,
    sisters: 0,
  });
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  const [socialMediaUrls, setSocialMediaUrls] = useState<string[]>([""]);
  const [socialMediaPreview, setSocialMediaPreview] = useState<string | null>(
    null
  );
  const [newsLinks, setNewsLinks] = useState<string[]>([""]);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isGraphicContent, setIsGraphicContent] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [cause, setCause] = useState("");
  const [otherCauseDetails, setOtherCauseDetails] = useState("");
  const [perpetrator, setPerpetrator] = useState("");
  const [otherPerpetratorDetails, setOtherPerpetratorDetails] = useState("");
  const [perpetratorEvidence, setPerpetratorEvidence] = useState("");
  const [proofOfIdFiles, setProofOfIdFiles] = useState<File[]>([]);
  const [proofOfDeathFiles, setProofOfDeathFiles] = useState<File[]>([]);
  const [additionalEvidenceFiles, setAdditionalEvidenceFiles] = useState<
    File[]
  >([]);
  const [isAdditionalEvidenceGraphic, setIsAdditionalEvidenceGraphic] =
    useState(false);

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const handleSocialMediaFetch = async (index: number) => {
    // Mock implementation - in real app would use social media APIs
    setSocialMediaPreview(socialMediaUrls[index]);
  };

  const addSocialMediaUrl = () => {
    if (socialMediaUrls.length < 10) {
      setSocialMediaUrls((prev) => [...prev, ""]);
    }
  };

  const removeSocialMediaUrl = (index: number) => {
    setSocialMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSocialMediaUrl = (index: number, value: string) => {
    setSocialMediaUrls((prev) =>
      prev.map((url, i) => (i === index ? value : url))
    );
  };

  const addNewsLink = () => {
    if (newsLinks.length < 10) {
      setNewsLinks((prev) => [...prev, ""]);
    }
  };

  const removeNewsLink = (index: number) => {
    setNewsLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateNewsLink = (index: number, value: string) => {
    setNewsLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
  };

  const removeAdditionalPhoto = (index: number) => {
    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProofOfIdFile = (index: number) => {
    setProofOfIdFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeProofOfDeathFile = (index: number) => {
    setProofOfDeathFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAdditionalEvidenceFile = (index: number) => {
    setAdditionalEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

          {/* Review Submitted Case Link - Only show on step 1 */}
          {currentStep === 1 && <ReviewSubmittedCase />}
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
                {currentStep === 4 && "Preview"}
                {currentStep === 5 && "Review & Submit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <FirstStep
                  addSocialMediaUrl={addSocialMediaUrl}
                  removeSocialMediaUrl={removeSocialMediaUrl}
                  updateSocialMediaUrl={updateSocialMediaUrl}
                  socialMediaUrls={socialMediaUrls}
                  setAdditionalPhotos={setAdditionalPhotos}
                  setFamilyCounts={setFamilyCounts}
                  removeAdditionalPhoto={removeAdditionalPhoto}
                  socialMediaPreview={socialMediaPreview}
                  familyCounts={familyCounts}
                  additionalPhotos={additionalPhotos}
                  handleSocialMediaFetch={handleSocialMediaFetch}
                />
              )}

              {currentStep === 2 && (
                <SecondStep
                  cause={cause}
                  setCause={setCause}
                  otherCauseDetails={otherCauseDetails}
                  setOtherCauseDetails={setOtherCauseDetails}
                  perpetrator={perpetrator}
                  otherPerpetratorDetails={otherPerpetratorDetails}
                  setOtherPerpetratorDetails={setOtherPerpetratorDetails}
                  perpetratorEvidence={perpetratorEvidence}
                  setPerpetratorEvidence={setPerpetratorEvidence}
                  setPerpetrator={setPerpetrator}
                />
              )}

              {currentStep === 3 && (
                <ThirdStep
                  proofOfIdFiles={proofOfIdFiles}
                  setProofOfIdFiles={setProofOfIdFiles}
                  removeProofOfIdFile={removeProofOfIdFile}
                  proofOfDeathFiles={proofOfDeathFiles}
                  setProofOfDeathFiles={setProofOfDeathFiles}
                  removeProofOfDeathFile={removeProofOfDeathFile}
                  isGraphicContent={isGraphicContent}
                  setIsGraphicContent={setIsGraphicContent}
                  additionalEvidenceFiles={additionalEvidenceFiles}
                  setAdditionalEvidenceFiles={setAdditionalEvidenceFiles}
                  removeAdditionalEvidenceFile={removeAdditionalEvidenceFile}
                  isAdditionalEvidenceGraphic={isAdditionalEvidenceGraphic}
                  setIsAdditionalEvidenceGraphic={
                    setIsAdditionalEvidenceGraphic
                  }
                  newsLinks={newsLinks}
                  updateNewsLink={updateNewsLink}
                  removeNewsLink={removeNewsLink}
                  addNewsLink={addNewsLink}
                />
              )}

              {currentStep === 4 && (
                <FourthStep
                  formData={formData}
                  additionalPhotos={additionalPhotos}
                  evidenceFiles={evidenceFiles}
                  isGraphicContent={isGraphicContent}
                />
              )}

              {currentStep === 5 && (
                <SubmittionSummary
                  formData={formData}
                  setFormData={setFormData}
                  setCaptchaValue={setCaptchaValue}
                />
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
                  <Button
                    disabled={
                      !formData.consentAgreed ||
                      !formData.safetyAcknowledged ||
                      !captchaValue
                    }
                    onClick={() => {
                      // Generate case number
                      const year = new Date().getFullYear();
                      const randomChars = Math.random()
                        .toString(36)
                        .substring(2, 10)
                        .toUpperCase();
                      const caseNumber = `${year}-${randomChars}`;

                      // Navigate to success page with case number
                      navigate(`/case-submitted?caseNumber=${caseNumber}`);
                    }}
                  >
                    Submit Documentation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;
