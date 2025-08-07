import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/translations";
import { useLanguage } from "../LanguageSelector";

export default function ReviewSubmittedCase() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {t("alreadySubmittedACase")}
          </h4>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            {t("reviewYourSubmissionAddAdditionalInformationOrRequestChanges")}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/review-case">{t("reviewSubmittedCase")}</Link>
        </Button>
      </div>
    </div>
  );
}
