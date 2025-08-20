import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import InteractiveMap from "@/components/InteractiveMap";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGetCasesLocationsQuery } from "@/store/api/apiSlice";
import { useTranslation } from "@/lib/translations";

const Map = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Fetch all case locations for the map
  const { data, isLoading, error } = useGetCasesLocationsQuery();

  const mapData = data?.data
    ? {
        locations: data.data.locations,
        totalLocations: data.data.totalLocations,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Map Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("backToHome") || "Back to Home"}
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">
              {t("casesMap") || "Cases Map"}
            </h1>
          </div>

          {data?.data && (
            <div className="text-muted-foreground space-y-1">
              <p>
                {t("showingLocations") || "Showing"}{" "}
                {data.data.locations?.length || 0}{" "}
                {t("locations") || "locations"} ({data.data.totalLocations || 0}{" "}
                {t("totalLocations") || "total unique locations"})
              </p>
              <p>
                {data.data.totalCasesWithLocation || 0}{" "}
                {t("casesWithLocation") || "cases have location data"}
              </p>
              <p className="text-xs">
                {t("lastUpdated") || "Last updated"}:{" "}
                {new Date(data.data.lastUpdated).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {t("loadingMap") || "Loading map data..."}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <p>
                  {t("errorLoadingMap") ||
                    "Error loading map data. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Map */}
        {!isLoading && !error && mapData && (
          <InteractiveMap mapData={mapData} />
        )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          (!mapData ||
            !mapData.locations ||
            mapData.locations.length === 0) && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground">
                <p>{t("noLocationsFound") || "No case locations found."}</p>
              </div>
            </div>
          )}
      </div>

      <Footer />
    </div>
  );
};

export default Map;
