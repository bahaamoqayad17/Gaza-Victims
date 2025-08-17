import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, UserX, FileText, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserCasesModal } from "./UserCasesModal";
import {
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "@/store/api/apiSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface UserActionsMenuProps {
  user: User;
  onUserUpdate?: (
    userId: string,
    action: "delete" | "deactivate" | "activate"
  ) => void;
}

export function UserActionsMenu({ user, onUserUpdate }: UserActionsMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showCasesModal, setShowCasesModal] = useState(false);
  const { toast } = useToast();

  // API mutations
  const [deleteUser] = useDeleteUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [activateUser] = useActivateUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user._id).unwrap();

      toast({
        title: "User deleted",
        description: `${user.name} has been permanently deleted.`,
        variant: "destructive",
      });

      onUserUpdate?.(user._id, "delete");
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async () => {
    const action = user.isActive ? "deactivate" : "activate";

    try {
      if (user.isActive) {
        await deactivateUser(user._id).unwrap();
      } else {
        await activateUser(user._id).unwrap();
      }

      toast({
        title: user.isActive ? "User deactivated" : "User activated",
        description: `${user.name} has been ${
          user.isActive ? "deactivated" : "activated"
        }.`,
      });

      onUserUpdate?.(user._id, action);
      setShowDeactivateDialog(false);
    } catch (error) {
      toast({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} failed`,
        description: `Failed to ${action} user. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleViewCases = () => {
    setShowCasesModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleViewCases}
            className="cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2" />
            View Cases
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeactivateDialog(true)}
            className="cursor-pointer"
          >
            <UserX className="w-4 h-4 mr-2" />
            {user.isActive ? "Deactivate" : "Activate"} User
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{user.name}</strong>'s account and remove all associated
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate/Activate Confirmation Dialog */}
      <AlertDialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.isActive ? "Deactivate" : "Activate"} User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.isActive
                ? `This will deactivate ${user.name}'s account. They will no longer be able to access the system or review cases.`
                : `This will activate ${user.name}'s account. They will be able to access the system and review cases again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              {user.isActive ? "Deactivate" : "Activate"} User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Cases Modal */}
      <UserCasesModal
        isOpen={showCasesModal}
        onClose={() => setShowCasesModal(false)}
        userName={user.name}
        userId={user._id}
      />
    </>
  );
}
