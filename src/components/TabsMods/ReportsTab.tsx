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
import { Search, Loader2, FileText, AlertTriangle } from "lucide-react";
import { useGetReportsQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ReportsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  // Fetch reports from API
  const {
    data: reportsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetReportsQuery();

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "report technical issue":
        return "destructive";
      case "legal violation":
        return "default";
      case "new evidence":
        return "secondary";
      case "witness testimony":
        return "outline";
      default:
        return "secondary";
    }
  };

  const reports = reportsResponse?.data?.reports || [];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      report.report_type.some((type) =>
        type.toLowerCase().includes(selectedType.toLowerCase())
      );

    const matchesUrgency =
      selectedUrgency === "all" || report.urgency === selectedUrgency;

    return matchesSearch && matchesType && matchesUrgency;
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reports...</span>
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
            Reports Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load reports.{" "}
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
          Reports Management
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all submitted reports from users
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical Issue</SelectItem>
              <SelectItem value="help">Help Request</SelectItem>
              <SelectItem value="violation">Legal Violation</SelectItem>
              <SelectItem value="evidence">New Evidence</SelectItem>
              <SelectItem value="witness">Witness Testimony</SelectItem>
              <SelectItem value="correction">Correction</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgency</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reports Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Case ID</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No reports found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.email}
                      </div>
                      {report.contact_info && (
                        <div className="text-xs text-muted-foreground">
                          {report.contact_info}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {report.report_type.map((type, index) => (
                        <Badge
                          key={index}
                          variant={getTypeBadgeVariant(type)}
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getUrgencyBadgeVariant(report.urgency)}>
                      {report.urgency.charAt(0).toUpperCase() +
                        report.urgency.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.case ? (
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {typeof report.case === "string"
                          ? report.case
                          : report.case._id}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate">
                      {report.message.length > 100
                        ? `${report.message.substring(0, 100)}...`
                        : report.message}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
