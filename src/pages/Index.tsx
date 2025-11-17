import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  Clock,
  Menu,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VictimCard } from "@/components/VictimCard";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useTranslation } from "@/lib/translations";
import { formatDate } from "@/lib/dateUtils";
import sarahPortrait from "@/assets/sarah-portrait.jpg";
import { useGetHomePageDataQuery } from "@/store/api/apiSlice";

// Helper function to transform backend case data to VictimCard format
const transformCaseToVictim = (caseData: {
  _id: string;
  generated_id: string;
  name: string;
  age: number;
  gender: string;
  locationName?: string;
  location?: { lat: string; lng: string };
  date?: string;
  createdAt: string;
  status: string;
  causeOfDeath?: string;
  isVerified?: boolean;
  isThirdPartyVerified?: boolean;
  isDigitalForensicsVerified?: boolean;
  newsLinks?: string[];
  story?: string;
  circumstances?: string;
  leftBehind?: string[];
  occupation?: string;
  perpetrator?: string;
  portraitPhoto?: string;
  additionalAttachments?: string[];
}) => ({
  id: caseData._id,
  generated_id: caseData.generated_id,
  name: caseData.name,
  age: caseData.age,
  gender: caseData.gender,
  location:
    caseData.locationName ||
    `${caseData.location?.lat}, ${caseData.location?.lng}` ||
    "Unknown",
  date: caseData.date || caseData.createdAt,
  status: caseData.status,
  causeOfDeath: caseData.causeOfDeath || "Unknown",
  actionTaken: "pending", // Default value
  verified: caseData.isVerified || false,
  thirdPartyVerified: caseData.isThirdPartyVerified || false,
  digitalForensicsVerified: caseData.isDigitalForensicsVerified || false,
  newsLink: caseData.newsLinks?.[0] || "",
  lifeStory: caseData.story || "",
  deathDetails: caseData.circumstances || "",
  familyRelationship: caseData.leftBehind,
  occupation: caseData.occupation || "",
  perpetrator: caseData.perpetrator || "",
  images: [
    caseData.portraitPhoto,
    ...(caseData.additionalAttachments || []),
  ].filter(Boolean),
});
const Index = () => {
  const [expandedVictim, setExpandedVictim] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timelineScrollPosition, setTimelineScrollPosition] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2025");
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { data, isLoading, error } = useGetHomePageDataQuery({
    page: 1,
    limit: 10,
  });

  // Extract data from API response
  const homePageData = data?.data;
  const recentCases =
    homePageData?.recentCases?.map(transformCaseToVictim) || [];
  const timelineData =
    homePageData?.timelineData?.map((yearData) => ({
      year: yearData?._id?.toString(),
      months: yearData?.months.map((month) => ({
        name: month.name,
        cases: month.cases,
      })),
    })) || [];

  const statistics = homePageData?.statistics;
  const mapData = homePageData?.mapData;

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        showSidebar={true}
      />

      {/* Loading state */}
      {isLoading && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading homepage data...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>Error loading data. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {/* Show content only when data is loaded */}
      {!isLoading && !error && homePageData && (
        <>
          <div className="flex relative">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`
          ${
            sidebarOpen
              ? "translate-x-0 rtl:translate-x-0"
              : "-translate-x-full rtl:translate-x-full"
          }
          md:translate-x-0 md:rtl:translate-x-0
          fixed md:relative 
          z-50 md:z-auto
          w-64 md:w-48 lg:w-56 
          border-r rtl:border-r-0 rtl:border-l 
          bg-background md:bg-muted/20 
          min-h-screen 
          transition-transform duration-300 ease-in-out
        `}
            >
              <div className="p-3 lg:p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm md:text-base lg:text-lg font-semibold">
                      {t("timeline")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden h-6 w-6 p-0"
                      onClick={() => setSidebarOpen(false)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {timelineData.map((yearData) => (
                    <Collapsible key={yearData.year}>
                      <CollapsibleTrigger
                        className="flex w-full items-center justify-between text-left hover:bg-muted/50 p-2 rounded"
                        onClick={() => setSelectedYear(yearData.year)}
                      >
                        <span className="font-medium text-sm lg:text-base">
                          {yearData.year} (
                          {yearData.months.reduce(
                            (sum, month) => sum + month.cases,
                            0
                          )}
                          )
                        </span>
                        <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-2 lg:pl-4 space-y-1 rtl:pr-2 rtl:lg:pr-4 rtl:pl-0">
                        {yearData.months.map((month) => (
                          <Link
                            key={month.name}
                            to={`/browse?year=${yearData.year}&month=${month.name}`}
                            className="flex w-full items-center justify-between text-left text-xs lg:text-sm text-muted-foreground hover:text-foreground p-1 hover:bg-muted/30 rounded"
                          >
                            <span>{month.name}</span>
                            <span className="text-xs">({month.cases})</span>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Hero */}

              {/* Recent Cases */}
              <section className="py-8 md:py-16">
                <div className="container mx-auto px-4">
                  <div className="mb-8 md:mb-12">
                    <div className="max-w-4xl mx-auto text-center">
                      <p className="text-lg md:text-xl leading-relaxed text-foreground">
                        {t("asOf")}{" "}
                        <span className="font-mono text-red-600 font-bold">
                          {new Date().toLocaleDateString()}
                        </span>
                        , {t("thereAre")}{" "}
                        <span className="text-red-600 font-bold">
                          {statistics?.totalCases?.toLocaleString() || "0"}
                        </span>{" "}
                        <span className="text-red-600 font-bold">
                          {t("reportedFatalities")}
                        </span>{" "}
                        {t("inTheConflict")}.{t("ofThoseNumerous")}{" "}
                        <span className="text-red-600 font-bold">
                          {statistics?.verifiedCases?.toLocaleString() || "0"}{" "}
                          {t("confirmedCasesStatemurder")}
                        </span>
                        .
                      </p>
                      <p className="text-lg md:text-xl text-foreground">
                        {t("wePresentYou")}
                      </p>
                      <p className="text-lg md:text-xl text-red-600 font-bold">
                        {t("hardEvidence")}
                      </p>
                    </div>
                  </div>

                  {/* Mobile: Vertical scroll, Desktop: Grid */}
                  <div className="md:hidden space-y-4">
                    {recentCases.slice(0, 10).map((victim) => (
                      <VictimCard
                        key={victim.id}
                        victim={{
                          ...victim,
                          _id: victim.id,

                          familyRelationship: victim.familyRelationship
                            ?.map((relationship) =>
                              t(relationship as keyof typeof t)
                            )
                            .join(", "),
                        }}
                        showReportButton={true}
                        clickable={true}
                      />
                    ))}
                  </div>

                  <div className="hidden md:block">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                      {recentCases.slice(0, 10).map((victim) => (
                        <VictimCard
                          key={victim.id}
                          victim={{
                            ...victim,
                            _id: victim.id,
                            familyRelationship: victim.familyRelationship
                              ?.map((relationship) =>
                                t(relationship as keyof typeof t)
                              )
                              .join(", "),
                          }}
                          showReportButton={true}
                          clickable={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Interactive Map */}
              <section className="py-8">
                <div className="container mx-auto px-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
                    {t("recentCasesMap")}
                  </h3>
                  <InteractiveMap mapData={mapData} />
                </div>
              </section>

              {/* Stats */}
              <section className="py-8 md:py-16 bg-muted/20">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-8">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
                        <Link
                          to="/browse"
                          className="hover:text-foreground whitespace-nowrap"
                        >
                          <span className="font-bold text-2xl">
                            {statistics?.totalCases?.toLocaleString() || "0"}
                          </span>{" "}
                          {t("totalCases")}
                        </Link>
                        <span className="hidden md:inline">•</span>
                        <Link
                          to="/map"
                          className="hover:text-foreground whitespace-nowrap"
                        >
                          <span className="font-bold text-2xl">
                            {statistics?.uniqueLocations || "0"}
                          </span>{" "}
                          {t("locations")}
                        </Link>
                        <span className="hidden md:inline">•</span>
                        <Link
                          to="/browse?filter=verified"
                          className="hover:text-foreground whitespace-nowrap"
                        >
                          <span className="font-bold text-2xl">
                            {statistics?.verifiedCases?.toLocaleString() || "0"}
                          </span>{" "}
                          {t("verified") || "Verified"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Horizontal Timeline */}
              <section className="py-8 md:py-12 border-b">
                <div className="container mx-auto px-4">
                  <HorizontalTimeline timelineData={timelineData} />
                </div>
              </section>
            </main>
          </div>

          {/* Show More Button */}
          <div className="container mx-auto px-4 py-8 text-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/browse">{t("showMoreCases")}</Link>
            </Button>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};
export default Index;
