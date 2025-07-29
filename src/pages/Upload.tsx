import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Upload as UploadIcon, ArrowLeft, ArrowRight, X, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReCAPTCHA from "react-google-recaptcha";

const Upload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    background: '',
    date: '',
    location: '',
    circumstances: '',
    witnesses: '',
    source: '',
    notes: '',
    consentAgreed: false,
    safetyAcknowledged: false
  });
  const [familyCounts, setFamilyCounts] = useState({
    daughters: 0,
    sons: 0,
    brothers: 0,
    sisters: 0
  });
  const [additionalPhotos, setAdditionalPhotos] = useState<File[]>([]);
  const [socialMediaUrl, setSocialMediaUrl] = useState('');
  const [socialMediaPreview, setSocialMediaPreview] = useState<string | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isGraphicContent, setIsGraphicContent] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [cause, setCause] = useState('');
  const [otherCauseDetails, setOtherCauseDetails] = useState('');

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const handleSocialMediaFetch = async () => {
    // Mock implementation - in real app would use social media APIs
    setSocialMediaPreview(socialMediaUrl);
  };

  const removeAdditionalPhoto = (index: number) => {
    setAdditionalPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeEvidenceFile = (index: number) => {
    setEvidenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Progress */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="w-3 h-3" />
              Anonymous
            </Badge>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "Victim Information"}
                {currentStep === 2 && "Incident Details"}
                {currentStep === 3 && "Documentation"}
                {currentStep === 4 && "Preview"}
                {currentStep === 5 && "Review & Submit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Full name" />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="Age" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <select id="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input id="occupation" placeholder="Occupation or role" />
                    </div>
                  </div>

                  <div>
                    <Label>They leave behind</Label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="father" />
                          <Label htmlFor="father" className="text-sm">Father</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="mother" />
                          <Label htmlFor="mother" className="text-sm">Mother</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="wife" />
                          <Label htmlFor="wife" className="text-sm">Wife</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="husband" />
                          <Label htmlFor="husband" className="text-sm">Husband</Label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="daughter" />
                            <Label htmlFor="daughter" className="text-sm">Daughter(s)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, daughters: Math.max(0, prev.daughters - 1)}))}
                            >
                              -
                            </Button>
                            <span className="mx-2 text-sm min-w-[20px] text-center">{familyCounts.daughters}</span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, daughters: prev.daughters + 1}))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="son" />
                            <Label htmlFor="son" className="text-sm">Son(s)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, sons: Math.max(0, prev.sons - 1)}))}
                            >
                              -
                            </Button>
                            <span className="mx-2 text-sm min-w-[20px] text-center">{familyCounts.sons}</span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, sons: prev.sons + 1}))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="brother" />
                            <Label htmlFor="brother" className="text-sm">Brother(s)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, brothers: Math.max(0, prev.brothers - 1)}))}
                            >
                              -
                            </Button>
                            <span className="mx-2 text-sm min-w-[20px] text-center">{familyCounts.brothers}</span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, brothers: prev.brothers + 1}))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="sister" />
                            <Label htmlFor="sister" className="text-sm">Sister(s)</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, sisters: Math.max(0, prev.sisters - 1)}))}
                            >
                              -
                            </Button>
                            <span className="mx-2 text-sm min-w-[20px] text-center">{familyCounts.sisters}</span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => setFamilyCounts(prev => ({...prev, sisters: prev.sisters + 1}))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="grandfather" />
                          <Label htmlFor="grandfather" className="text-sm">Grandfather</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="grandmother" />
                          <Label htmlFor="grandmother" className="text-sm">Grandmother</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="other" />
                          <Label htmlFor="other" className="text-sm">Other Relative</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="photo">Portrait Photo</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload a dignified portrait photo
                      </p>
                      <Input type="file" accept="image/*" className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <Label>Additional Photos (up to 5)</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      <UploadIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload additional photos showing the person's life
                      </p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="mt-2"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setAdditionalPhotos(prev => [...prev, ...files].slice(0, 5));
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ⚠️ Note: Any other person appearing in photos must consent or be blurred prior to uploading
                    </p>
                    {additionalPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {additionalPhotos.map((file, index) => (
                          <div key={index} className="relative">
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Additional ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => removeAdditionalPhoto(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="socialMedia">Social Media Content</Label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          id="socialMedia"
                          placeholder="Paste URL from social media post (Instagram, Facebook, etc.)"
                          value={socialMediaUrl}
                          onChange={(e) => setSocialMediaUrl(e.target.value)}
                        />
                        <Button type="button" onClick={handleSocialMediaFetch}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                      {socialMediaPreview && (
                        <div className="border rounded p-2">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <img src={socialMediaPreview} alt="Social media preview" className="w-full max-w-xs rounded" />
                          <Button size="sm" variant="outline" className="mt-2">
                            <Eye className="w-3 h-3 mr-1" />
                            Blur faces
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background">Background</Label>
                    <Textarea 
                      id="background" 
                      placeholder="Brief background about the victim's life..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date of Incident (DD/MM/YYYY)</Label>
                      <Input id="date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="City, Country" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cause">Cause of Death</Label>
                    <Select value={cause} onValueChange={setCause}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select cause of death" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        <SelectItem value="bombing">Bombing</SelectItem>
                        <SelectItem value="shooting">Shooting</SelectItem>
                        <SelectItem value="torture">Torture</SelectItem>
                        <SelectItem value="intentional-starvation">Intentional Starvation</SelectItem>
                        <SelectItem value="detention-related">Detention Related Death</SelectItem>
                        <SelectItem value="forced-disappearance">Forced Disappearance</SelectItem>
                        <SelectItem value="targeted-killing">Targeted Killing</SelectItem>
                        <SelectItem value="medical-negligence">Medical Negligence/Denial of Care</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {cause === 'other' && (
                      <div className="mt-2">
                        <Label htmlFor="otherCause">Please specify</Label>
                        <Input 
                          id="otherCause"
                          value={otherCauseDetails}
                          onChange={(e) => setOtherCauseDetails(e.target.value)}
                          placeholder="Please describe the cause of death"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="circumstances">Circumstances</Label>
                    <Textarea 
                      id="circumstances" 
                      placeholder="Description of what happened..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="witnesses">Witness Information (Optional)</Label>
                    <Textarea 
                      id="witnesses" 
                      placeholder="Any witness accounts or references..."
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Evidence Collection Tutorial */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Evidence Collection Tutorial
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-xs text-muted-foreground">Video Tutorial: Safe Evidence Collection</p>
                            <p className="text-xs text-muted-foreground">Duration: 2:30</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Watch Tutorial
                        </Button>
                      </div>
                      <div className="text-sm space-y-2">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100">Quick Safety Tips:</h5>
                        <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs">
                          <li>• Use secure, private networks when uploading</li>
                          <li>• Remove metadata from photos if safety is a concern</li>
                          <li>• Consider using VPN for additional privacy</li>
                          <li>• Blur faces of living individuals for their protection</li>
                          <li>• Document with timestamp and location when safe to do so</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Evidence Upload</Label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Upload photos, videos, documents, and other evidence
                      </p>
                      <Input 
                        type="file" 
                        multiple 
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        className="mt-2"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setEvidenceFiles(prev => [...prev, ...files]);
                        }}
                      />
                    </div>
                    {evidenceFiles.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {evidenceFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeEvidenceFile(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="proofId" />
                        <Label htmlFor="proofId" className="text-sm text-green-600">
                          ✓ Proof of ID added
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="proofDeath" />
                        <Label htmlFor="proofDeath" className="text-sm text-green-600">
                          ✓ Proof of death added
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="graphic" 
                          checked={isGraphicContent}
                          onCheckedChange={(checked) => setIsGraphicContent(checked as boolean)}
                        />
                        <Label htmlFor="graphic" className="text-sm">
                          This evidence contains graphic content
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="source">Source of Information</Label>
                    <Input id="source" placeholder="How you obtained this information" />
                  </div>

                  <div>
                    <Label htmlFor="relationship">To the victim you are:</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="eyewitness">Eye witness</SelectItem>
                        <SelectItem value="journalist">Journalist</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="newsLink">News Article Link (Optional)</Label>
                    <Input 
                      id="newsLink" 
                      placeholder="Link to news article about this case"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional relevant information..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h4 className="font-semibold">Case Preview</h4>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Victim Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Name:</span> {formData.name || 'Not provided'}</p>
                      <p><span className="font-medium">Age:</span> {formData.age || 'Not provided'}</p>
                      <p><span className="font-medium">Occupation:</span> {formData.occupation || 'Not provided'}</p>
                      <p><span className="font-medium">Background:</span> {formData.background || 'Not provided'}</p>
                      {additionalPhotos.length > 0 && (
                        <div>
                          <span className="font-medium">Additional Photos:</span> {additionalPhotos.length} uploaded
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Incident Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Date:</span> {formData.date || 'Not provided'}</p>
                      <p><span className="font-medium">Location:</span> {formData.location || 'Not provided'}</p>
                      <p><span className="font-medium">Circumstances:</span> {formData.circumstances || 'Not provided'}</p>
                      <p><span className="font-medium">Witnesses:</span> {formData.witnesses || 'Not provided'}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evidence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Files:</span> {evidenceFiles.length} uploaded</p>
                      <p><span className="font-medium">Graphic Content:</span> {isGraphicContent ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Source:</span> {formData.source || 'Not provided'}</p>
                      <p><span className="font-medium">Notes:</span> {formData.notes || 'Not provided'}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Submission Summary</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Your identity remains completely anonymous</li>
                      <li>• All files are encrypted during transmission</li>
                      <li>• Case will be reviewed before publication</li>
                      <li>• You will receive a reference number for tracking</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="consent" 
                        checked={formData.consentAgreed}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, consentAgreed: checked as boolean}))}
                      />
                      <Label htmlFor="consent" className="text-sm">
                        I confirm that I have the right to share this information and any media content included
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="safety-acknowledgment" 
                        checked={formData.safetyAcknowledged}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, safetyAcknowledged: checked as boolean}))}
                        required 
                      />
                      <Label htmlFor="safety-acknowledgment" className="text-sm leading-relaxed">
                        <span className="font-medium text-red-600">Safety Acknowledgment:</span> I understand and acknowledge that I am solely responsible for my own safety and security when submitting this documentation. I take full responsibility for any risks associated with my submission, including but not limited to potential retaliation, legal consequences, or other harm. The platform provides no guarantee of protection and assumes no responsibility for any consequences, whether immediate or future, that may arise from my act of submission.
                      </Label>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ⚠️ Please ensure all information is accurate and that you have the right to share this documentation.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                      <span className="font-semibold">IMPORTANT SAFETY NOTICE:</span> By proceeding with this submission, you acknowledge that you are taking this action at your own risk and discretion. This platform cannot and does not provide any guarantees regarding your safety, anonymity, or protection from potential consequences. You are strongly advised to take all necessary precautions to protect yourself and consult with appropriate security professionals if you have concerns about your safety.
                    </p>
                  </div>

                  {/* Captcha */}
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test site key - replace with actual key
                      onChange={(value) => setCaptchaValue(value)}
                      onExpired={() => setCaptchaValue(null)}
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button disabled={!formData.consentAgreed || !formData.safetyAcknowledged || !captchaValue}>
                    Submit Documentation
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Upload;