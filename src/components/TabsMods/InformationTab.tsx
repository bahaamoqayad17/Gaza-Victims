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
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react";
import {
  useGetAllInformationQuery,
  useUpdateInformationStatusMutation,
  useDeleteInformationMutation,
  Information,
} from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export const InformationTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedInformation, setSelectedInformation] =
    useState<Information | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Fetch information from API
  const {
    data: informationResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllInformationQuery();

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateInformationStatusMutation();
  const [deleteInformation, { isLoading: isDeleting }] =
    useDeleteInformationMutation();

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

  const information = informationResponse?.data?.information || [];

  const filteredInformation = information.filter((info) => {
    const matchesSearch =
      info.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (info.adminNotes &&
        info.adminNotes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" ||
      (info.status &&
        info.status.toLowerCase() === selectedStatus.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({
        id,
        status,
        adminNotes: adminNotes || undefined,
      }).unwrap();

      toast.success(`Information ${status} successfully`);
      setSelectedInformation(null);
      setAdminNotes("");
    } catch (error) {
      toast.error("Failed to update information status");
    }
  };

  const handleDeleteInformation = async (id: string) => {
    try {
      await deleteInformation(id).unwrap();
      toast.success("Information removed successfully");
    } catch (error) {
      toast.error("Failed to remove information");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Information Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading information submissions...</span>
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
            <FileText className="w-5 h-5" />
            Information Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load information submissions.{" "}
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
          <FileText className="w-5 h-5" />
          Information Submissions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all additional information submissions from users
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search information submissions..."
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

        {/* Information Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Note Preview</TableHead>
              <TableHead>Files</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInformation.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No information submissions found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredInformation.map((info) => (
                <TableRow key={info._id}>
                  <TableCell>
                    <div className="font-mono text-sm">{info.caseId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(info.status)}
                      className="flex items-center gap-1 w-fit"
                    >
                      {getStatusIcon(info.status)}
                      {info.status || "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate">
                      {info.note.length > 50
                        ? `${info.note.substring(0, 50)}...`
                        : info.note}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {info.files.length > 0 ? (
                        <span className="text-blue-600">
                          {info.files.length} file(s)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No files</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(info.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedInformation(info)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {info.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(info._id, "approved")
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
                              handleStatusUpdate(info._id, "rejected")
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
                        onClick={() => handleDeleteInformation(info._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Information Details Modal */}
        {selectedInformation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Information Submission Details</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInformation(null)}
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
                      {selectedInformation.caseId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(
                          selectedInformation.status
                        )}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getStatusIcon(selectedInformation.status)}
                        {selectedInformation.status || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Note</label>
                  <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                    {selectedInformation.note}
                  </p>
                </div>

                {selectedInformation.files.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">
                      Attached Files
                    </label>
                    <div className="mt-1 space-y-2">
                      {selectedInformation.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-sm truncate">{file}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file, "_blank")}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
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

                {selectedInformation.adminNotes && (
                  <div>
                    <label className="text-sm font-medium">
                      Previous Admin Notes
                    </label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded-md">
                      {selectedInformation.adminNotes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Created:{" "}
                    {new Date(selectedInformation.createdAt).toLocaleString()}
                  </span>
                  <span>
                    Updated:{" "}
                    {new Date(selectedInformation.updatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-4">
                  {selectedInformation.status === "pending" && (
                    <>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedInformation._id,
                            "approved"
                          )
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
                          handleStatusUpdate(
                            selectedInformation._id,
                            "rejected"
                          )
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
                    onClick={() =>
                      handleDeleteInformation(selectedInformation._id)
                    }
                    disabled={isDeleting}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
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
