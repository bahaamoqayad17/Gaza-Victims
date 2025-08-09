import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Shield,
  Users,
  Globe,
  Heart,
  Hand,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validationSchemas";
import { useCreateContactMutation } from "@/store/api/apiSlice";
import { toast } from "sonner";
import { useState } from "react";

const About = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [createContact, { isLoading }] = useCreateContactMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const watchRecaptcha = watch("recaptcha");

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, type]);
    } else {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Determine contact type based on selected checkboxes
      let contactType = "general";
      if (selectedTypes.includes("technical")) contactType = "technical";
      else if (selectedTypes.includes("help")) contactType = "volunteer";
      else if (selectedTypes.includes("legal")) contactType = "legal";
      else if (selectedTypes.includes("other")) contactType = "other";

      const contactData = {
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        message: data.message,
        type: contactType,
      };

      await createContact(contactData).unwrap();

      toast.success("Thank you for contacting us! We'll get back to you soon.");
      setSubmitted(true);
      reset();
      setSelectedTypes([]);
    } catch (error) {
      console.error("Contact submission error:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data
          ? String(error.data.message)
          : "Failed to send message. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Message Sent Successfully!</h1>
            <p className="text-muted-foreground">
              Thank you for reaching out to us. We've received your message and
              will get back to you as soon as possible.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission Statement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                {t("ourMission")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                We are dedicated to documenting and preserving the memory of
                victims of violence, ensuring their stories are not forgotten
                and contributing to justice and accountability efforts
                worldwide.
              </p>
              <p>
                Every life has value, and every story deserves to be told.
                Through careful documentation and verification, we create a
                permanent record that honors the victims and supports legal and
                humanitarian efforts.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Truth & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Every case undergoes rigorous verification processes to ensure
                  accuracy and reliability for legal documentation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  Dignity & Respect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We treat every victim and their families with the utmost
                  dignity, respecting their privacy and cultural sensitivities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-purple-500" />
                  Global Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  We provide multilingual access to ensure communities worldwide
                  can document and access information in their native languages.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How We Work */}
          <Card>
            <CardHeader>
              <CardTitle>How We Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Documentation Process</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Secure submission system</li>
                    <li>• Multi-source verification</li>
                    <li>• Expert review and validation</li>
                    <li>• Secure archival storage</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Security Measures</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• End-to-end encryption</li>
                    <li>• Anonymous submission options</li>
                    <li>• Protected witness identities</li>
                    <li>• GDPR compliance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Can You Help */}
          <Card>
            <CardHeader>
              <CardTitle>How Can You Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                There are many ways to contribute to preserving memory and
                seeking justice:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Submit verified documentation</li>
                    <li>• Share witness testimonies</li>
                    <li>• Provide additional evidence</li>
                    <li>• Help with verification</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Technical expertise</li>
                    <li>• Translation services</li>
                    <li>• Legal assistance</li>
                    <li>• Advocacy efforts</li>
                  </ul>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> This platform is completely voluntary
                  and non-profit. All contributions are made by volunteers
                  dedicated to preserving memory and seeking accountability.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card id="contact">
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you need assistance, have questions about the documentation
                process, or require support as a survivor or family member,
                please reach out to us.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="mobile_number">Contact Number *</Label>
                  <Input
                    id="mobile_number"
                    placeholder="Your contact number"
                    {...register("mobile_number")}
                    className={errors.mobile_number ? "border-red-500" : ""}
                  />
                  {errors.mobile_number && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.mobile_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    rows={4}
                    {...register("message")}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Select all that apply:
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="technical"
                        checked={selectedTypes.includes("technical")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("technical", checked as boolean)
                        }
                      />
                      <Label htmlFor="technical" className="text-sm">
                        Report technical issue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="help"
                        checked={selectedTypes.includes("help")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("help", checked as boolean)
                        }
                      />
                      <Label htmlFor="help" className="text-sm">
                        We would like to help{" "}
                        <span className="bg-green-100 text-green-800 px-1 rounded text-xs">
                          Volunteer
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="legal"
                        checked={selectedTypes.includes("legal")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("legal", checked as boolean)
                        }
                      />
                      <Label htmlFor="legal" className="text-sm">
                        Legal violation
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={selectedTypes.includes("other")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("other", checked as boolean)
                        }
                      />
                      <Label htmlFor="other" className="text-sm">
                        Other
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recaptcha"
                    checked={watchRecaptcha || false}
                    onCheckedChange={(checked) =>
                      setValue("recaptcha", checked as boolean)
                    }
                  />
                  <Label htmlFor="recaptcha" className="text-sm">
                    I'm not a robot (reCAPTCHA) *
                  </Label>
                </div>
                {errors.recaptcha && (
                  <p className="text-sm text-red-500">
                    {errors.recaptcha.message}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
