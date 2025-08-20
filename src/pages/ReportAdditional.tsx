import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle, Shield, Send, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  reportAdditionalSchema,
  type ReportAdditionalFormData,
} from "@/lib/validationSchemas";
import { useToast } from "@/hooks/use-toast";
import { useCreateReportMutation } from "@/store/api/apiSlice";

const ReportAdditional = () => {
  const { toast } = useToast();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createReport] = useCreateReportMutation();

  // React Hook Form setup
  const form = useForm<ReportAdditionalFormData>({
    resolver: zodResolver(reportAdditionalSchema),
    defaultValues: {
      caseId: "",
      name: "",
      email: "",
      contact: "",
      relationship: "",
      additionalInfo: "",
      evidenceDescription: "",
      urgency: "medium",
      newEvidence: false,
      witnessTes: false,
      correction: false,
      consentAgreed: false,
      safetyAcknowledged: false,
      captchaValue: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: ReportAdditionalFormData) => {
    if (!captchaValue) {
      toast({
        title: "Verification Required",
        description: "Please complete the reCAPTCHA verification",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare report types based on selected checkboxes
      const reportTypes: string[] = [];
      if (data.newEvidence) reportTypes.push("New Evidence");
      if (data.witnessTes) reportTypes.push("Witness Testimony");
      if (data.correction)
        reportTypes.push("Correction to Existing Information");

      // Prepare data for API call
      const reportData = {
        name: data.name || undefined,
        email: data.email || undefined,
        contact_info: data.contact || undefined,
        message: data.additionalInfo,
        caseId: data.caseId || undefined,
        relation_to_victim: data.relationship,
        report_type: reportTypes,
        urgency: data.urgency,
        type: reportTypes, // Backend expects both report_type and type
        captchaValue: captchaValue,
      };

      await createReport(reportData).unwrap();

      toast({
        title: "Information Submitted",
        description:
          "Your additional information has been submitted successfully. We will review it and update the case accordingly.",
      });

      // Reset form after successful submission
      form.reset();
      setCaptchaValue(null);
    } catch (error: unknown) {
      console.error("Error submitting additional information:", error);

      // Handle specific error messages from backend
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "There was an error submitting your information. Please try again.";

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    if (value) {
      form.setValue("captchaValue", value);
      form.trigger("captchaValue");
    } else {
      form.setValue("captchaValue", "");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="outline" asChild className="mb-4">
            <Link to="/case/001">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Case
            </Link>
          </Button>

          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Report Additional Information
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Submit additional evidence, witness testimony, or corrections to
                help improve case documentation.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Case Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Case Information</h4>
                    <FormField
                      control={form.control}
                      name="caseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Case ID (if known)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., FAR-2025-001"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Your Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="your.email@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Alternative Contact (Optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Phone or other contact method"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="relationship"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship to Victim</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select relationship" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="family">
                                  Family Member
                                </SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                                <SelectItem value="witness">Witness</SelectItem>
                                <SelectItem value="community">
                                  Community Member
                                </SelectItem>
                                <SelectItem value="organization">
                                  Organization Representative
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Information Type */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Type of Information</h4>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name="newEvidence"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              New Evidence (documents, photos, videos)
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="witnessTes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Witness Testimony
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="correction"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Correction to Existing Information
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormMessage />
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide detailed information..."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("newEvidence") && (
                      <FormField
                        control={form.control}
                        name="evidenceDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Evidence Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the evidence you're submitting..."
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                            {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">
                                File upload functionality would be implemented
                                here
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Accepted formats: PDF, DOCX, JPG, PNG, MP4
                              </p>
                            </div> */}
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Urgency Level */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="urgency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urgency Level</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  Low - General additional information
                                </SelectItem>
                                <SelectItem value="medium">
                                  Medium - Important details
                                </SelectItem>
                                <SelectItem value="high">
                                  High - Critical corrections
                                </SelectItem>
                                <SelectItem value="urgent">
                                  Urgent - Time-sensitive evidence
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Consent and Safety Disclaimers */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="consentAgreed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            I confirm that I have the right to share this
                            information and any media content included
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="safetyAcknowledged"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm leading-relaxed font-normal">
                            <span className="font-medium text-red-600">
                              Safety Acknowledgment:
                            </span>{" "}
                            I understand and acknowledge that I am solely
                            responsible for my own safety and security when
                            submitting this documentation. I take full
                            responsibility for any risks associated with my
                            submission, including but not limited to potential
                            retaliation, legal consequences, or other harm. The
                            platform provides no guarantee of protection and
                            assumes no responsibility for any consequences,
                            whether immediate or future, that may arise from my
                            act of submission.
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Warning Notices */}
                  <div className="space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        ⚠️ Please ensure all information is accurate and that
                        you have the right to share this documentation.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                        <span className="font-semibold">
                          IMPORTANT SAFETY NOTICE:
                        </span>{" "}
                        By proceeding with this submission, you acknowledge that
                        you are taking this action at your own risk and
                        discretion. This platform cannot and does not provide
                        any guarantees regarding your safety, anonymity, or
                        protection from potential consequences. You are strongly
                        advised to take all necessary precautions to protect
                        yourself and consult with appropriate security
                        professionals if you have concerns about your safety.
                      </p>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Security & Privacy</p>
                        <p className="text-muted-foreground">
                          All submissions are handled confidentially. We use
                          encryption to protect sensitive information and will
                          verify all additional information before adding it to
                          the case record.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  <FormField
                    control={form.control}
                    name="captchaValue"
                    render={() => (
                      <FormItem>
                        <div className="flex justify-center">
                          <ReCAPTCHA
                            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                            onExpired={() => handleCaptchaChange(null)}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit Additional Information"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReportAdditional;
