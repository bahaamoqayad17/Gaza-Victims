import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  User,
  Mail,
  Shield,
  Calendar,
  FileText,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddModeratorDialogProps {
  onAddModerator?: (moderator: any) => void;
}

export function AddModeratorDialog({
  onAddModerator,
}: AddModeratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    secondaryEmail: "",
    phone: "",
    role: "",
    organization: "",
    department: "",
    specializations: [] as string[],
    languages: [] as string[],
    timeZone: "",
    startDate: "",
    securityClearance: "",
    notes: "",
    permissions: {
      canReviewCases: false,
      canVerifyDocuments: false,
      canManageModerators: false,
      canAccessAnalytics: false,
      canExportData: false,
      canManageSettings: false,
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: array,
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please fill in all required fields (First Name, Last Name, Email, Role)",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    const newModerator = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
      status: "pending",
      casesReviewed: 0,
      joinDate: formData.startDate || new Date().toISOString().split("T")[0],
      lastActive: "Never",
      ...formData,
    };

    onAddModerator?.(newModerator);

    toast({
      title: "Moderator added successfully",
      description: `${formData.firstName} ${
        formData.lastName
      } has been added as a ${formData.role.replace("_", " ")}`,
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      secondaryEmail: "",
      phone: "",
      role: "",
      organization: "",
      department: "",
      specializations: [],
      languages: [],
      timeZone: "",
      startDate: "",
      securityClearance: "",
      notes: "",
      permissions: {
        canReviewCases: false,
        canVerifyDocuments: false,
        canManageModerators: false,
        canAccessAnalytics: false,
        canExportData: false,
        canManageSettings: false,
      },
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
        email: "",
      },
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Moderator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Add New Moderator
          </DialogTitle>
          <DialogDescription>
            Add a new moderator to the team. Fill in all required information
            and set appropriate permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-4 h-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter primary email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryEmail">Secondary Email</Label>
                  <Input
                    id="secondaryEmail"
                    type="email"
                    value={formData.secondaryEmail}
                    onChange={(e) =>
                      handleInputChange("secondaryEmail", e.target.value)
                    }
                    placeholder="Enter secondary email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  <Select
                    value={formData.timeZone}
                    onValueChange={(value) =>
                      handleInputChange("timeZone", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Standard Time</SelectItem>
                      <SelectItem value="PST">Pacific Standard Time</SelectItem>
                      <SelectItem value="CET">Central European Time</SelectItem>
                      <SelectItem value="JST">Japan Standard Time</SelectItem>
                      <SelectItem value="IST">India Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role and Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-4 h-4" />
                Role and Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="senior_moderator">
                        Senior Moderator
                      </SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="third_party_verifier">
                        Third Party Verifier
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    placeholder="Enter department"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specializations">
                    Specializations (comma-separated)
                  </Label>
                  <Input
                    id="specializations"
                    value={formData.specializations.join(", ")}
                    onChange={(e) =>
                      handleArrayChange("specializations", e.target.value)
                    }
                    placeholder="e.g. Human Rights, Legal, Forensics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={formData.languages.join(", ")}
                    onChange={(e) =>
                      handleArrayChange("languages", e.target.value)
                    }
                    placeholder="e.g. English, Arabic, Spanish"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityClearance">
                  Security Clearance Level
                </Label>
                <Select
                  value={formData.securityClearance}
                  onValueChange={(value) =>
                    handleInputChange("securityClearance", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select security clearance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-4 h-4" />
                Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canReviewCases"
                    checked={formData.permissions.canReviewCases}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canReviewCases", !!checked)
                    }
                  />
                  <Label htmlFor="canReviewCases">Can Review Cases</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canVerifyDocuments"
                    checked={formData.permissions.canVerifyDocuments}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canVerifyDocuments", !!checked)
                    }
                  />
                  <Label htmlFor="canVerifyDocuments">
                    Can Verify Documents
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canManageModerators"
                    checked={formData.permissions.canManageModerators}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canManageModerators", !!checked)
                    }
                  />
                  <Label htmlFor="canManageModerators">
                    Can Manage Moderators
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canAccessAnalytics"
                    checked={formData.permissions.canAccessAnalytics}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canAccessAnalytics", !!checked)
                    }
                  />
                  <Label htmlFor="canAccessAnalytics">
                    Can Access Analytics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canExportData"
                    checked={formData.permissions.canExportData}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canExportData", !!checked)
                    }
                  />
                  <Label htmlFor="canExportData">Can Export Data</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="canManageSettings"
                    checked={formData.permissions.canManageSettings}
                    onCheckedChange={(checked) =>
                      handlePermissionChange("canManageSettings", !!checked)
                    }
                  />
                  <Label htmlFor="canManageSettings">Can Manage Settings</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-4 h-4" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      handleEmergencyContactChange("name", e.target.value)
                    }
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyContact.relationship}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        "relationship",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Spouse, Parent, Sibling"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      handleEmergencyContactChange("phone", e.target.value)
                    }
                    placeholder="Enter emergency contact phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail">Contact Email</Label>
                  <Input
                    id="emergencyEmail"
                    type="email"
                    value={formData.emergencyContact.email}
                    onChange={(e) =>
                      handleEmergencyContactChange("email", e.target.value)
                    }
                    placeholder="Enter emergency contact email"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-4 h-4" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter any additional notes or special instructions..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Moderator</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
