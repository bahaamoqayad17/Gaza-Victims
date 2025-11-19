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
import { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const About = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

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

  const handleTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes((prev) => [...prev, type]);
    } else {
      setSelectedTypes((prev) => prev.filter((t) => t !== type));
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Check if reCAPTCHA is completed
      if (!recaptchaValue) {
        toast.error("Please complete the reCAPTCHA verification");
        return;
      }

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
        recaptcha: recaptchaValue as string, // Already validated above
      };

      await createContact(contactData).unwrap();

      toast.success(t("aboutPageContactSuccessToast"));
      setSubmitted(true);
      reset();
      setSelectedTypes([]);
      setRecaptchaValue(null);
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
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
          : t("aboutPageContactErrorToast");
      toast.error(errorMessage);
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaValue(null);
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
            <h1 className="text-2xl font-bold">
              {t("aboutPageContactSuccessTitle")}
            </h1>
            <p className="text-muted-foreground">
              {t("aboutPageContactSuccessMessage")}
            </p>
            <Button onClick={() => setSubmitted(false)}>
              {t("aboutPageContactSendAnother")}
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
                {t("aboutPageMissionDescription1")}
              </p>
              <p>{t("aboutPageMissionDescription2")}</p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-blue-500" />
                  {t("aboutPageTruthVerification")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("aboutPageTruthDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-500" />
                  {t("aboutPageDignityRespect")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("aboutPageDignityDescription")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-purple-500" />
                  {t("aboutPageGlobalAccess")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{t("aboutPageGlobalDescription")}</p>
              </CardContent>
            </Card>
          </div>

          {/* How We Work */}
          <Card>
            <CardHeader>
              <CardTitle>{t("aboutPageHowWeWork")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("aboutPageDocumentationProcess")}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t("aboutPageSecureSubmission")}</li>
                    <li>• {t("aboutPageMultiSourceVerification")}</li>
                    <li>• {t("aboutPageExpertReview")}</li>
                    <li>• {t("aboutPageSecureArchival")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("aboutPageSecurityMeasures")}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t("aboutPageEndToEndEncryption")}</li>
                    <li>• {t("aboutPageAnonymousSubmission")}</li>
                    <li>• {t("aboutPageProtectedWitness")}</li>
                    <li>• {t("aboutPageGdprCompliance")}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Can You Help */}
          <Card>
            <CardHeader>
              <CardTitle>{t("aboutPageHowCanYouHelp")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{t("aboutPageManyWaysContribute")}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("aboutPageDocumentation")}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t("aboutPageSubmitVerified")}</li>
                    <li>• {t("aboutPageShareWitness")}</li>
                    <li>• {t("aboutPageProvideEvidence")}</li>
                    <li>• {t("aboutPageHelpVerification")}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    {t("aboutPageSupport")}
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• {t("aboutPageTechnicalExpertise")}</li>
                    <li>• {t("aboutPageTranslationServices")}</li>
                    <li>• {t("aboutPageLegalAssistance")}</li>
                    <li>• {t("aboutPageAdvocacyEfforts")}</li>
                  </ul>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> {t("aboutPageVoluntaryNote")}
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
              <p>{t("aboutPageContactDescription")}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      {t("aboutPageContactNameLabel")}
                    </Label>
                    <Input
                      id="name"
                      placeholder={t("aboutPageContactNamePlaceholder")}
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
                    <Label htmlFor="email">
                      {t("aboutPageContactEmailLabel")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("aboutPageContactEmailPlaceholder")}
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
                  <Label htmlFor="mobile_number">
                    {t("aboutPageContactPhoneLabel")}
                  </Label>
                  <Input
                    id="mobile_number"
                    placeholder={t("aboutPageContactPhonePlaceholder")}
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
                  <Label htmlFor="message">
                    {t("aboutPageContactMessageLabel")}
                  </Label>
                  <Textarea
                    id="message"
                    placeholder={t("aboutPageContactMessagePlaceholder")}
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
                    {t("aboutPageContactSelectApply")}
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
                        {t("aboutPageContactTechnicalIssue")}
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
                        {t("aboutPageContactHelp")}{" "}
                        <span className="bg-green-100 text-green-800 px-1 rounded text-xs">
                          {t("aboutPageContactVolunteer")}
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
                        {t("aboutPageContactLegalViolation")}
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
                        {t("aboutPageContactOther")}
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("aboutPageContactRecaptcha")}
                  </Label>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(value) => {
                        setRecaptchaValue(value || null);
                        setValue("recaptcha", value || "");
                      }}
                      onExpired={() => {
                        setRecaptchaValue(null);
                        setValue("recaptcha", "");
                      }}
                      onError={() => {
                        setRecaptchaValue(null);
                        setValue("recaptcha", "");
                        toast.error("reCAPTCHA error. Please try again.");
                      }}
                    />
                  </div>
                  {errors.recaptcha && (
                    <p className="text-sm text-red-500">
                      {errors.recaptcha.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("aboutPageContactSending")}
                    </>
                  ) : (
                    t("aboutPageContactSubmit")
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
