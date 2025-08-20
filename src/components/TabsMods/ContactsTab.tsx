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
import { Search, Loader2, MessageSquare, AlertTriangle } from "lucide-react";
import { useGetContactsQuery } from "@/store/api/apiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ContactsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Fetch contacts from API
  const {
    data: contactsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetContactsQuery();

  const getTypeBadgeVariant = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "general":
        return "default";
      case "support":
        return "secondary";
      case "feedback":
        return "outline";
      case "complaint":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const contacts = contactsResponse?.data || [];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      (contact.type &&
        contact.type.toLowerCase() === selectedType.toLowerCase());

    return matchesSearch && matchesType;
  });

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Contact Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading contacts...</span>
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
            <MessageSquare className="w-5 h-5" />
            Contact Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load contacts.{" "}
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
          <MessageSquare className="w-5 h-5" />
          Contact Submissions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          View and manage all contact form submissions from users
        </p>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="complaint">Complaint</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contacts Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No contacts found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {contact.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(contact.type)}>
                      {contact.type
                        ? contact.type.charAt(0).toUpperCase() +
                          contact.type.slice(1)
                        : "General"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {contact.mobile_number}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate">
                      {contact.message.length > 100
                        ? `${contact.message.substring(0, 100)}...`
                        : contact.message}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleDateString()}
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
