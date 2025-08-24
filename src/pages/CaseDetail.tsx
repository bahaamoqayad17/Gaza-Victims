import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Shield,
  AlertTriangle,
  Loader2,
  Download,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  useGetCaseByIdQuery,
  useDownloadCaseMutation,
} from "@/store/api/apiSlice";
import { useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { toast } from "@/hooks/use-toast";

const CaseDetail = () => {
  const { id } = useParams();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const {
    data: caseResponse,
    isLoading,
    isError,
    error,
  } = useGetCaseByIdQuery(id || "");

  const [downloadCase, { isLoading: isDownloading }] =
    useDownloadCaseMutation();

  const handleDownload = async () => {
    if (!caseData?.generated_id) return;

    try {
      const blob = await downloadCase({
        generated_id: caseData.generated_id,
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const caseName = caseData?.name?.replace(/[^a-zA-Z0-9]/g, "_") || "case";
      link.download = `case-${caseName}-${Date.now()}.zip`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your case file download has started.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Error",
        description: "Failed to download case file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{t("loadingCaseDetails")}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !caseResponse?.data?.case) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t("caseNotFound")}</h2>
            <p className="text-muted-foreground mb-4">
              {t("caseNotFoundDescription")}
            </p>
            <Button asChild>
              <Link to="/browse">{t("browseCases")}</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const caseData = caseResponse.data.case;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Victim Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t("victimProfile")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="aspect-[4/3] w-32 overflow-hidden bg-muted flex-shrink-0 mx-auto md:mx-0 rounded-lg">
                    {caseData.portraitPhoto ? (
                      <img
                        src={caseData.portraitPhoto}
                        alt={`${caseData.name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">
                          {t("noPhoto")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{caseData.name}</h3>
                      <p className="text-muted-foreground">
                        {t("age")} {caseData.age} • {caseData.gender} •{" "}
                        {caseData.occupation || "N/A"}
                      </p>
                      {caseData.leftBehind &&
                        caseData.leftBehind.length > 0 && (
                          <p className="text-muted-foreground italic text-sm mt-1">
                            {t("leftBehind")}: {caseData.leftBehind.join(", ")}
                          </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300">
                        {caseData.status}
                      </span>
                      {caseData.isVerified && (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">
                          {t("verified")}
                        </span>
                      )}
                      {caseData.isThirdPartyVerified && (
                        <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">
                          {t("thirdPartyVerified")}
                        </span>
                      )}
                      {caseData.isDigitalForensicsVerified && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 border border-purple-300">
                          {t("digitalForensicsVerified")}
                        </span>
                      )}
                      {caseData.proofOfId && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300">
                          {t("proofOfId")}
                        </span>
                      )}
                      {caseData.proofOfDeath && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300">
                          {t("proofOfDeath")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {caseData.locationName ||
                          (caseData.location
                            ? `${caseData.location.lat}, ${caseData.location.lng}`
                            : "N/A")}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {caseData.date
                          ? new Date(caseData.date).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {caseData.perpetrator && (
                        <div className="text-sm">
                          <span>
                            {t("perpetrator")}: {caseData.perpetrator}
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span>
                          {t("enforcedLegalResponse")}:
                          <span className="text-red-600">
                            {" "}
                            {t("none")}, {t("since")}{" "}
                            {Math.floor(
                              (new Date().getTime() -
                                new Date(caseData.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            {t("days")}
                          </span>
                        </span>
                      </div>
                      {caseData.newsLinks && caseData.newsLinks.length > 0 && (
                        <div className="text-sm">
                          <span>{t("incidentNewsStoryLabel")}: </span>
                          <a
                            href={caseData.newsLinks[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-xs"
                          >
                            {caseData.newsLinks[0]}
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-sm">
                      {caseData.story || t("noBackgroundInformation")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Their life in few images */}
            {caseData.additionalAttachments &&
              caseData.additionalAttachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("theirLifeInFewImages")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {caseData.additionalAttachments.map(
                        (attachment, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-muted rounded-lg overflow-hidden"
                          >
                            <img
                              src={attachment}
                              alt={`${caseData.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )
                      )}
                      {/* Fill remaining slots with placeholder if needed */}
                      {caseData.additionalAttachments.length < 6 && (
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            {t("noAdditionalImages")}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Incident Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t("incidentDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.causeOfDeath && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("causeOfDeath")}</h4>
                    <Badge variant="outline">{caseData.causeOfDeath}</Badge>
                  </div>
                )}

                <Separator />

                {caseData.circumstances && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("circumstances")}</h4>
                    <p className="text-sm leading-relaxed">
                      {caseData.circumstances}
                    </p>
                  </div>
                )}

                {caseData.witness_information && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">
                        {t("witnessInformation")}
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {caseData.witness_information}
                      </p>
                    </div>
                  </>
                )}

                {caseData.evidenceDescription && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">
                        {t("evidenceDescription")}
                      </h4>
                      <p className="text-sm leading-relaxed">
                        {caseData.evidenceDescription}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Proof of Identity */}
            {caseData.proofOfId && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("proofOfIdentity")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      {/* <div className="text-center filter blur-sm"> */}
                      <div className="text-center">
                        <img
                          src={caseData.proofOfId}
                          alt="Identity Document"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                    {/* <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="outline" size="sm">
                        {t("loginToView")}
                      </Button>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Proof of Death */}
            {caseData.proofOfDeath && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("proofOfDeath")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                      {/* <div className="text-center filter blur-sm"> */}
                      <div className="text-center">
                        <img
                          src={caseData.proofOfDeath}
                          alt="Death Certificate"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                    {/* <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Button variant="outline" size="sm" className="mb-2">
                        {t("loginToView")}
                      </Button>
                      {caseData.proofOfDeathGraphic && (
                        <p className="text-xs text-center text-amber-600 px-4">
                          {t("graphicContentWarning")}
                        </p>
                      )}
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Incident News Story */}
            {caseData.newsLinks && caseData.newsLinks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("incidentNewsStory")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("newsArticleScreenshot")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      {t("relatedNewsCoverage")}:
                    </h4>
                    <div className="space-y-1 text-sm">
                      {caseData.newsLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                        >
                          <span className="w-3 h-3">📰</span>
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Details */}
            {(caseData.location || caseData.locationName) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t("locationDetails")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("incidentLocation")}
                    </h4>
                    <p className="text-muted-foreground">
                      {caseData.locationName || t("locationProvided")}
                    </p>
                    {caseData.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("coordinates")}: {caseData.location.lat}° N,{" "}
                        {caseData.location.lng}° E
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("interactiveMapPlaceholder")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>{t("caseTimeline")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {caseData.date && (
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("incidentOccurred")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(caseData.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("caseSubmitted")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(caseData.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {caseData.isVerified && (
                    <div className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {t("caseVerified")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(caseData.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  {t("securityPrivacy")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>{t("submitterIdentityProtected")}</p>
                <p>{t("allDataEncrypted")}</p>
                <p>{t("verifiedByIndependentSources")}</p>
                <p>{t("suitableForLegalDocumentation")}</p>
              </CardContent>
            </Card>

            {/* Case Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("caseInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("caseId")}:</span>
                  <span className="font-mono">{caseData.generated_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("submitted")}:
                  </span>
                  <span>
                    {new Date(caseData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="text-xs">
                    {caseData.status}
                  </Badge>
                </div>
                {caseData.submittedBy && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("submittedBy")}:
                    </span>
                    <span>{caseData.submittedBy}</span>
                  </div>
                )}
                {caseData.relationshipToVictim && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("relationship")}:
                    </span>
                    <span>{caseData.relationshipToVictim}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t("actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  asChild
                >
                  <Link to="/report-additional">
                    {t("reportAdditionalInformation")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleDownload}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {"Downloading..."}
                    </>
                  ) : (
                    <>
                      <Download className="h-3 w-3 mr-1" />
                      {t("downloadCaseFile")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CaseDetail;
