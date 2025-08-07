import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "../LanguageSelector";
import { useTranslation } from "@/lib/translations";

export default function FourthStep({
  form,
  formData,
  additionalPhotos,
  evidenceFiles,
  isGraphicContent,
}: {
  form?: unknown;
  formData: Record<string, unknown>;
  additionalPhotos: File[];
  evidenceFiles: File[];
  isGraphicContent: boolean;
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
            <span className="font-medium">{t("occupation")}:</span>{" "}
            {(formData.occupation as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("background")}:</span>{" "}
            {(formData.background as string) || t("notProvided")}
          </p>
          {additionalPhotos.length > 0 && (
            <div>
              <span className="font-medium">{t("additionalPhotos")}:</span>{" "}
              {additionalPhotos.length} {t("uploaded")}
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
            <span className="font-medium">{t("circumstances")}:</span>{" "}
            {(formData.circumstances as string) || t("notProvided")}
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
          <p>
            <span className="font-medium">{t("files")}:</span>{" "}
            {evidenceFiles.length} {t("uploaded")}
          </p>
          <p>
            <span className="font-medium">{t("graphicContent")}:</span>{" "}
            {isGraphicContent ? t("yes") : t("no")}
          </p>
          <p>
            <span className="font-medium">{t("source")}:</span>{" "}
            {(formData.source as string) || t("notProvided")}
          </p>
          <p>
            <span className="font-medium">{t("notes")}:</span>{" "}
            {(formData.notes as string) || t("notProvided")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
