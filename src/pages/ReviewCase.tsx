import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertTriangle,
  Search,
  Flag,
  Trash2,
  ChevronDown,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import {
  useGetCaseByGeneratedIdQuery,
  useGetCaseStatusMutation,
  Case,
} from "@/store/api/apiSlice";
import { MobileTooltip } from "@/components/MobileTooltip";
import { useTranslation } from "@/lib/translations";

const ReviewCase = () => {
  const { t } = useTranslation();
  const [caseNumber, setCaseNumber] = useState("");
  const [caseFound, setCaseFound] = useState(false);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [caseStatus, setCaseStatus] = useState<{
    isVerified: boolean;
    isThirdPartyVerified: boolean;
    isDigitalForensicsVerified: boolean;
    status: string;
  } | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [deletionReason, setDeletionReason] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [flaggedErrors, setFlaggedErrors] = useState<string[]>([]);
  const [isDeletionOpen, setIsDeletionOpen] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [deletionCaptchaValue, setDeletionCaptchaValue] = useState<
    string | null
  >(null);

  // API hooks
  const {
    data: caseData,
    isLoading: isCaseLoading,
    error: caseError,
  } = useGetCaseByGeneratedIdQuery(caseNumber, {
    skip: !caseFound || !caseNumber.trim(),
  });

  const [getCaseStatus, { isLoading: isStatusLoading }] =
    useGetCaseStatusMutation();

  // Handle case data loading
  useEffect(() => {
    if (caseData?.status === "success" && caseData.data?.case) {
      setCurrentCase(caseData.data.case);
    } else if (caseError) {
      setCaseFound(false);
      setCurrentCase(null);
      setCaseStatus(null);
      toast.error("Case not found");
    }
  }, [caseData, caseError]);

  const handleSearchCase = async () => {
    if (!caseNumber.trim()) {
      toast.error("Please enter a valid case number");
      return;
    }

    try {
      // First, try to find the case
      setCaseFound(true); // This will trigger the query

      // Wait for the case data to load
      // The useGetCaseByGeneratedIdQuery will handle the actual API call

      // Also get the case status
      const statusResult = await getCaseStatus({
        generated_id: caseNumber.trim(),
      });

      if (statusResult.data?.status === "success") {
        setCaseStatus(statusResult.data.data!);
        toast.success("Case found successfully");
      }
    } catch (error) {
      console.error("Error searching for case:", error);
      setCaseFound(false);
      setCurrentCase(null);
      setCaseStatus(null);
      toast.error("Case not found or an error occurred");
    }
  };

  const handleAddAdditionalInfo = () => {
    if (additionalInfo.trim() || additionalFiles.length > 0) {
      // In real app would send to backend
      toast.success("Additional information submitted successfully");
      setAdditionalInfo("");
      setAdditionalFiles([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAdditionalFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequestDeletion = () => {
    if (deletionReason.trim()) {
      // In real app would send deletion request to backend
      toast.success(
        "Deletion request submitted. We will review your request and get back to you."
      );
      setDeletionReason("");
      setContactEmail("");
    } else {
      toast.error("Please provide a reason for deletion request");
    }
  };

  const handleFlagError = (field: string) => {
    setFlaggedErrors((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Review Submitted Case
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isCaseLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading case data...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Victim Information */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Case Status Information
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-x-1 gap-y-2 mb-2 text-xs">
                    <MobileTooltip content={t("documentedDescription")}>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300">
                        {t("documented")}
                      </span>
                    </MobileTooltip>
                    {caseStatus?.isVerified ? (
                      <MobileTooltip content={t("verifiedDescription")}>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">
                          {t("verified")}
                        </span>
                      </MobileTooltip>
                    ) : (
                      <MobileTooltip content={t("notVerifiedDescription")}>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">
                          {t("notVerified")}
                        </span>
                      </MobileTooltip>
                    )}
                    {caseStatus?.isThirdPartyVerified ? (
                      <MobileTooltip content={t("thirdPartyDescription")}>
                        <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">
                          {t("thirdPartyVerified")}
                        </span>
                      </MobileTooltip>
                    ) : (
                      <MobileTooltip content={t("notThirdPartyDescription")}>
                        <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">
                          {t("notThirdPartyVerified")}
                        </span>
                      </MobileTooltip>
                    )}
                    {caseStatus?.isDigitalForensicsVerified ? (
                      <MobileTooltip content={t("digitalForensicsDescription")}>
                        <span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 border border-cyan-300">
                          {t("digitalForensicsVerified")}
                        </span>
                      </MobileTooltip>
                    ) : (
                      <MobileTooltip
                        content={t("notDigitalForensicsDescription")}
                      >
                        <span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 border border-cyan-300">
                          {t("notDigitalForensicsVerified")}
                        </span>
                      </MobileTooltip>
                    )}
                  </div>

                  {/* <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        Victim Information
                      </h3>
                      <Badge variant="outline">
                        {caseStatus?.status || currentCase?.status || "Unknown"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Case Number</Label>
                            <p className="text-sm">
                              {currentCase?.generated_id}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("caseNumber")}
                            className={
                              flaggedErrors.includes("caseNumber")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Name</Label>
                            <p className="text-sm">{currentCase?.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("name")}
                            className={
                              flaggedErrors.includes("name")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Age</Label>
                            <p className="text-sm">{currentCase?.age}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("age")}
                            className={
                              flaggedErrors.includes("age")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Gender</Label>
                            <p className="text-sm">{currentCase?.gender}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("gender")}
                            className={
                              flaggedErrors.includes("gender")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Occupation</Label>
                            <p className="text-sm">
                              {currentCase?.occupation || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("occupation")}
                            className={
                              flaggedErrors.includes("occupation")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">
                              Family Relationships
                            </Label>
                            <div className="text-sm space-y-1">
                              {currentCase?.leftBehind &&
                              currentCase.leftBehind.length > 0 ? (
                                currentCase.leftBehind.map(
                                  (relation, index) => (
                                    <p key={index}>• {relation}</p>
                                  )
                                )
                              ) : (
                                <p>Not provided</p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("family")}
                            className={
                              flaggedErrors.includes("family")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Background</Label>
                            <p className="text-sm">
                              {currentCase?.story || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("background")}
                            className={
                              flaggedErrors.includes("background")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Photos and Media */}
                  {/* <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Photos and Media
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Portrait Photo</Label>
                          <div className="mt-2">
                            {currentCase?.portraitPhoto ? (
                              <img
                                src={currentCase.portraitPhoto}
                                alt="Portrait"
                                className="w-32 h-40 object-cover rounded border"
                              />
                            ) : (
                              <div className="w-32 h-40 bg-gray-200 rounded border flex items-center justify-center">
                                <span className="text-sm text-gray-500">
                                  No photo
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("portrait")}
                          className={
                            flaggedErrors.includes("portrait")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Additional Photos
                          </Label>
                          <div className="flex gap-2 mt-2">
                            {currentCase?.additionalAttachments &&
                            currentCase.additionalAttachments.length > 0 ? (
                              currentCase.additionalAttachments.map(
                                (attachment, index) => (
                                  <img
                                    key={index}
                                    src={attachment}
                                    alt={`Additional ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                )
                              )
                            ) : (
                              <p className="text-sm text-gray-500">
                                No additional photos
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("additionalPhotos")}
                          className={
                            flaggedErrors.includes("additionalPhotos")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Social Media URLs
                          </Label>
                          <div className="text-sm space-y-1">
                            {currentCase?.socialMediaLinks &&
                            currentCase.socialMediaLinks.length > 0 ? (
                              currentCase.socialMediaLinks.map((url, index) => (
                                <p key={index}>
                                  •{" "}
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {url}
                                  </a>
                                </p>
                              ))
                            ) : (
                              <p>Not provided</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("socialMedia")}
                          className={
                            flaggedErrors.includes("socialMedia")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div> */}

                  {/* Incident Details */}
                  {/* <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Incident Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">
                              Date of Incident
                            </Label>
                            <p className="text-sm">
                              {currentCase?.date || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("date")}
                            className={
                              flaggedErrors.includes("date")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Location</Label>
                            <p className="text-sm">
                              {currentCase?.locationName ||
                                (currentCase?.location
                                  ? `${currentCase.location.lat}, ${currentCase.location.lng}`
                                  : "Not provided")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("location")}
                            className={
                              flaggedErrors.includes("location")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">
                              Cause of Death
                            </Label>
                            <p className="text-sm">
                              {currentCase?.causeOfDeath || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("cause")}
                            className={
                              flaggedErrors.includes("cause")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Perpetrator</Label>
                            <p className="text-sm">
                              {currentCase?.perpetrator || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("perpetrator")}
                            className={
                              flaggedErrors.includes("perpetrator")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">
                              Perpetrator Evidence
                            </Label>
                            <p className="text-sm">
                              {currentCase?.evidenceDescription ||
                                "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleFlagError("perpetratorEvidence")
                            }
                            className={
                              flaggedErrors.includes("perpetratorEvidence")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Circumstances</Label>
                            <p className="text-sm">
                              {currentCase?.circumstances || "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("circumstances")}
                            className={
                              flaggedErrors.includes("circumstances")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">
                              Witness Information
                            </Label>
                            <p className="text-sm">
                              {currentCase?.witness_information ||
                                "Not provided"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError("witnesses")}
                            className={
                              flaggedErrors.includes("witnesses")
                                ? "text-red-500"
                                : ""
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Documentation and Evidence */}
                  {/* <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Documentation and Evidence
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Proof of ID Files
                          </Label>
                          <div className="text-sm space-y-1">
                            {currentCase?.proofOfIdFiles &&
                            currentCase.proofOfIdFiles.length > 0 ? (
                              currentCase.proofOfIdFiles.map((file, index) => (
                                <p key={index}>• {file}</p>
                              ))
                            ) : (
                              <p>Not provided</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("proofOfId")}
                          className={
                            flaggedErrors.includes("proofOfId")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Proof of Death Files
                          </Label>
                          <div className="text-sm space-y-1">
                            {currentCase?.proofOfDeathFiles &&
                            currentCase.proofOfDeathFiles.length > 0 ? (
                              currentCase.proofOfDeathFiles.map(
                                (file, index) => <p key={index}>• {file}</p>
                              )
                            ) : (
                              <p>Not provided</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("proofOfDeath")}
                          className={
                            flaggedErrors.includes("proofOfDeath")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Additional Evidence Files
                          </Label>
                          <div className="text-sm space-y-1">
                            {currentCase?.additionalEvidenceFiles &&
                            currentCase.additionalEvidenceFiles.length > 0 ? (
                              currentCase.additionalEvidenceFiles.map(
                                (file, index) => <p key={index}>• {file}</p>
                              )
                            ) : (
                              <p>Not provided</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("additionalEvidence")}
                          className={
                            flaggedErrors.includes("additionalEvidence")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            News Article Links
                          </Label>
                          <div className="text-sm space-y-1">
                            {currentCase?.newsLinks &&
                            currentCase.newsLinks.length > 0 ? (
                              currentCase.newsLinks.map((link, index) => (
                                <p key={index}>
                                  •{" "}
                                  <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {link}
                                  </a>
                                </p>
                              ))
                            ) : (
                              <p>Not provided</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("newsLinks")}
                          className={
                            flaggedErrors.includes("newsLinks")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Source of Information
                          </Label>
                          <p className="text-sm">
                            {currentCase?.sourceOfInformation || "Not provided"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("source")}
                          className={
                            flaggedErrors.includes("source")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">
                            Additional Notes
                          </Label>
                          <p className="text-sm">
                            {currentCase?.notes || "Not provided"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError("additionalNotes")}
                          className={
                            flaggedErrors.includes("additionalNotes")
                              ? "text-red-500"
                              : ""
                          }
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div> */}

                  {flaggedErrors.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <Flag className="h-4 w-4 inline mr-1" />
                        You have flagged {flaggedErrors.length} field(s) as
                        containing errors. These will be reviewed by our team.
                      </p>
                    </div>
                  )}

                  {/* Add Additional Information */}
                  {/* <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Add Additional Information
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div>
                        <Label htmlFor="additionalInfo">
                          Additional Information
                        </Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Provide any new information or corrections to your
                          original submission
                        </p>
                        <Textarea
                          id="additionalInfo"
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder="Enter additional information, corrections, or updates..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Upload Supporting Files</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload any documents, images, or other files that
                          support your additional information
                        </p>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            id="additional-file-upload"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.wav"
                          />
                          <label
                            htmlFor="additional-file-upload"
                            className="cursor-pointer"
                          >
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload files or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Supports: PDF, DOC, DOCX, Images, Videos, Audio
                              files
                            </p>
                          </label>
                        </div>

                        {additionalFiles.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">
                              Selected Files:
                            </p>
                            <div className="space-y-2">
                              {additionalFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-muted p-2 rounded"
                                >
                                  <span className="text-sm truncate">
                                    {file.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="consent"
                          checked={consentAgreed}
                          onCheckedChange={(checked) =>
                            setConsentAgreed(checked as boolean)
                          }
                        />
                        <Label htmlFor="consent" className="text-sm">
                          I confirm that I have the right to share this
                          information and any media content included
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="safety-acknowledgment"
                          checked={safetyAcknowledged}
                          onCheckedChange={(checked) =>
                            setSafetyAcknowledged(checked as boolean)
                          }
                          required
                        />
                        <Label
                          htmlFor="safety-acknowledgment"
                          className="text-sm leading-relaxed"
                        >
                          <span className="font-medium text-red-600">
                            Safety Acknowledgment:
                          </span>{" "}
                          I understand and acknowledge that I am solely
                          responsible for my own safety and security when
                          submitting this documentation. I take full
                          responsibility for any risks associated with my
                          submission, including but not limited to potential
                          retaliation, legal consequences, or other harm. The
                          platform provides no guarantee of protection and
                          assumes no responsibility for any consequences,
                          whether immediate or future, that may arise from my
                          act of submission.
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          ⚠️ Please ensure all information is accurate and that
                          you have the right to share this documentation.
                        </p>
                      </div>

                      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                          <span className="font-semibold">
                            IMPORTANT SAFETY NOTICE:
                          </span>{" "}
                          By proceeding with this submission, you acknowledge
                          that you are taking this action at your own risk and
                          discretion. This platform cannot and does not provide
                          any guarantees regarding your safety, anonymity, or
                          protection from potential consequences. You are
                          strongly advised to take all necessary precautions to
                          protect yourself and consult with appropriate security
                          professionals if you have concerns about your safety.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={(value) => setCaptchaValue(value)}
                        onExpired={() => setCaptchaValue(null)}
                      />
                    </div>

                    <Button
                      onClick={handleAddAdditionalInfo}
                      disabled={
                        !consentAgreed ||
                        !safetyAcknowledged ||
                        !captchaValue ||
                        (!additionalInfo.trim() && additionalFiles.length === 0)
                      }
                    >
                      Submit Additional Information
                    </Button>
                  </div> */}

                  {/* Request Case Deletion */}
                  {/* <div className="border-t pt-6">
                    <Collapsible
                      open={isDeletionOpen}
                      onOpenChange={setIsDeletionOpen}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/20"
                        >
                          <span className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Request Case Deletion
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isDeletionOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="deletionReason">
                                Reason for Deletion Request
                              </Label>
                              <Textarea
                                id="deletionReason"
                                value={deletionReason}
                                onChange={(e) =>
                                  setDeletionReason(e.target.value)
                                }
                                placeholder="Please explain why you want this case to be deleted..."
                                rows={3}
                              />
                            </div>

                            <div>
                              <Label htmlFor="contactEmail">
                                Contact Email (Optional)
                              </Label>
                              <Input
                                id="contactEmail"
                                type="email"
                                value={contactEmail}
                                onChange={(e) =>
                                  setContactEmail(e.target.value)
                                }
                                placeholder="your.email@example.com"
                              />
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                              <p className="text-sm text-amber-800 dark:text-amber-200">
                                <AlertTriangle className="h-4 w-4 inline mr-1" />
                                <strong>Please note:</strong> The platform will
                                review your deletion request carefully. We will
                                try to get back to you as soon as possible, but
                                please be patient as this process may take some
                                time. Deletion requests are handled on a
                                case-by-case basis.
                              </p>
                            </div>

                            <div className="flex justify-center">
                              <ReCAPTCHA
                                sitekey={
                                  import.meta.env.VITE_RECAPTCHA_SITE_KEY
                                }
                                onChange={(value) =>
                                  setDeletionCaptchaValue(value)
                                }
                                onExpired={() => setDeletionCaptchaValue(null)}
                              />
                            </div>

                            <Button
                              onClick={handleRequestDeletion}
                              variant="destructive"
                              disabled={
                                !deletionReason.trim() || !deletionCaptchaValue
                              }
                            >
                              Submit Deletion Request
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div> */}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReviewCase;
