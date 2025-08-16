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
  Key,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAddModeratorMutation } from "@/store/api/apiSlice";

interface AddModeratorDialogProps {
  onAddModerator?: (moderator: unknown) => void;
}

export function AddModeratorDialog({
  onAddModerator,
}: AddModeratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    password: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
  });

  const { toast } = useToast();
  const [addModerator, { isLoading }] = useAddModeratorMutation();

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({ ...prev, password }));
    toast({
      title: "Password generated",
      description: "A secure password has been generated automatically.",
    });
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.role ||
      !formData.password
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please fill in all required fields (First Name, Last Name, Email, Role, Password)",
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

    // Password validation
    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addModerator(formData).unwrap();

      toast({
        title: "Moderator added successfully",
        description: `${formData.firstName} ${
          formData.lastName
        } has been added as a ${formData.role.replace("_", " ")}`,
      });

      // Call the callback if provided
      onAddModerator?.(result.data.user);

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
        password: "",
        emergencyContact: {
          name: "",
          relationship: "",
          phone: "",
          email: "",
        },
      });

      setOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "An error occurred while adding the moderator";
      toast({
        title: "Failed to add moderator",
        description: errorMessage,
        variant: "destructive",
      });
    }
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

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter password (min. 8 characters)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate
                  </Button>
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
                      <SelectItem value="third_party_moderator">
                        Third Party Moderator
                      </SelectItem>
                      <SelectItem value="digital_forensics_moderator">
                        Digital Forensics Moderator
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
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Moderator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
