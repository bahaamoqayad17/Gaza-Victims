import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { useEffect } from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
  showSidebar?: boolean;
}

export const Header = ({ onMenuToggle, showSidebar = false }: HeaderProps) => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Set RTL for Arabic and Farsi
  useEffect(() => {
    if (currentLanguage === "ar" || currentLanguage === "fa") {
      document.body.setAttribute("dir", "rtl");
    } else {
      document.body.setAttribute("dir", "ltr");
    }
  }, [currentLanguage]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return t("archive");
      case "/browse":
        return t("cases");
      case "/map":
        return t("map");
      case "/upload":
        return t("submitDocumentation");
      case "/about":
        return t("about");
      case "/legal":
        return "Legal Information";
      case "/download":
        return "Download Archive";
      case "/report":
        return t("reportCase");
      default:
        if (location.pathname.startsWith("/case/")) {
          return t("caseDetails");
        }
        return t("archive");
    }
  };

  const isActivePage = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Mobile: Two-line header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rtl:order-last"
                  onClick={onMenuToggle}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-lg font-bold truncate">
                  {location.pathname === "/" ? (
                    getPageTitle()
                  ) : (
                    <>
                      <span className="text-muted-foreground">
                        {t("archive")}
                      </span>
                      <span className="text-muted-foreground mx-2">•</span>
                      <span>{getPageTitle()}</span>
                    </>
                  )}
                </h1>
              </Link>
            </div>
          </div>
          {/* Mobile navigation - second line */}
          <div className="flex justify-center items-center gap-4 pb-3 text-sm font-medium border-t pt-2">
            <Link
              to="/browse"
              className={`px-2 py-1 rounded transition-colors ${
                isActivePage("/browse")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("cases")}
            </Link>
            <Link
              to="/map"
              className={`px-2 py-1 rounded transition-colors ${
                isActivePage("/map")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("map")}
            </Link>
            <Link
              to="/upload"
              className={`px-2 py-1 rounded transition-colors ${
                isActivePage("/upload")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("submitDocumentation")}
            </Link>
            <Link
              to="/about"
              className={`px-2 py-1 rounded transition-colors ${
                isActivePage("/about")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("about")}
            </Link>
          </div>
        </div>

        {/* Desktop: Single-line header */}
        <div className="hidden sm:flex items-center justify-between py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {showSidebar && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-1"
                onClick={onMenuToggle}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
                {location.pathname === "/" ? (
                  t("archive")
                ) : (
                  <>
                    <span className="text-muted-foreground">
                      {t("archive")}
                    </span>
                    <span className="text-muted-foreground mx-2">•</span>
                    <span>{getPageTitle()}</span>
                  </>
                )}
              </h1>
            </Link>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <Link
              to="/browse"
              className={`text-xs sm:text-sm px-1 sm:px-2 py-1 rounded transition-colors ${
                isActivePage("/browse")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("cases")}
            </Link>
            <Link
              to="/map"
              className={`text-xs sm:text-sm px-1 sm:px-2 py-1 rounded transition-colors ${
                isActivePage("/map")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("map")}
            </Link>
            <Link
              to="/upload"
              className={`text-xs sm:text-sm px-1 sm:px-2 py-1 rounded transition-colors ${
                isActivePage("/upload")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("submitDocumentation")}
            </Link>
            <Link
              to="/about"
              className={`text-xs sm:text-sm px-1 sm:px-2 py-1 rounded transition-colors hidden md:inline-block ${
                isActivePage("/about")
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("about")}
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
};
