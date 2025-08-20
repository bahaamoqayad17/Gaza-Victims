import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  Send,
  Plus,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import ReCAPTCHA from "react-google-recaptcha";
import {
  reportCaseSchema,
  type ReportCaseFormData,
} from "@/lib/validationSchemas";
import { useToast } from "@/hooks/use-toast";
import { useCreateReportMutation } from "@/store/api/apiSlice";

const ReportCase = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { toast } = useToast();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createReport] = useCreateReportMutation();

  // React Hook Form setup
  const form = useForm<ReportCaseFormData>({
    resolver: zodResolver(reportCaseSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      message: "",
      reportType: [],
      caseId: "",
      urgency: "medium",
      captchaValue: "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: ReportCaseFormData) => {
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
      // Prepare data for API call
      const reportData = {
        name: data.name,
        email: data.email,
        contact_info: data.contact || undefined,
        message: data.message,
        caseId: data.caseId || undefined,
        relation_to_victim: undefined,
        report_type: data.reportType,
        urgency: data.urgency,
        type: data.reportType, // Backend expects both report_type and type
        captchaValue: captchaValue,
      };

      await createReport(reportData).unwrap();

      toast({
        title: "Report Submitted",
        description:
          "Your report has been submitted successfully. We will review it and get back to you.",
      });

      // Reset form after successful submission
      form.reset();
      setCaptchaValue(null);
    } catch (error: unknown) {
      console.error("Error submitting report:", error);

      // Handle specific error messages from backend
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "There was an error submitting your report. Please try again.";

      toast({
        title: "Submission Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportTypeChange = (
    typeId: string,
    label: string,
    checked: boolean
  ) => {
    const currentTypes = form.getValues("reportType");
    if (checked) {
      form.setValue("reportType", [...currentTypes, label]);
    } else {
      form.setValue(
        "reportType",
        currentTypes.filter((t) => t !== label)
      );
    }
    // Trigger validation
    form.trigger("reportType");
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
          {/* Report Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                {t("submitCase")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("reportFormDescription")}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">{t("contactInformation")}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("name")}</FormLabel>
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
                            <FormLabel>Email</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Contact (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Phone number or alternative contact method"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Report Type */}
                  <FormField
                    control={form.control}
                    name="reportType"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base font-medium">
                            Report Type
                          </FormLabel>
                        </div>
                        <div className="space-y-3">
                          {[
                            {
                              id: "technical",
                              label: "Report technical issue",
                            },
                            { id: "help", label: "We would like to help" },
                            { id: "violation", label: "Legal violation" },
                            { id: "other", label: "Other" },
                          ].map((type) => (
                            <FormField
                              key={type.id}
                              control={form.control}
                              name="reportType"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          type.label
                                        )}
                                        onCheckedChange={(checked) => {
                                          handleReportTypeChange(
                                            type.id,
                                            type.label,
                                            checked as boolean
                                          );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {type.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Case Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Case Information (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="caseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Case ID</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="If reporting about a specific case"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                                  <SelectValue placeholder="Select urgency level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please provide detailed information about your report..."
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Security Notice */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Security & Privacy</p>
                        <p className="text-muted-foreground">
                          Your report will be handled confidentially. We use
                          encryption to protect sensitive information and will
                          only share details with authorized personnel as
                          necessary for investigation.
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
                    {isSubmitting ? "Submitting..." : "Submit Report"}
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

export default ReportCase;
