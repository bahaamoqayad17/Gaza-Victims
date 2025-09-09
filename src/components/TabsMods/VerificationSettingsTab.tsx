import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2, Plus } from "lucide-react";
import { AddOrganizationDialog } from "@/components/AddOrganizationDialog";
import { UserActionsMenu } from "@/components/UserActionsMenu";
import { useGetAllUsersQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VerificationSettingsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Fetch users from API
  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "third_party_moderator":
        return "outline";
      case "digital_forensics_moderator":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const users = usersResponse?.data?.users || [];

  const handleUserUpdate = (
    userId: string,
    action: "delete" | "deactivate" | "activate"
  ) => {
    // No need to refetch - optimistic updates handle UI changes
    console.log(`User ${userId} action: ${action} completed`);
  };

  // Filter for only third party and digital forensics moderators
  const filteredOrganizations = users.filter((user) => {
    const isThirdPartyOrForensics =
      user.role === "third_party_moderator" ||
      user.role === "digital_forensics_moderator";

    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.organization_name &&
        user.organization_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "pending" && !user.isActive);

    return (
      isThirdPartyOrForensics && matchesSearch && matchesRole && matchesStatus
    );
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Verification Levels Card */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Documentation Level</Label>
            <p className="text-sm text-muted-foreground">
              Basic documentation with source verification
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Documented</Badge>
              <span className="text-sm">Requires 1 moderator approval</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Verified Level</Label>
            <p className="text-sm text-muted-foreground">
              Cross-referenced with multiple sources
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Verified</Badge>
              <span className="text-sm">Requires 2 moderator approvals</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Third Party Verified</Label>
            <p className="text-sm text-muted-foreground">
              External organization confirmation
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">Third Party Verified</Badge>
              <span className="text-sm">Requires external verifier</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Third Party Organizations</CardTitle>
            <AddOrganizationDialog />
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading state */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading organizations...</span>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load organizations.{" "}
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
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="third_party_moderator">
                      Third Party Organization
                    </SelectItem>
                    <SelectItem value="digital_forensics_moderator">
                      Digital Forensics Organization
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Organizations Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cases Reviewed</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No organizations found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrganizations.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                              {user.organization_name && (
                                <div className="text-xs text-muted-foreground">
                                  {user.organization_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role === "third_party_moderator"
                              ? "Third Party Organization"
                              : "Digital Forensics Organization"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.isActive)}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.casesReviewed}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.createdAt}
                        </TableCell>
                        <TableCell>
                          <UserActionsMenu
                            user={user}
                            onUserUpdate={handleUserUpdate}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
