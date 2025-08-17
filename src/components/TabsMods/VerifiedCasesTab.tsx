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
import { Loader2 } from "lucide-react";
import { useGetVerifiedCasesQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VerifiedCasesTab = () => {
  // Fetch verified cases from API
  const {
    data: casesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVerifiedCasesQuery();

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

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verified Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading verified cases...</span>
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
          <CardTitle>Verified Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load verified cases.{" "}
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
          <CardTitle>Verified Cases</CardTitle>
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
                <TableHead>Moderator</TableHead>
                <TableHead>Third Party</TableHead>
                <TableHead>Digital Forensics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No verified cases found.
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
                      <Badge variant="default">
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
                      {case_.userModeratorVerified
                        ? typeof case_.userModeratorVerified === "object"
                          ? (case_.userModeratorVerified as { name: string })
                              ?.name
                          : "Verified"
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {case_.userThirdPartyVerified
                        ? typeof case_.userThirdPartyVerified === "object"
                          ? (case_.userThirdPartyVerified as { name: string })
                              ?.name
                          : "Verified"
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {case_.userDigitalForensicsVerified
                        ? typeof case_.userDigitalForensicsVerified === "object"
                          ? (
                              case_.userDigitalForensicsVerified as {
                                name: string;
                              }
                            )?.name
                          : "Verified"
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
