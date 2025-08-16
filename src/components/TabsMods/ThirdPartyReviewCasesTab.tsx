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
import { CheckCircle, Loader2 } from "lucide-react";
import { useGetCasesForThirdPartyReviewQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssignCaseModal } from "@/components/AssignCaseModal";

export const ThirdPartyReviewCasesTab = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch third party review cases from API
  const {
    data: casesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCasesForThirdPartyReviewQuery();

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

  const handleAssignCase = (caseId: string, userId: string) => {
    // TODO: Implement actual case assignment API call
    console.log(`Assigning third party case ${caseId} to user ${userId}`);
    // For now, just close the modal and show success
    // In a real implementation, you would call an API endpoint here
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Third Party Review Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading third party review cases...</span>
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
          <CardTitle>Third Party Review Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load third party review cases.{" "}
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
          <CardTitle>Third Party Review Cases</CardTitle>
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
                    No third party review cases found.
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
                    <TableCell className="text-sm">
                      {case_.userThirdPartyVerified
                        ? typeof case_.userThirdPartyVerified === "object"
                          ? (case_.userThirdPartyVerified as { name: string })
                              ?.name
                          : "Assigned"
                        : "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAssignClick(case_._id, case_.name)
                          }
                        >
                          Assign
                        </Button>
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
