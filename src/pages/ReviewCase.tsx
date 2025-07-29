import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Search, Flag, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const ReviewCase = () => {
  const [caseNumber, setCaseNumber] = useState('');
  const [caseFound, setCaseFound] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [flaggedErrors, setFlaggedErrors] = useState<string[]>([]);
  
  // Mock case data - in real app would fetch from backend
  const mockCase = {
    id: 'CASE-2025-001234',
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    occupation: 'Teacher',
    location: 'Gaza City, Palestine',
    date: '2024-01-15',
    cause: 'Bombing',
    perpetrator: 'Military Forces',
    circumstances: 'Was at home with family when bombing occurred.',
    submittedBy: 'Family Member',
    status: 'Under Review'
  };

  const handleSearchCase = () => {
    if (caseNumber.trim()) {
      // Mock case lookup - in real app would query backend
      setCaseFound(true);
      toast.success('Case found successfully');
    } else {
      toast.error('Please enter a valid case number');
    }
  };

  const handleAddAdditionalInfo = () => {
    if (additionalInfo.trim()) {
      // In real app would send to backend
      toast.success('Additional information submitted successfully');
      setAdditionalInfo('');
    }
  };

  const handleRequestDeletion = () => {
    if (deletionReason.trim()) {
      // In real app would send deletion request to backend
      toast.success('Deletion request submitted. We will review your request and get back to you.');
      setDeletionReason('');
      setContactEmail('');
    } else {
      toast.error('Please provide a reason for deletion request');
    }
  };

  const handleFlagError = (field: string) => {
    setFlaggedErrors(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Review Submitted Case
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!caseFound ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="caseNumber">Case Number</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enter your case number to access and review your submission
                    </p>
                    <div className="flex gap-2">
                      <Input 
                        id="caseNumber"
                        placeholder="CASE-2025-XXXXXX"
                        value={caseNumber}
                        onChange={(e) => setCaseNumber(e.target.value)}
                      />
                      <Button onClick={handleSearchCase}>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Case Information Display */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Case Information</h3>
                      <Badge variant="outline">{mockCase.status}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Case Number</Label>
                            <p className="text-sm">{mockCase.id}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('caseNumber')}
                            className={flaggedErrors.includes('caseNumber') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Name</Label>
                            <p className="text-sm">{mockCase.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('name')}
                            className={flaggedErrors.includes('name') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Age</Label>
                            <p className="text-sm">{mockCase.age}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('age')}
                            className={flaggedErrors.includes('age') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Occupation</Label>
                            <p className="text-sm">{mockCase.occupation}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('occupation')}
                            className={flaggedErrors.includes('occupation') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Location</Label>
                            <p className="text-sm">{mockCase.location}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('location')}
                            className={flaggedErrors.includes('location') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Date of Incident</Label>
                            <p className="text-sm">{mockCase.date}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('date')}
                            className={flaggedErrors.includes('date') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Cause of Death</Label>
                            <p className="text-sm">{mockCase.cause}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('cause')}
                            className={flaggedErrors.includes('cause') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Perpetrator</Label>
                            <p className="text-sm">{mockCase.perpetrator}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('perpetrator')}
                            className={flaggedErrors.includes('perpetrator') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {flaggedErrors.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <Flag className="h-4 w-4 inline mr-1" />
                          You have flagged {flaggedErrors.length} field(s) as containing errors. 
                          These will be reviewed by our team.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add Additional Information */}
                  <div>
                    <Label htmlFor="additionalInfo">Add Additional Information</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Provide any new information or corrections to your original submission
                    </p>
                    <Textarea 
                      id="additionalInfo"
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      placeholder="Enter additional information, corrections, or updates..."
                      rows={4}
                    />
                    <Button 
                      onClick={handleAddAdditionalInfo}
                      className="mt-2"
                      disabled={!additionalInfo.trim()}
                    >
                      Submit Additional Information
                    </Button>
                  </div>

                  {/* Request Case Deletion */}
                  <div className="border-t pt-6">
                    <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Request Case Deletion
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="deletionReason">Reason for Deletion Request</Label>
                          <Textarea 
                            id="deletionReason"
                            value={deletionReason}
                            onChange={(e) => setDeletionReason(e.target.value)}
                            placeholder="Please explain why you want this case to be deleted..."
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
                          <Input 
                            id="contactEmail"
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="your.email@example.com"
                          />
                        </div>
                        
                        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-200 dark:border-amber-800">
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            <strong>Please note:</strong> The platform will review your deletion request carefully. 
                            We will try to get back to you as soon as possible, but please be patient as this 
                            process may take some time. Deletion requests are handled on a case-by-case basis.
                          </p>
                        </div>
                        
                        <Button 
                          onClick={handleRequestDeletion}
                          variant="destructive"
                          disabled={!deletionReason.trim()}
                        >
                          Submit Deletion Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReviewCase;