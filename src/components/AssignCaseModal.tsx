import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserCheck, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGetAllUsersQuery } from "@/store/api/apiSlice";

interface AssignCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  caseName: string;
  allowedRoles: string[];
  onAssign?: (caseId: string, userId: string) => void;
}

export function AssignCaseModal({
  isOpen,
  onClose,
  caseId,
  caseName,
  allowedRoles,
  onAssign,
}: AssignCaseModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  // Get all users from the already loaded state
  const { data: usersResponse } = useGetAllUsersQuery();
  const users = usersResponse?.data?.users || [];

  // Filter users based on allowed roles
  const filteredUsers = users.filter(
    (user) => allowedRoles.includes(user.role) && user.isActive
  );

  const handleAssign = async () => {
    if (!selectedUserId) {
      toast({
        title: "No user selected",
        description: "Please select a user to assign this case to.",
        variant: "destructive",
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Call the onAssign callback if provided
      onAssign?.(caseId, selectedUserId);

      const selectedUser = filteredUsers.find(
        (user) => user._id === selectedUserId
      );
      toast({
        title: "Case assigned successfully",
        description: `Case "${caseName}" has been assigned to ${
          selectedUser?.name || "the selected user"
        }.`,
      });

      // Reset and close modal
      setSelectedUserId("");
      onClose();
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Failed to assign the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedUserId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Assign Case
          </DialogTitle>
          <DialogDescription>
            Assign case "{caseName}" to a moderator for review.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">Select Moderator</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-select">
                <SelectValue placeholder="Choose a moderator..." />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.length === 0 ? (
                  <SelectItem value="no-users" disabled>
                    No available moderators found
                  </SelectItem>
                ) : (
                  filteredUsers.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {user.role.replace("_", " ")} • {user.casesReviewed}{" "}
                            cases reviewed
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {filteredUsers.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} available moderator
              {filteredUsers.length !== 1 ? "s" : ""} found
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={
              !selectedUserId || isAssigning || filteredUsers.length === 0
            }
          >
            {isAssigning ? "Assigning..." : "Assign Case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
