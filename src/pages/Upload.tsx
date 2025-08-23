import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReviewSubmittedCase from "@/components/UploadSteps/ReviewSubmittedCase";
import FirstStep from "@/components/UploadSteps/FirstStep";
import SecondStep from "@/components/UploadSteps/SecondStep";
import ThirdStep from "@/components/UploadSteps/ThirdStep";
import FourthStep from "@/components/UploadSteps/FourthStep";
import SubmittionSummary from "@/components/UploadSteps/SubmittionSummary";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  type Step1FormData,
  type Step2FormData,
  type Step3FormData,
  type Step4FormData,
  type Step5FormData,
} from "@/lib/validationSchemas";
import { useCreateCaseMutation } from "@/store/api/apiSlice";
import { useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux RTK Query mutation
  const [createCase, { isLoading: isCreating }] = useCreateCaseMutation();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    occupation: "",
    background: "",
    date: "",
    location: { lat: "", lng: "" },
    locationName: "",
    circumstances: "",
    witnesses: "",
    source: "",
    relationshipToVictim: "",
    notes: "",
    consentAgreed: false,
    safetyAcknowledged: false,
  });
  const [portraitPhoto, setPortraitPhoto] = useState<File | null>(null);
  const [familyCounts, setFamilyCounts] = useState({
    // Countable family members
    daughters: 0,
    sons: 0,
    brothers: 0,
    sisters: 0,
    // Single family members (boolean)
    wife: false,
    husband: false,
    mother: false,
    father: false,
    grandfather: false,
    grandmother: false,
    other: false,
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

  // Helper functions to get single files for schema compliance
  const getProofOfIdFile = () =>
    proofOfIdFiles.length > 0 ? proofOfIdFiles[0] : null;
  const getProofOfDeathFile = () =>
    proofOfDeathFiles.length > 0 ? proofOfDeathFiles[0] : null;
  const getAdditionalEvidenceFile = () =>
    additionalEvidenceFiles.length > 0 ? additionalEvidenceFiles[0] : null;

  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // React Hook Form setup for each step
  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      occupation: "",
      background: "",
    },
    mode: "onChange",
  });

  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      date: "",
      location: {
        lat: "",
        lng: "",
      },
      locationName: "",
      cause: "",
      otherCauseDetails: "",
      circumstances: "",
      perpetrator: "",
      otherPerpetratorDetails: "",
      perpetratorEvidence: "",
      witnesses: "",
    },
    mode: "onChange",
  });

  const step3Form = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      isGraphicContent: false,
      isAdditionalEvidenceGraphic: false,
      source: "",
      relationshipToVictim: "",
      newsLinks: [],
      notes: "",
    },
    mode: "onChange",
  });

  const step4Form = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    mode: "onChange",
  });

  const step5Form = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      consentAgreed: false,
      safetyAcknowledged: false,
      captchaValue: "",
    },
    mode: "onChange",
  });

  // Function to sync form data for preview
  const syncFormData = () => {
    const step1Data = step1Form.getValues();
    const step2Data = step2Form.getValues();
    const step3Data = step3Form.getValues();

    setFormData({
      name: step1Data.name || "",
      age: step1Data.age || "",
      gender: step1Data.gender || "",
      occupation: step1Data.occupation || "",
      background: step1Data.background || "",
      date: step2Data.date || "",
      location: step2Data.location ? { 
        lat: step2Data.location.lat || "", 
        lng: step2Data.location.lng || "" 
      } : { lat: "", lng: "" },
      locationName: step2Data.locationName || "",
      circumstances: step2Data.circumstances || "",
      witnesses: step2Data.witnesses || "",
      source: step3Data.source || "",
      relationshipToVictim: step3Data.relationshipToVictim || "",
      notes: step3Data.notes || "",
      consentAgreed: false,
      safetyAcknowledged: false,
    });
  };

  // Function to prepare case data for submission
  const prepareCaseData = () => {
    // Get form data from all steps
    const step1Data = step1Form.getValues();
    const step2Data = step2Form.getValues();
    const step3Data = step3Form.getValues();
    const step5Data = step5Form.getValues();

    // Prepare left behind family array
    const leftBehind = [];

    // Add countable family members
    if (familyCounts.daughters > 0)
      leftBehind.push(
        `${familyCounts.daughters} daughter${
          familyCounts.daughters > 1 ? "s" : ""
        }`
      );
    if (familyCounts.sons > 0)
      leftBehind.push(
        `${familyCounts.sons} son${familyCounts.sons > 1 ? "s" : ""}`
      );
    if (familyCounts.brothers > 0)
      leftBehind.push(
        `${familyCounts.brothers} brother${
          familyCounts.brothers > 1 ? "s" : ""
        }`
      );
    if (familyCounts.sisters > 0)
      leftBehind.push(
        `${familyCounts.sisters} sister${familyCounts.sisters > 1 ? "s" : ""}`
      );

    // Add single family members (boolean checkboxes)
    if (familyCounts.wife) leftBehind.push("wife");
    if (familyCounts.husband) leftBehind.push("husband");
    if (familyCounts.mother) leftBehind.push("mother");
    if (familyCounts.father) leftBehind.push("father");
    if (familyCounts.grandfather) leftBehind.push("grandfather");
    if (familyCounts.grandmother) leftBehind.push("grandmother");
    if (familyCounts.other) leftBehind.push("other relatives");

    // Prepare social media links (filter out empty ones)
    const socialMediaLinks = socialMediaUrls.filter((url) => url.trim() !== "");

    // Prepare news links (filter out empty ones)
    const filteredNewsLinks = newsLinks.filter((link) => link.trim() !== "");

    // Determine cause of death (handle "other" option)
    const causeOfDeath = cause === "other" ? otherCauseDetails : cause;

    // Determine perpetrator (handle "other" option)
    const perpetratorInfo =
      perpetrator === "other" ? otherPerpetratorDetails : perpetrator;

    const caseData = {
      name: step1Data.name,
      age: parseInt(step1Data.age),
      gender: step1Data.gender,
      occupation: step1Data.occupation || "",
      story: step1Data.background || "",
      leftBehind,
      socialMediaLinks,
      locationName: step2Data.locationName,
      location: step2Data.location,
      causeOfDeath,
      circumstances: step2Data.circumstances,
      perpetrator: perpetratorInfo,
      evidenceDescription: perpetratorEvidence,
      witness_information: step2Data.witnesses || "",
      sourceOfInformation: step3Data.source,
      newsLinks: filteredNewsLinks,
      notes: step3Data.notes || "",
      date: step2Data.date,
      submittedBy: "anonymous", // Since this is anonymous submission
      relationshipToVictim: step3Data.relationshipToVictim,
      consentAgreed: step5Data.consentAgreed,
      safetyAcknowledged: step5Data.safetyAcknowledged,
    };

    return caseData;
  };

  // Function to handle case submission
  const submitCase = async () => {
    setIsSubmitting(true);
    try {
      const caseData = prepareCaseData();

      console.log("Preparing case submission with data:", caseData);

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add all case data fields
      Object.entries(caseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle arrays by stringifying them
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "object") {
            // Handle objects by stringifying them
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add files to FormData
      if (portraitPhoto && portraitPhoto instanceof File) {
        formData.append("portraitPhoto", portraitPhoto);
        console.log("Adding portrait photo:", portraitPhoto.name);
      }

      // Add additional photos
      additionalPhotos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append("additionalPhotos", photo);
        }
      });

      // Add proof of ID file
      const proofOfIdFile = getProofOfIdFile();
      if (proofOfIdFile && proofOfIdFile instanceof File) {
        formData.append("proofOfId", proofOfIdFile);
        console.log("Adding proof of ID:", proofOfIdFile.name);
      }

      // Add proof of death file
      const proofOfDeathFile = getProofOfDeathFile();
      if (proofOfDeathFile && proofOfDeathFile instanceof File) {
        formData.append("proofOfDeath", proofOfDeathFile);
        console.log("Adding proof of death:", proofOfDeathFile.name);
      }

      // Add additional evidence file
      const additionalEvidenceFile = getAdditionalEvidenceFile();
      if (additionalEvidenceFile && additionalEvidenceFile instanceof File) {
        formData.append("additionalEvidence", additionalEvidenceFile);
        console.log("Adding additional evidence:", additionalEvidenceFile.name);
      }

      console.log("FormData prepared for submission");

      // Submit using Redux RTK Query
      const result = await createCase(formData).unwrap();

      if (result?.data?.case?.generated_id) {
        // Generate case number from the returned ID
        const caseNumber = result.data.case.generated_id;

        const description = t("caseNumberGenerated") + ": " + caseNumber;

        toast({
          title: t("caseSubmittedSuccessfully"),
          description,
        });

        // Navigate to success page with case number
        navigate(`/case-submitted?caseNumber=${caseNumber}`);
      }
    } catch (error: unknown) {
      console.error("Error submitting case:", error);

      // More detailed error logging
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : t("pleaseCheckFormAndTryAgain");
      toast({
        title: t("submissionError"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger();

        if (isValid) {
          setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
        break;
      case 2:
        isValid = await step2Form.trigger();
        if (isValid) {
          setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
        break;
      case 3:
        isValid = await step3Form.trigger();
        if (isValid) {
          syncFormData(); // Sync data for preview
          setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
        break;
      case 4:
        isValid = await step4Form.trigger();
        if (isValid) {
          setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
        break;
      case 5:
        isValid = await step5Form.trigger();

        console.log(step5Form.formState.errors);
        if (isValid) {
          // Submit the case instead of just navigating
          await submitCase();
        }
        break;
    }
  };

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
                {currentStep === 1 && t("victimInformation")}
                {currentStep === 2 && t("incidentDetails")}
                {currentStep === 3 && t("documentation")}
                {currentStep === 4 && t("preview")}
                {currentStep === 5 && t("reviewSubmit")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <FirstStep
                  form={step1Form}
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
                  portraitPhoto={portraitPhoto}
                  setPortraitPhoto={setPortraitPhoto}
                />
              )}

              {currentStep === 2 && (
                <SecondStep
                  form={step2Form}
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
                  form={step3Form}
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
                  form={step4Form}
                  formData={formData}
                  additionalPhotos={additionalPhotos}
                  evidenceFiles={evidenceFiles}
                  isGraphicContent={isGraphicContent}
                  portraitPhoto={portraitPhoto}
                  proofOfIdFiles={proofOfIdFiles}
                  proofOfDeathFiles={proofOfDeathFiles}
                  additionalEvidenceFiles={additionalEvidenceFiles}
                  familyCounts={familyCounts}
                  socialMediaUrls={socialMediaUrls}
                  newsLinks={newsLinks}
                  cause={cause}
                  otherCauseDetails={otherCauseDetails}
                  perpetrator={perpetrator}
                  otherPerpetratorDetails={otherPerpetratorDetails}
                />
              )}

              {currentStep === 5 && (
                <SubmittionSummary
                  form={step5Form}
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
                  {currentLanguage === "ar" ? (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  ) : (
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  )}
                  {t("previous")}
                </Button>

                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    {t("next")}
                    {currentLanguage === "ar" ? (
                      <ArrowLeft className="w-4 h-4 ml-2" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {isSubmitting ? t("submitting") : t("submitDocumentation")}
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
