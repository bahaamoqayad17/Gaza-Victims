import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Calendar,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useGetUserRecordsQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
}

export function UserCasesModal({
  isOpen,
  onClose,
  userName,
  userId,
}: UserCasesModalProps) {
  const [activeTab, setActiveTab] = useState("assigned");

  // Fetch user records from API
  const {
    data: userRecordsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserRecordsQuery(userId, {
    skip: !isOpen, // Only fetch when modal is open
  });

  const cases = userRecordsResponse?.data?.cases || [];

  // Separate cases into assigned (active) and reviewed (completed)
  const assigned = cases.filter(
    (case_) =>
      case_.status === "pending" ||
      case_.status === "under_review" ||
      case_.status === "third_party_review" ||
      case_.status === "digital_forensics_review"
  );

  const reviewed = cases.filter(
    (case_) => case_.status === "verified" || case_.status === "rejected"
  );

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "verified":
        return "default";
      case "rejected":
        return "destructive";
      case "under_review":
        return "secondary";
      case "pending":
        return "outline";
      case "third_party_review":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {userName}'s Cases
            </DialogTitle>
            <DialogDescription>
              View all cases assigned to and reviewed by {userName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading user cases...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {userName}'s Cases
            </DialogTitle>
            <DialogDescription>
              View all cases assigned to and reviewed by {userName}
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load user cases.{" "}
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {userName}'s Cases
          </DialogTitle>
          <DialogDescription>
            View all cases assigned to and reviewed by {userName}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assigned" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Assigned Cases ({assigned.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reviewed Cases ({reviewed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="mt-4">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assigned.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No assigned cases found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assigned.map((case_) => (
                      <TableRow key={case_._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{case_.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {case_._id.toString().slice(-6)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">
                              {case_.locationName || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(case_.status)}>
                            {formatStatus(case_.status)}
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
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(case_.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reviewed" className="mt-4">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Reviewed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewed.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No reviewed cases found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reviewed.map((case_) => (
                      <TableRow key={case_._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{case_.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {case_._id.toString().slice(-6)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">
                              {case_.locationName || "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(case_.status)}>
                            {formatStatus(case_.status)}
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
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(case_.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {case_.updatedAt
                              ? formatDate(case_.updatedAt)
                              : "N/A"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
