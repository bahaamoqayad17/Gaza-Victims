import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Loader2, Shield } from "lucide-react";
import {
  useGetCasesUnderReviewQuery,
  useVerifyCaseMutation,
  useAssignCaseMutation,
} from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AssignCaseModal } from "@/components/AssignCaseModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Link } from "react-router-dom";

export const CasesUnderReviewTab = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Get current user role
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const canAssignCases =
    currentUser?.role === "admin" || currentUser?.role === "senior_moderator";

  // Fetch cases under review from API
  const {
    data: casesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCasesUnderReviewQuery();

  // Mutations
  const [verifyCase] = useVerifyCaseMutation();
  const [assignCase] = useAssignCaseMutation();
  const { toast } = useToast();

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const cases = casesResponse?.data?.cases || [];

  const handleAssignClick = (caseId: string, caseName: string) => {
    setSelectedCase({ id: caseId, name: caseName });
    setAssignModalOpen(true);
  };

  const handleAssignCase = async (caseId: string, userId: string) => {
    try {
      await assignCase({ caseId, assignedTo: userId }).unwrap();

      setAssignModalOpen(false);
      setSelectedCase(null);
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: error.data.message,
        variant: "destructive",
      });
    }
  };

  const handleVerifyCase = async (caseId: string, caseName: string) => {
    try {
      await verifyCase(caseId).unwrap();

      toast({
        title: "Case verified successfully",
        description: `Case "${caseName}" has been verified and moved to third party review.`,
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "Failed to verify the case. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cases Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading cases under review...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cases Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load cases under review.{" "}
              {error && "data" in error
                ? (error.data as { message?: string })?.message
                : "Please try again."}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Cases Under Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No cases under review found.
                  </TableCell>
                </TableRow>
              ) : (
                cases.map((case_) => (
                  <TableRow key={case_._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{case_.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {case_._id.toString().slice(-6)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{case_.locationName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {case_.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getPriorityBadgeVariant(
                          case_.urgency || "low"
                        )}
                      >
                        {case_.urgency || "low"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(case_.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {case_.isVerified ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {case_.userModeratorVerified
                        ? typeof case_.userModeratorVerified === "object"
                          ? (case_.userModeratorVerified as { name: string })
                              ?.name
                          : "Assigned"
                        : "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/case/${case_.generated_id}`}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Review
                          </Link>
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleVerifyCase(case_._id, case_.name)
                          }
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Verify
                        </Button>

                        {canAssignCases && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleAssignClick(case_._id, case_.name)
                            }
                          >
                            Assign
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      {selectedCase && (
        <AssignCaseModal
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedCase(null);
          }}
          caseId={selectedCase.id}
          caseName={selectedCase.name}
          allowedRoles={["third_party_moderator"]}
          onAssign={handleAssignCase}
        />
      )}
    </>
  );
};
