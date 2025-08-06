import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ReCAPTCHA from "react-google-recaptcha";

export default function SubmittionSummary({
  formData,
  setFormData,
  setCaptchaValue,
}) {
  return (
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
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                consentAgreed: checked as boolean,
              }))
            }
          />
          <Label htmlFor="consent" className="text-sm">
            I confirm that I have the right to share this information and any
            media content included
          </Label>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="safety-acknowledgment"
            checked={formData.safetyAcknowledged}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                safetyAcknowledged: checked as boolean,
              }))
            }
            required
          />
          <Label
            htmlFor="safety-acknowledgment"
            className="text-sm leading-relaxed"
          >
            <span className="font-medium text-red-600">
              Safety Acknowledgment:
            </span>{" "}
            I understand and acknowledge that I am solely responsible for my own
            safety and security when submitting this documentation. I take full
            responsibility for any risks associated with my submission,
            including but not limited to potential retaliation, legal
            consequences, or other harm. The platform provides no guarantee of
            protection and assumes no responsibility for any consequences,
            whether immediate or future, that may arise from my act of
            submission.
          </Label>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          ⚠️ Please ensure all information is accurate and that you have the
          right to share this documentation.
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
          <span className="font-semibold">IMPORTANT SAFETY NOTICE:</span> By
          proceeding with this submission, you acknowledge that you are taking
          this action at your own risk and discretion. This platform cannot and
          does not provide any guarantees regarding your safety, anonymity, or
          protection from potential consequences. You are strongly advised to
          take all necessary precautions to protect yourself and consult with
          appropriate security professionals if you have concerns about your
          safety.
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
  );
}
