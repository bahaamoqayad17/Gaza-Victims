import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  ArrowLeft,
  HelpCircle,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";
import { VictimCard } from "@/components/VictimCard";
import { Footer } from "@/components/Footer";
import sarahPortrait from "@/assets/sarah-portrait.jpg";
import { useGetAllCasesQuery } from "@/store/api/apiSlice";

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

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [causeFilter, setCauseFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(12); // Cases per page
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Build query parameters for API
  const queryParams = {
    page: currentPage,
    limit,
    sort:
      sortBy === "recent"
        ? "-createdAt"
        : sortBy === "alphabetical"
        ? "name"
        : "age",
    ...(searchTerm && { name: searchTerm }), // Search by name using regex
    ...(statusFilter !== "all" &&
      statusFilter !== "thirdPartyVerified" && { status: statusFilter }),
    ...(statusFilter === "thirdPartyVerified" && {
      isThirdPartyVerified: true,
    }),
    ...(causeFilter !== "all" && { causeOfDeath: causeFilter }),
  };

  const { data, isLoading, error } = useGetAllCasesQuery(queryParams);

  // Transform backend cases to VictimCard format
  const cases = data?.data?.cases?.map(transformCaseToVictim) || [];
  const pagination = data?.pagination;

  // Extract unique statuses and causes from all cases (for filter options)
  // Note: In a real app, you might want to get these from a separate endpoint
  const uniqueStatuses = ["pending", "verified", "investigating", "documented"];
  const uniqueCauses = [
    "bombing",
    "airstrike",
    "chemicalAttack",
    "execution",
    "landmine",
    "policeBrutality",
    "targetedKilling",
    "civilUnrest",
    "siege",
  ];

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "status") setStatusFilter(value);
    if (filterType === "cause") setCauseFilter(value);
    if (filterType === "sort") setSortBy(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cases...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
              <p>Error loading cases. Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Filters */}
          <div className="border-b bg-muted/50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t("searchBy")}
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allStatus")}</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(status as keyof typeof t)}
                      </SelectItem>
                    ))}
                    <SelectItem value="thirdPartyVerified">
                      {t("thirdPartyVerified")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={causeFilter}
                  onValueChange={(value) => handleFilterChange("cause", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Cause of Death" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allCauses")}</SelectItem>
                    {uniqueCauses.map((cause) => (
                      <SelectItem key={cause} value={cause}>
                        {t(cause as keyof typeof t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={sortBy}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">{t("mostRecent")}</SelectItem>
                    <SelectItem value="alphabetical">
                      {t("alphabetical")}
                    </SelectItem>
                    <SelectItem value="age">{t("byAge")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="container mx-auto px-4 py-8">
            <p className="text-sm text-muted-foreground mb-4">
              {t("allCasesVetted")}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-muted-foreground">
                {pagination &&
                  ` (Showing ${
                    (pagination.currentPage - 1) * pagination.limit + 1
                  }-${Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalCases
                  )})`}
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/upload">{t("submitCase")}</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/review-case">{t("reviewSubmittedCase")}</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/download-archive">
                    <Download className="w-4 h-4 mr-2" />
                    {t("downloadArchive")}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/map">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t("mapView")}
                  </Link>
                </Button>
              </div>
            </div>

            <TooltipProvider>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cases.map((victim) => (
                  <VictimCard
                    key={victim.id}
                    victim={{
                      ...victim,
                      _id: victim.id,
                      familyRelationship:
                        victim.familyRelationship
                          ?.map((relationship) =>
                            t(relationship as keyof typeof t)
                          )
                          .join(", ") || "",
                    }}
                    showReportButton={true}
                  />
                ))}
              </div>
            </TooltipProvider>

            {/* Real Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {t("previous")}
                  </Button>

                  {/* Page numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      const pageNum = startPage + i;
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {t("next")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default Browse;
