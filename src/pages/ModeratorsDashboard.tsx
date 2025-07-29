import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Shield, 
  Users, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Plus,
  Settings
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";

// Mock data for moderators
const moderators = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@archive.org",
    role: "admin",
    status: "active",
    casesReviewed: 247,
    joinDate: "2023-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: "2", 
    name: "Ahmed Hassan",
    email: "ahmed.h@archive.org",
    role: "senior_moderator",
    status: "active",
    casesReviewed: 189,
    joinDate: "2023-03-22",
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    email: "maria.r@archive.org", 
    role: "moderator",
    status: "active",
    casesReviewed: 156,
    joinDate: "2023-06-10",
    lastActive: "3 hours ago"
  },
  {
    id: "4",
    name: "David Chen",
    email: "david.c@thirdparty.org",
    role: "third_party_verifier",
    status: "pending",
    casesReviewed: 45,
    joinDate: "2023-11-05",
    lastActive: "1 week ago"
  }
];

// Mock data for pending cases
const pendingCases = [
  {
    id: "001",
    name: "Sarah M.",
    location: "Aleppo, Syria",
    submittedBy: "Anonymous",
    status: "pending_review",
    priority: "high",
    submittedDate: "2023-12-20",
    currentReviewer: null
  },
  {
    id: "002",
    name: "Ahmed K.",
    location: "Kharkiv, Ukraine", 
    submittedBy: "Witness Report",
    status: "under_review",
    priority: "medium",
    submittedDate: "2023-12-18",
    currentReviewer: "Ahmed Hassan"
  },
  {
    id: "003",
    name: "Maria L.",
    location: "Mariupol, Ukraine",
    submittedBy: "Family Member",
    status: "third_party_verification",
    priority: "high",
    submittedDate: "2023-12-15",
    currentReviewer: "David Chen"
  },
  {
    id: "004",
    name: "Elena R.",
    location: "Damascus, Syria",
    submittedBy: "Medical Records",
    status: "digital_forensics_verification",
    priority: "medium",
    submittedDate: "2023-12-12",
    currentReviewer: "Forensics Team"
  }
];

const ModeratorsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "destructive";
      case "senior_moderator": return "default";
      case "moderator": return "secondary";
      case "third_party_verifier": return "outline";
      default: return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "suspended": return "destructive";
      default: return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const filteredModerators = moderators.filter(mod => {
    const matchesSearch = mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mod.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || mod.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || mod.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('moderatorsDashboard')}</h1>
            <p className="text-muted-foreground">{t('manageCaseVerification')}</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('totalModerators')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moderators.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pendingReviews')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCases.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('casesVerifiedToday')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('activeVerifiers')}</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Third-party authenticators</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="moderators" className="space-y-6">
          <TabsList>
            <TabsTrigger value="moderators">{t('moderators')}</TabsTrigger>
            <TabsTrigger value="pending-cases">{t('pendingCases')}</TabsTrigger>
            <TabsTrigger value="verification-settings">Verification Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="moderators" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Moderator Management</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Moderator
                  </Button>
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
                      <SelectItem value="third_party_verifier">Third Party Verifier</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
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
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModerators.map((moderator) => (
                      <TableRow key={moderator.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${moderator.name}`} />
                              <AvatarFallback>{moderator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{moderator.name}</div>
                              <div className="text-sm text-muted-foreground">{moderator.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(moderator.role)}>
                            {moderator.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(moderator.status)}>
                            {moderator.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{moderator.casesReviewed}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{moderator.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Case Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCases.map((case_) => (
                      <TableRow key={case_.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{case_.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {case_.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{case_.location}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{case_.status.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(case_.priority)}>
                            {case_.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{case_.submittedDate}</TableCell>
                        <TableCell className="text-sm">
                          {case_.currentReviewer || "Unassigned"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button variant="outline" size="sm">
                              Assign
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification-settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Documentation Level</Label>
                    <p className="text-sm text-muted-foreground">Basic documentation with source verification</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Documented</Badge>
                      <span className="text-sm">Requires 1 moderator approval</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Verified Level</Label>
                    <p className="text-sm text-muted-foreground">Cross-referenced with multiple sources</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Verified</Badge>
                      <span className="text-sm">Requires 2 moderator approvals</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Third Party Verified</Label>
                    <p className="text-sm text-muted-foreground">External organization confirmation</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Third Party Verified</Badge>
                      <span className="text-sm">Requires external verifier</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Third Party Organizations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Human Rights Watch</div>
                        <div className="text-sm text-muted-foreground">Active verifier</div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Amnesty International</div>
                        <div className="text-sm text-muted-foreground">Pending activation</div>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">Syria Justice Network</div>
                        <div className="text-sm text-muted-foreground">Regional verifier</div>
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Organization
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ModeratorsDashboard;