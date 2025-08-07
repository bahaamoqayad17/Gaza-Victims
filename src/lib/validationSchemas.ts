import { z } from "zod";

// Step 1: Victim Information
export const step1Schema = z.object({
  name: z.string().min(1, "nameRequired"),
  age: z
    .string()
    .min(1, "ageRequired")
    .refine((val) => {
      const age = parseInt(val);
      return !isNaN(age) && age > 0 && age <= 120;
    }, "ageValidRange"),
  gender: z.string().min(1, "genderRequired"),
  occupation: z.string().optional(),
  background: z.string().optional(),
  portraitPhoto: z.instanceof(File).optional(),
  additionalPhotos: z.array(z.instanceof(File)).optional(),
  socialMediaUrls: z.array(z.string()).optional(),
});

// Step 2: Incident Details
export const step2Schema = z.object({
  date: z.string().min(1, "dateRequired"),
  location: z.string().min(1, "locationRequired"),
  cause: z.string().min(1, "causeRequired"),
  otherCauseDetails: z.string().optional(),
  circumstances: z.string().min(1, "circumstancesRequired"),
  perpetrator: z.string().min(1, "perpetratorRequired"),
  otherPerpetratorDetails: z.string().optional(),
  perpetratorEvidence: z.string().min(1, "perpetratorEvidenceRequired"),
  witnesses: z.string().optional(),
});

// Step 3: Documentation
export const step3Schema = z.object({
  isGraphicContent: z.boolean(),
  isAdditionalEvidenceGraphic: z.boolean(),
  source: z.string().min(1, "sourceRequired"),
  relationshipToVictim: z.string().min(1, "relationshipRequired"),
  newsLinks: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Step 4: Preview (no validation needed as it's just a preview)
export const step4Schema = z.object({});

// Step 5: Review & Submit
export const step5Schema = z.object({
  consentAgreed: z.boolean().refine((val) => val === true, "consentRequired"),
  safetyAcknowledged: z
    .boolean()
    .refine((val) => val === true, "safetyAcknowledgmentRequired"),
  captchaValue: z.string().min(1, "captchaRequired"),
});

// Combined schema for the entire form
export const uploadFormSchema = z.object({
  // Step 1
  name: z.string().min(1, "nameRequired"),
  age: z
    .string()
    .min(1, "ageRequired")
    .refine((val) => {
      const age = parseInt(val);
      return !isNaN(age) && age > 0 && age <= 120;
    }, "ageValidRange"),
  gender: z.string().min(1, "genderRequired"),
  occupation: z.string().optional(),
  background: z.string().optional(),
  portraitPhoto: z.instanceof(File).optional(),
  additionalPhotos: z.array(z.instanceof(File)).optional(),
  socialMediaUrls: z.array(z.string()).optional(),

  // Step 2
  date: z.string().min(1, "dateRequired"),
  location: z.string().min(1, "locationRequired"),
  cause: z.string().min(1, "causeRequired"),
  otherCauseDetails: z.string().optional(),
  circumstances: z.string().min(1, "circumstancesRequired"),
  perpetrator: z.string().min(1, "perpetratorRequired"),
  otherPerpetratorDetails: z.string().optional(),
  perpetratorEvidence: z.string().min(1, "perpetratorEvidenceRequired"),
  witnesses: z.string().optional(),

  // Step 3
  isGraphicContent: z.boolean(),
  isAdditionalEvidenceGraphic: z.boolean(),
  source: z.string().min(1, "sourceRequired"),
  relationshipToVictim: z.string().min(1, "relationshipRequired"),
  newsLinks: z.array(z.string()).optional(),
  notes: z.string().optional(),

  // Step 5
  consentAgreed: z.boolean().refine((val) => val === true, "consentRequired"),
  safetyAcknowledged: z
    .boolean()
    .refine((val) => val === true, "safetyAcknowledgmentRequired"),
  captchaValue: z.string().min(1, "captchaRequired"),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type UploadFormData = z.infer<typeof uploadFormSchema>;
