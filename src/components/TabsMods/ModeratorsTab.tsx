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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Loader2 } from "lucide-react";
import { AddModeratorDialog } from "@/components/AddModeratorDialog";
import { UserActionsMenu } from "@/components/UserActionsMenu";
import { useGetAllUsersQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ModeratorsTab = () => {
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
      case "admin":
        return "destructive";
      case "senior_moderator":
        return "default";
      case "moderator":
        return "secondary";
      case "third_party_moderator":
        return "outline";
      case "digital_forensics_moderator":
        return "outline";
      case "user":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Helper function to get last active (mock for now since not in backend)
  const getLastActive = () => {
    const activities = [
      "2 hours ago",
      "1 day ago",
      "3 hours ago",
      "1 week ago",
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const users = usersResponse?.data?.users || [];

  const handleUserUpdate = (
    userId: string,
    action: "delete" | "deactivate" | "activate"
  ) => {
    // TODO: Implement actual API calls for user actions
    console.log(`User ${userId} action: ${action}`);
    // For now, just refetch the data to update the UI
    refetch();
  };

  const filteredModerators = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "pending" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Moderator Management</CardTitle>
            <AddModeratorDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading moderators...</span>
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
          <div className="flex items-center justify-between">
            <CardTitle>Moderator Management</CardTitle>
            <AddModeratorDialog />
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load moderators.{" "}
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
        <div className="flex items-center justify-between">
          <CardTitle>Moderator Management</CardTitle>
          <AddModeratorDialog />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search moderators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="senior_moderator">Senior Moderator</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="third_party_moderator">
                Third Party Moderator
              </SelectItem>
              <SelectItem value="digital_forensics_moderator">
                Digital Forensics Moderator
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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

        {/* Moderators Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Moderator</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cases Reviewed</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModerators.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No moderators found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredModerators.map((user) => (
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
                      {user.role
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
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
      </CardContent>
    </Card>
  );
};
