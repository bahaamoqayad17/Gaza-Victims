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
  ReportsTab,
  ContactsTab,
  DeleteRequestTab,
  InformationTab,
} from "@/components/TabsMods";
import { useGetDashboardStatsQuery } from "@/store/api/apiSlice";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const ModeratorsDashboard = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  // Get current user from auth state
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const userRole = currentUser?.role;

  // Fetch dashboard stats
  const { data: statsResponse, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const stats = statsResponse?.data;

  // Define role-based tab visibility
  const canViewAdminTabs =
    userRole === "admin" || userRole === "senior_moderator";
  const canViewModeratorTabs = userRole === "moderator";
  const canViewThirdPartyTabs = userRole === "third_party_moderator";
  const canViewDigitalForensicsTabs =
    userRole === "digital_forensics_moderator";

  // Determine default tab based on role
  const getDefaultTab = () => {
    if (canViewAdminTabs) return "moderators";
    if (canViewModeratorTabs) return "cases-under-review";
    if (canViewThirdPartyTabs) return "third-party-review-cases";
    if (canViewDigitalForensicsTabs) return "digital-forensics-review-cases";
    return "pending-cases"; // fallback
  };

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {t("moderatorsDashboard")}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("manageCaseVerification")}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogout()}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

        <Tabs defaultValue={getDefaultTab()} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 h-auto sm:h-10 overflow-x-auto sm:overflow-x-visible">
            {/* Admin and Senior Moderator only tabs */}
            {canViewAdminTabs && (
              <>
                <TabsTrigger
                  value="moderators"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  {t("moderators")}
                </TabsTrigger>
                <TabsTrigger
                  value="pending-cases"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  {t("pendingCases")}
                </TabsTrigger>
                <TabsTrigger
                  value="verified-cases"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Verified Cases
                </TabsTrigger>
                <TabsTrigger
                  value="verification-settings"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Verification Settings
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Reports
                </TabsTrigger>
                <TabsTrigger
                  value="contacts"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Contacts
                </TabsTrigger>
                <TabsTrigger
                  value="delete-requests"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Delete Requests
                </TabsTrigger>
                <TabsTrigger
                  value="informations"
                  className="text-xs sm:text-sm whitespace-nowrap"
                >
                  Additional Information Cases
                </TabsTrigger>
              </>
            )}

            {/* Moderator specific tab */}
            {(canViewModeratorTabs || canViewAdminTabs) && (
              <TabsTrigger
                value="cases-under-review"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Cases Under Review
              </TabsTrigger>
            )}

            {/* Third Party Moderator specific tab */}
            {(canViewThirdPartyTabs || canViewAdminTabs) && (
              <TabsTrigger
                value="third-party-review-cases"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Third Party Review Cases
              </TabsTrigger>
            )}

            {/* Digital Forensics Moderator specific tab */}
            {(canViewDigitalForensicsTabs || canViewAdminTabs) && (
              <TabsTrigger
                value="digital-forensics-review-cases"
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                Digital Forensics Review Cases
              </TabsTrigger>
            )}
          </TabsList>

          {/* Admin and Senior Moderator only content */}
          {canViewAdminTabs && (
            <>
              <TabsContent
                value="moderators"
                className="space-y-4 sm:space-y-6"
              >
                <ModeratorsTab />
              </TabsContent>

              <TabsContent
                value="pending-cases"
                className="space-y-4 sm:space-y-6"
              >
                <PendingCasesTab />
              </TabsContent>

              <TabsContent
                value="verified-cases"
                className="space-y-4 sm:space-y-6"
              >
                <VerifiedCasesTab />
              </TabsContent>

              <TabsContent
                value="verification-settings"
                className="space-y-4 sm:space-y-6"
              >
                <VerificationSettingsTab />
              </TabsContent>

              <TabsContent value="reports" className="space-y-4 sm:space-y-6">
                <ReportsTab />
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4 sm:space-y-6">
                <ContactsTab />
              </TabsContent>

              <TabsContent
                value="delete-requests"
                className="space-y-4 sm:space-y-6"
              >
                <DeleteRequestTab />
              </TabsContent>

              <TabsContent
                value="informations"
                className="space-y-4 sm:space-y-6"
              >
                <InformationTab />
              </TabsContent>
            </>
          )}

          {/* Moderator specific content */}
          {(canViewModeratorTabs || canViewAdminTabs) && (
            <TabsContent
              value="cases-under-review"
              className="space-y-4 sm:space-y-6"
            >
              <CasesUnderReviewTab />
            </TabsContent>
          )}

          {/* Third Party Moderator specific content */}
          {(canViewThirdPartyTabs || canViewAdminTabs) && (
            <TabsContent
              value="third-party-review-cases"
              className="space-y-4 sm:space-y-6"
            >
              <ThirdPartyReviewCasesTab />
            </TabsContent>
          )}

          {/* Digital Forensics Moderator specific content */}
          {(canViewDigitalForensicsTabs || canViewAdminTabs) && (
            <TabsContent
              value="digital-forensics-review-cases"
              className="space-y-4 sm:space-y-6"
            >
              <DigitalForensicsReviewCasesTab />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default ModeratorsDashboard;
