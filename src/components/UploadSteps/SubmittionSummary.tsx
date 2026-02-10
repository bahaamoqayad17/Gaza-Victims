import { Checkbox } from "@/components/ui/checkbox";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { Step5FormData } from "@/lib/validationSchemas";
import { useLanguage } from "../LanguageSelector";
import { useTranslation } from "@/lib/translations";

export default function SubmittionSummary({
  form,
  formData,
  setFormData,
  setCaptchaValue,
}: {
  form: UseFormReturn<Step5FormData>;
  formData: {
    name: string;
    age: string;
    occupation: string;
    background: string;
    date: string;
    location: string;
    circumstances: string;
    witnesses: string;
    source: string;
    notes: string;
    consentAgreed: boolean;
    safetyAcknowledged: boolean;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      age: string;
      occupation: string;
      background: string;
      date: string;
      location: string;
      circumstances: string;
      witnesses: string;
      source: string;
      notes: string;
      consentAgreed: boolean;
      safetyAcknowledged: boolean;
    }>
  >;
  setCaptchaValue: (value: string | null) => void;
}) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">{t("submissionSummary")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t("yourIdentityRemainsCompletelyAnonymous")}</li>
            <li>• {t("allFilesAreEncryptedDuringTransmission")}</li>
            <li>• {t("caseWillBeReviewedBeforePublication")}</li>
            <li>• {t("youWillReceiveAReferenceNumberForTracking")}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="consentAgreed"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm">
                  {t(
                    "iConfirmThatIHaveTheRightToShareThisInformationAndAnyMediaContentIncluded"
                  )}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyAcknowledged"
            render={({ field }) => (
              <FormItem className="flex items-start space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm leading-relaxed">
                  <span className="font-medium text-red-600">
                    {t("safetyAcknowledgment")}:
                  </span>{" "}
                  {t(
                    "iUnderstandAndAcknowledgeThatISolelyResponsibleForMyOwnSafetyAndSecurityWhenSubmittingThisDocumentation"
                  )}
                  {/* {t(
                    "iTakeFullResponsibilityForAnyRisksAssociatedWithMySubmissionIncludingButNotLimitedToPotentialRetaliationLegalConsequencesOrOtherHarm"
                  )}
                  {t(
                    "thePlatformProvidesNoGuaranteeOfProtectionAndAssumesNoResponsibilityForAnyConsequencesWhetherImmediateOrFutureThatMayAriseFromMyActOfSubmission"
                  )} */}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️{" "}
            {t(
              "pleaseEnsureAllInformationIsAccurateAndThatYouHaveTheRightToShareThisDocumentation"
            )}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
            <span className="font-semibold">{t("importantSafetyNotice")}:</span>{" "}
            {t(
              "byProceedingWithThisSubmissionYouAcknowledgeThatYouAreTakingThisActionAtYourOwnRiskAndDiscretion"
            )}
            {/* {t(
              "thisPlatformCannotAndDoesNotProvideAnyGuaranteesRegardingYourSafetyAnonymityOrProtectionFromPotentialConsequences"
            )}
            {t(
              "youAreStronglyAdvisedToTakeAllNecessaryPrecautionsToProtectYourselfAndConsultWithAppropriateSecurityProfessionalsIfYouHaveConcernsAboutYourSafety"
            )} */}
          </p>
        </div>

        {/* Captcha */}
        <FormField
          control={form.control}
          name="captchaValue"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(value) => {
                      field.onChange(value);
                      setCaptchaValue(value);
                    }}
                    onExpired={() => {
                      field.onChange("");
                      setCaptchaValue(null);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
