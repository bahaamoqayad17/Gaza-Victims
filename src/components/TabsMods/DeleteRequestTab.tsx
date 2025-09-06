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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  useGetDeleteRequestsQuery,
  useUpdateDeleteRequestStatusMutation,
  useDeleteDeleteRequestMutation,
  DeleteRequest,
} from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const DeleteRequestTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<DeleteRequest | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch delete requests from API
  const {
    data: deleteRequestsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDeleteRequestsQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateDeleteRequestStatusMutation();
  const [deleteRequest, { isLoading: isDeleting }] =
    useDeleteDeleteRequestMutation();

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const deleteRequests = deleteRequestsResponse?.data?.deleteRequests || [];

  const filteredRequests = deleteRequests.filter((request) => {
    const matchesSearch =
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.email &&
        request.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.caseId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (request.status &&
        request.status.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({
        id,
        status,
        adminNotes: adminNotes || undefined,
      }).unwrap();

      toast.success(`Delete request ${status} successfully`);
      setSelectedRequest(null);
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to update delete request status");
    }
  };

  const handleDeleteRequest = async (id: string) => {
    try {
      await deleteRequest(id).unwrap();
      toast.success("Delete request removed successfully");
    } catch (error) {
      toast.error("Failed to remove delete request");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading delete requests...</span>
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
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load delete requests.{" "}
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Delete Requests
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all case deletion requests from users
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search delete requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delete Requests Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No delete requests found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="font-mono text-sm">{request.caseId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(request.status)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(request.status)}
                      {request.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate">
                      {request.reason.length > 50
                        ? `${request.reason.substring(0, 50)}...`
                        : request.reason}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {request.email || "No email provided"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(request._id, "approved")
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(request._id, "rejected")
                            }
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRequest(request._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Delete Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Delete Request Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRequest(null)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Case ID</label>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedRequest.caseId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(selectedRequest.status)}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(selectedRequest.status)}
                        {selectedRequest.status || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Reason for Deletion
                  </label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {selectedRequest.reason}
                  </p>
                </div>

                {selectedRequest.email && (
                  <div>
                    <label className="text-sm font-medium">Contact Email</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.email}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add admin notes..."
                    rows={3}
                  />
                </div>

                {selectedRequest.adminNotes && (
                  <div>
                    <label className="text-sm font-medium">
                      Previous Admin Notes
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Created:{" "}
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </span>
                  <span>
                    Updated:{" "}
                    {new Date(selectedRequest.updatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedRequest.status === "pending" && (
                    <>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(selectedRequest._id, "approved")
                        }
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleStatusUpdate(selectedRequest._id, "rejected")
                        }
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteRequest(selectedRequest._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
