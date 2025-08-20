import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";

export const Footer = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-3">{t("platform")}</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/browse"
                className="block text-muted-foreground hover:text-foreground"
              >
                {t("browseCases")}
              </Link>
              <Link
                to="/map"
                className="block text-muted-foreground hover:text-foreground"
              >
                {t("mapView")}
              </Link>
              <Link
                to="/upload"
                className="block text-muted-foreground hover:text-foreground"
              >
                {t("submitDocumentation")}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">{t("information")}</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/about"
                className="block text-muted-foreground hover:text-foreground"
              >
                {t("aboutUs")}
              </Link>
              <Link
                to="/legal"
                className="block text-muted-foreground hover:text-foreground"
              >
                {t("legalInformation")}
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground space-y-2 md:space-y-0">
          <p>
            © 2025 {t("archive")}. {t("allRightsReserved")}
          </p>
          <div className="text-center md:text-right">
            <p>{t("dedicatedToMemory")}</p>
            <p className="text-xs">{t("voluntaryNonProfit")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
