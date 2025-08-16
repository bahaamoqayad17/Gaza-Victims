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
import { FileText, Calendar, MapPin, AlertTriangle } from "lucide-react";

interface UserCase {
  id: string;
  name: string;
  location: string;
  status: string;
  priority: string;
  assignedDate: string;
  reviewedDate?: string;
}

interface UserCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
}

// Mock data for user cases
const generateMockCases = (
  userId: string
): { assigned: UserCase[]; reviewed: UserCase[] } => {
  const mockAssignedCases: UserCase[] = [
    {
      id: "case-001",
      name: "Gaza City Incident Report",
      location: "Gaza City, Palestine",
      status: "under_review",
      priority: "high",
      assignedDate: "2024-01-15",
    },
    {
      id: "case-002",
      name: "Rafah Border Documentation",
      location: "Rafah, Palestine",
      status: "pending",
      priority: "medium",
      assignedDate: "2024-01-14",
    },
    {
      id: "case-003",
      name: "Khan Younis Evidence Collection",
      location: "Khan Younis, Palestine",
      status: "third_party_review",
      priority: "high",
      assignedDate: "2024-01-13",
    },
  ];

  const mockReviewedCases: UserCase[] = [
    {
      id: "case-101",
      name: "Jabalia Camp Investigation",
      location: "Jabalia, Palestine",
      status: "verified",
      priority: "high",
      assignedDate: "2024-01-10",
      reviewedDate: "2024-01-12",
    },
    {
      id: "case-102",
      name: "Deir al-Balah Witness Testimony",
      location: "Deir al-Balah, Palestine",
      status: "verified",
      priority: "medium",
      assignedDate: "2024-01-08",
      reviewedDate: "2024-01-11",
    },
    {
      id: "case-103",
      name: "Beit Lahia Documentation",
      location: "Beit Lahia, Palestine",
      status: "rejected",
      priority: "low",
      assignedDate: "2024-01-05",
      reviewedDate: "2024-01-09",
    },
    {
      id: "case-104",
      name: "Gaza Port Security Footage",
      location: "Gaza Port, Palestine",
      status: "verified",
      priority: "medium",
      assignedDate: "2024-01-03",
      reviewedDate: "2024-01-07",
    },
    {
      id: "case-105",
      name: "Al-Shifa Hospital Records",
      location: "Gaza City, Palestine",
      status: "verified",
      priority: "high",
      assignedDate: "2024-01-01",
      reviewedDate: "2024-01-06",
    },
  ];

  return { assigned: mockAssignedCases, reviewed: mockReviewedCases };
};

export function UserCasesModal({
  isOpen,
  onClose,
  userName,
  userId,
}: UserCasesModalProps) {
  const [activeTab, setActiveTab] = useState("assigned");

  const { assigned, reviewed } = generateMockCases(userId);

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
                      <TableRow key={case_.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{case_.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {case_.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{case_.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(case_.status)}>
                            {formatStatus(case_.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPriorityBadgeVariant(case_.priority)}
                          >
                            {case_.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(case_.assignedDate)}
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
                      <TableRow key={case_.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{case_.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {case_.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{case_.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(case_.status)}>
                            {formatStatus(case_.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPriorityBadgeVariant(case_.priority)}
                          >
                            {case_.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(case_.assignedDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {case_.reviewedDate
                              ? formatDate(case_.reviewedDate)
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
