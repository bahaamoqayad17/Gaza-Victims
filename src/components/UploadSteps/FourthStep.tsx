import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "../LanguageSelector";
import { useTranslation } from "@/lib/translations";

export default function FourthStep({
  form,
  formData,
  additionalPhotos,
  evidenceFiles,
  isGraphicContent,
  portraitPhoto,
  proofOfIdFiles,
  proofOfDeathFiles,
  additionalEvidenceFiles,
  familyCounts,
  socialMediaUrls,
  newsLinks,
  cause,
  otherCauseDetails,
  perpetrator,
  otherPerpetratorDetails,
}: {
  form?: unknown;
  formData: Record<string, unknown>;
  additionalPhotos: File[];
  evidenceFiles: File[];
  isGraphicContent: boolean;
  portraitPhoto: File | null;
  proofOfIdFiles: File[];
  proofOfDeathFiles: File[];
  additionalEvidenceFiles: File[];
  familyCounts: {
    daughters: number;
    sons: number;
    brothers: number;
    sisters: number;
    wife: boolean;
    husband: boolean;
    mother: boolean;
    father: boolean;
    grandfather: boolean;
    grandmother: boolean;
    other: boolean;
  };
  socialMediaUrls: string[];
  newsLinks: string[];
  cause: string;
  otherCauseDetails: string;
  perpetrator: string;
  otherPerpetratorDetails: string;
}) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <div className="space-y-6">
      <h4 className="font-semibold">{t("casePreview")}</h4>

      <Card>
        <CardHeader>
          <CardTitle>{t("victimInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">{t("name")}:</span>{" "}
            {(formData.name as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("age")}:</span>{" "}
            {(formData.age as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("selectGender")}:</span>{" "}
            {(formData.gender as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("occupation")}:</span>{" "}
            {(formData.occupation as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("background")}:</span>{" "}
            {(formData.background as string) || t("notProvided")}
          </p>
          {portraitPhoto && (
            <div>
              <span className="font-medium">{t("portraitPhoto")}:</span>{" "}
              {portraitPhoto.name}
            </div>
          )}
          {additionalPhotos.length > 0 && (
            <div>
              <span className="font-medium">{t("additionalPhotos")}:</span>{" "}
              {additionalPhotos.length} {t("uploaded")}
            </div>
          )}
          {(familyCounts.daughters > 0 ||
            familyCounts.sons > 0 ||
            familyCounts.brothers > 0 ||
            familyCounts.sisters > 0 ||
            familyCounts.wife ||
            familyCounts.husband ||
            familyCounts.mother ||
            familyCounts.father ||
            familyCounts.grandfather ||
            familyCounts.grandmother ||
            familyCounts.other) && (
            <div>
              <span className="font-medium">{t("theyLeaveBehind")}:</span>{" "}
              <div className="ml-4">
                {/* Countable family members */}
                {familyCounts.daughters > 0 && (
                  <p>
                    {familyCounts.daughters} daughter
                    {familyCounts.daughters > 1 ? "s" : ""}
                  </p>
                )}
                {familyCounts.sons > 0 && (
                  <p>
                    {familyCounts.sons} son{familyCounts.sons > 1 ? "s" : ""}
                  </p>
                )}
                {familyCounts.brothers > 0 && (
                  <p>
                    {familyCounts.brothers} brother
                    {familyCounts.brothers > 1 ? "s" : ""}
                  </p>
                )}
                {familyCounts.sisters > 0 && (
                  <p>
                    {familyCounts.sisters} sister
                    {familyCounts.sisters > 1 ? "s" : ""}
                  </p>
                )}
                {/* Single family members */}
                {familyCounts.wife && <p>wife</p>}
                {familyCounts.husband && <p>husband</p>}
                {familyCounts.mother && <p>mother</p>}
                {familyCounts.father && <p>father</p>}
                {familyCounts.grandfather && <p>grandfather</p>}
                {familyCounts.grandmother && <p>grandmother</p>}
                {familyCounts.other && <p>other relatives</p>}
              </div>
            </div>
          )}
          {socialMediaUrls.filter((url) => url.trim()).length > 0 && (
            <div>
              <span className="font-medium">Social Media Links:</span>{" "}
              {socialMediaUrls.filter((url) => url.trim()).length} provided
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("incidentDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">{t("date")}:</span>{" "}
            {(formData.date as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("location")}:</span>{" "}
            {(formData.location as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("causeOfDeath")}:</span>{" "}
            {cause === "other" ? otherCauseDetails : cause || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("circumstances")}:</span>{" "}
            {(formData.circumstances as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("perpetrator")}:</span>{" "}
            {perpetrator === "other"
              ? otherPerpetratorDetails
              : perpetrator || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("witnesses")}:</span>{" "}
            {(formData.witnesses as string) || t("notProvided")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("evidence")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {proofOfIdFiles.length > 0 && (
            <p>
              <span className="font-medium">{t("proofOfId")}:</span>{" "}
              {proofOfIdFiles.length} {t("uploaded")}
            </p>
          )}
          {proofOfDeathFiles.length > 0 && (
            <p>
              <span className="font-medium">{t("proofOfDeath")}:</span>{" "}
              {proofOfDeathFiles.length} {t("uploaded")}
            </p>
          )}
          {additionalEvidenceFiles.length > 0 && (
            <p>
              <span className="font-medium">{t("additionalEvidence")}:</span>{" "}
              {additionalEvidenceFiles.length} {t("uploaded")}
            </p>
          )}
          <p>
            <span className="font-medium">{t("graphicContent")}:</span>{" "}
            {isGraphicContent ? t("yes") : t("no")}
          </p>
          <p>
            <span className="font-medium">{t("source")}:</span>{" "}
            {(formData.source as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("relationshipToVictim")}:</span>{" "}
            {(formData.relationshipToVictim as string) || t("notProvided")}
          </p>
          {newsLinks.filter((link) => link.trim()).length > 0 && (
            <p>
              <span className="font-medium">News Links:</span>{" "}
              {newsLinks.filter((link) => link.trim()).length} provided
            </p>
          )}
          <p>
            <span className="font-medium">{t("notes")}:</span>{" "}
            {(formData.notes as string) || t("notProvided")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
