import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileCheck, Clock, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import {
  ModeratorsTab,
  PendingCasesTab,
  VerificationSettingsTab,
  ThirdPartyReviewCasesTab,
  DigitalForensicsReviewCasesTab,
  CasesUnderReviewTab,
  VerifiedCasesTab,
} from "@/components/TabsMods";
import { useGetDashboardStatsQuery } from "@/store/api/apiSlice";

const ModeratorsDashboard = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Fetch dashboard stats
  const { data: statsResponse, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const stats = statsResponse?.data;

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t("moderatorsDashboard")}</h1>
            <p className="text-muted-foreground">
              {t("manageCaseVerification")}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("totalModerators")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.users.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("pendingReviews")}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.cases.pending || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("casesVerifiedToday")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.cases.verifiedToday || 0}
              </div>
              <p className="text-xs text-muted-foreground">Verified today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("activeVerifiers")}
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.users.activeVerifiers || 0}
              </div>
              <p className="text-xs text-muted-foreground">Active verifiers</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="moderators" className="space-y-6">
          <TabsList>
            <TabsTrigger value="moderators">{t("moderators")}</TabsTrigger>
            <TabsTrigger value="pending-cases">{t("pendingCases")}</TabsTrigger>
            <TabsTrigger value="cases-under-review">
              Cases Under Review
            </TabsTrigger>
            <TabsTrigger value="third-party-review-cases">
              Third Party Review Cases
            </TabsTrigger>
            <TabsTrigger value="digital-forensics-review-cases">
              Digital Forensics Review Cases
            </TabsTrigger>
            <TabsTrigger value="verified-cases">Verified Cases</TabsTrigger>
            <TabsTrigger value="verification-settings">
              Verification Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="moderators" className="space-y-6">
            <ModeratorsTab />
          </TabsContent>

          <TabsContent value="pending-cases" className="space-y-6">
            <PendingCasesTab />
          </TabsContent>

          <TabsContent value="cases-under-review" className="space-y-6">
            <CasesUnderReviewTab />
          </TabsContent>

          <TabsContent value="third-party-review-cases" className="space-y-6">
            <ThirdPartyReviewCasesTab />
          </TabsContent>

          <TabsContent
            value="digital-forensics-review-cases"
            className="space-y-6"
          >
            <DigitalForensicsReviewCasesTab />
          </TabsContent>

          <TabsContent value="verified-cases" className="space-y-6">
            <VerifiedCasesTab />
          </TabsContent>

          <TabsContent value="verification-settings" className="space-y-6">
            <VerificationSettingsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ModeratorsDashboard;
