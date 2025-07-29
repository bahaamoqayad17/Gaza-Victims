import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Search, Flag, Trash2, ChevronDown, Upload, X } from "lucide-react";
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
  const [isDeletionOpen, setIsDeletionOpen] = useState(false);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  
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
    otherCauseDetails: '',
    perpetrator: 'Military Forces',
    perpetratorEvidence: 'Witnessed military vehicles in the area during the attack',
    circumstances: 'Was at home with family when bombing occurred. The house was directly hit.',
    witnesses: 'Neighbors saw the attack and can provide testimony.',
    submittedBy: 'Family Member',
    status: 'Under Review',
    background: 'John was a dedicated teacher who loved his students and community. He had been teaching for over 10 years.',
    familyRelationships: {
      wife: true,
      daughters: 2,
      sons: 1,
      mother: true,
      father: false
    },
    portraitPhoto: '/api/placeholder/300/400',
    additionalPhotos: ['/api/placeholder/200/200', '/api/placeholder/200/200'],
    socialMediaUrls: ['https://facebook.com/johndoe', 'https://instagram.com/johndoe'],
    proofOfIdFiles: ['ID_Document.pdf', 'Passport.jpg'],
    proofOfDeathFiles: ['Death_Certificate.pdf', 'Medical_Report.pdf'],
    additionalEvidenceFiles: ['Witness_Statement.pdf', 'News_Article.jpg'],
    newsLinks: ['https://news.example.com/bombing-incident'],
    source: 'Direct family member',
    additionalNotes: 'Family is seeking justice and proper documentation of this tragedy.'
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
    if (additionalInfo.trim() || additionalFiles.length > 0) {
      // In real app would send to backend
      toast.success('Additional information submitted successfully');
      setAdditionalInfo('');
      setAdditionalFiles([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAdditionalFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index));
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
                  {/* Basic Victim Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Victim Information</h3>
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
                            <Label className="font-medium">Gender</Label>
                            <p className="text-sm">{mockCase.gender}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('gender')}
                            className={flaggedErrors.includes('gender') ? 'text-red-500' : ''}
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
                            <Label className="font-medium">Family Relationships</Label>
                            <div className="text-sm space-y-1">
                              {mockCase.familyRelationships.wife && <p>• Wife</p>}
                              {mockCase.familyRelationships.daughters > 0 && <p>• {mockCase.familyRelationships.daughters} Daughter(s)</p>}
                              {mockCase.familyRelationships.sons > 0 && <p>• {mockCase.familyRelationships.sons} Son(s)</p>}
                              {mockCase.familyRelationships.mother && <p>• Mother</p>}
                              {mockCase.familyRelationships.father && <p>• Father</p>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('family')}
                            className={flaggedErrors.includes('family') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Background</Label>
                            <p className="text-sm">{mockCase.background}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('background')}
                            className={flaggedErrors.includes('background') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photos and Media */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Photos and Media</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Portrait Photo</Label>
                          <div className="mt-2">
                            <img src={mockCase.portraitPhoto} alt="Portrait" className="w-32 h-40 object-cover rounded border" />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('portrait')}
                          className={flaggedErrors.includes('portrait') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Additional Photos</Label>
                          <div className="flex gap-2 mt-2">
                            {mockCase.additionalPhotos.map((photo, index) => (
                              <img key={index} src={photo} alt={`Additional ${index + 1}`} className="w-20 h-20 object-cover rounded border" />
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('additionalPhotos')}
                          className={flaggedErrors.includes('additionalPhotos') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Social Media URLs</Label>
                          <div className="text-sm space-y-1">
                            {mockCase.socialMediaUrls.map((url, index) => (
                              <p key={index}>• {url}</p>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('socialMedia')}
                          className={flaggedErrors.includes('socialMedia') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Incident Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Incident Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
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
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Perpetrator Evidence</Label>
                            <p className="text-sm">{mockCase.perpetratorEvidence}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('perpetratorEvidence')}
                            className={flaggedErrors.includes('perpetratorEvidence') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Circumstances</Label>
                            <p className="text-sm">{mockCase.circumstances}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('circumstances')}
                            className={flaggedErrors.includes('circumstances') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-medium">Witness Information</Label>
                            <p className="text-sm">{mockCase.witnesses}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFlagError('witnesses')}
                            className={flaggedErrors.includes('witnesses') ? 'text-red-500' : ''}
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documentation and Evidence */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation and Evidence</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Proof of ID Files</Label>
                          <div className="text-sm space-y-1">
                            {mockCase.proofOfIdFiles.map((file, index) => (
                              <p key={index}>• {file}</p>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('proofOfId')}
                          className={flaggedErrors.includes('proofOfId') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Proof of Death Files</Label>
                          <div className="text-sm space-y-1">
                            {mockCase.proofOfDeathFiles.map((file, index) => (
                              <p key={index}>• {file}</p>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('proofOfDeath')}
                          className={flaggedErrors.includes('proofOfDeath') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Additional Evidence Files</Label>
                          <div className="text-sm space-y-1">
                            {mockCase.additionalEvidenceFiles.map((file, index) => (
                              <p key={index}>• {file}</p>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('additionalEvidence')}
                          className={flaggedErrors.includes('additionalEvidence') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">News Article Links</Label>
                          <div className="text-sm space-y-1">
                            {mockCase.newsLinks.map((link, index) => (
                              <p key={index}>• <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link}</a></p>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('newsLinks')}
                          className={flaggedErrors.includes('newsLinks') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Source of Information</Label>
                          <p className="text-sm">{mockCase.source}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('source')}
                          className={flaggedErrors.includes('source') ? 'text-red-500' : ''}
                        >
                          <Flag className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Additional Notes</Label>
                          <p className="text-sm">{mockCase.additionalNotes}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFlagError('additionalNotes')}
                          className={flaggedErrors.includes('additionalNotes') ? 'text-red-500' : ''}
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

                   {/* Add Additional Information */}
                  <div className="space-y-4">
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
                    </div>

                    {/* File Upload for Additional Info */}
                    <div>
                      <Label>Upload Supporting Files</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload any documents, images, or other files that support your additional information
                      </p>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="additional-file-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.wav"
                        />
                        <label htmlFor="additional-file-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload files or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Supports: PDF, DOC, DOCX, Images, Videos, Audio files
                          </p>
                        </label>
                      </div>
                      
                      {additionalFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Selected Files:</p>
                          <div className="space-y-2">
                            {additionalFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      onClick={handleAddAdditionalInfo}
                      disabled={!additionalInfo.trim() && additionalFiles.length === 0}
                    >
                      Submit Additional Information
                    </Button>
                  </div>

                  {/* Request Case Deletion */}
                  <div className="border-t pt-6">
                    <Collapsible open={isDeletionOpen} onOpenChange={setIsDeletionOpen}>
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/20"
                        >
                          <span className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Request Case Deletion
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isDeletionOpen ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-4">
                        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
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
                      </CollapsibleContent>
                    </Collapsible>
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