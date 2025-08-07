import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { X } from "lucide-react";
import { Eye } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { Step3FormData } from "@/lib/validationSchemas";
import { useLanguage } from "../LanguageSelector";
import { useTranslation } from "@/lib/translations";

export default function ThirdStep({
  form,
  proofOfIdFiles,
  setProofOfIdFiles,
  removeProofOfIdFile,
  proofOfDeathFiles,
  setProofOfDeathFiles,
  removeProofOfDeathFile,
  isGraphicContent,
  setIsGraphicContent,
  additionalEvidenceFiles,
  setAdditionalEvidenceFiles,
  removeAdditionalEvidenceFile,
  isAdditionalEvidenceGraphic,
  setIsAdditionalEvidenceGraphic,
  newsLinks,
  updateNewsLink,
  removeNewsLink,
  addNewsLink,
}: {
  form: UseFormReturn<Step3FormData>;
  proofOfIdFiles: File[];
  setProofOfIdFiles: (files: File[]) => void;
  removeProofOfIdFile: (index: number) => void;
  proofOfDeathFiles: File[];
  setProofOfDeathFiles: (files: File[]) => void;
  removeProofOfDeathFile: (index: number) => void;
  isGraphicContent: boolean;
  setIsGraphicContent: (value: boolean) => void;
  additionalEvidenceFiles: File[];
  setAdditionalEvidenceFiles: (files: File[]) => void;
  removeAdditionalEvidenceFile: (index: number) => void;
  isAdditionalEvidenceGraphic: boolean;
  setIsAdditionalEvidenceGraphic: (value: boolean) => void;
  newsLinks: string[];
  updateNewsLink: (index: number, value: string) => void;
  removeNewsLink: (index: number) => void;
  addNewsLink: () => void;
}) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Evidence Collection Tutorial */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {t("evidenceCollectionTutorial")}
          </h4>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("videoTutorial")}: {t("safeEvidenceCollection")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duration: 2:30
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("watchTutorial")}
              </Button>
            </div>
            <div className="text-sm space-y-2">
              <h5 className="font-medium text-blue-900 dark:text-blue-100">
                {t("quickSafetyTips")}:
              </h5>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs">
                <li>• {t("useSecurePrivateNetworksWhenUploading")}</li>
                <li>• {t("removeMetadataFromPhotosIfSafetyIsAConcern")}</li>
                <li>• {t("considerUsingVPNForAdditionalPrivacy")}</li>
                <li>• {t("blurFacesOfLivingIndividualsForTheirProtection")}</li>
                <li>• {t("documentWithTimestampAndLocationWhenSafeToDoSo")}</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <Label>{t("proofOfId")}</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {t("uploadGovernmentId")}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {t("youCanAddMultiplePhotosAndVideos")}
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="mt-2"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setProofOfIdFiles((prev: File[]) =>
                  [...prev, ...files].slice(0, 20)
                );
              }}
            />
          </div>
          {proofOfIdFiles.length > 0 && (
            <div className="space-y-2 mt-2">
              {proofOfIdFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeProofOfIdFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>{t("proofOfDeath")}</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {t("uploadDeathCertificate")}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {t("youCanAddMultiplePhotosAndVideos")}
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              className="mt-2"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setProofOfDeathFiles((prev: File[]) =>
                  [...prev, ...files].slice(0, 20)
                );
              }}
            />
          </div>
          {proofOfDeathFiles.length > 0 && (
            <div className="space-y-2 mt-2">
              {proofOfDeathFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeProofOfDeathFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <FormField
            control={form.control}
            name="isGraphicContent"
            render={({ field }) => (
              <FormItem className="space-y-3 mt-4">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsGraphicContent(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    {t("thisEvidenceContainsGraphicContent")}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Label>{t("additionalEvidence")}</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {t("uploadDocumentsImagesVideosAudioFilesOrAnyOtherEvidence")}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {t("includeAnythingCapturedBeforeDuringOrAfterTheIncident")}
            </p>
            <Input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
              className="mt-2"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAdditionalEvidenceFiles((prev: File[]) => [
                  ...prev,
                  ...files,
                ]);
              }}
            />
          </div>
          {additionalEvidenceFiles.length > 0 && (
            <div className="space-y-2 mt-2">
              {additionalEvidenceFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAdditionalEvidenceFile(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <FormField
            control={form.control}
            name="isAdditionalEvidenceGraphic"
            render={({ field }) => (
              <FormItem className="space-y-3 mt-4">
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsAdditionalEvidenceGraphic(checked as boolean);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    {t("thisAdditionalEvidenceContainsGraphicContent")}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sourceOfInformation")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("howYouObtainedThisInformation")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relationshipToVictim"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("toTheVictimYouAre")}:</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectYourRelationship")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relative">{t("relative")}</SelectItem>
                    <SelectItem value="eyewitness">
                      {t("eyeWitness")}
                    </SelectItem>
                    <SelectItem value="journalist">
                      {t("journalist")}
                    </SelectItem>
                    <SelectItem value="volunteer">{t("volunteer")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label>{t("newsArticleLinks")} (Optional)</Label>
          <div className="space-y-2">
            {newsLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={t("linkToNewsArticleAboutThisCase")}
                  value={link}
                  onChange={(e) => updateNewsLink(index, e.target.value)}
                />
                {newsLinks.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeNewsLink(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {newsLinks.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewsLink}
                className="w-full"
              >
                + {t("addAnotherNewsArticleLink")}
              </Button>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("additionalNotes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("anyAdditionalRelevantInformation")}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
