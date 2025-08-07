import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { X } from "lucide-react";
import { Eye } from "lucide-react";
import { Download } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { Step1FormData } from "@/lib/validationSchemas";
import { useTranslation } from "@/lib/translations";
import { useLanguage } from "../LanguageSelector";

export default function FirstStep({
  form,
  socialMediaUrls,
  setAdditionalPhotos,
  setFamilyCounts,
  removeAdditionalPhoto,
  socialMediaPreview,
  familyCounts,
  additionalPhotos,
  updateSocialMediaUrl,
  handleSocialMediaFetch,
  addSocialMediaUrl,
  removeSocialMediaUrl,
}: {
  form: UseFormReturn<Step1FormData>;
  socialMediaUrls: string[];
  setAdditionalPhotos: (photos: File[]) => void;
  setFamilyCounts: (counts: any) => void;
  removeAdditionalPhoto: (index: number) => void;
  socialMediaPreview: string | null;
  familyCounts: any;
  additionalPhotos: File[];
  updateSocialMediaUrl: (index: number, value: string) => void;
  handleSocialMediaFetch: (index: number) => void;
  addSocialMediaUrl: () => void;
  removeSocialMediaUrl: (index: number) => void;
}) {
  const { currentLanguage } = useLanguage();

  const { t } = useTranslation(currentLanguage);
  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("fullName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("fullName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("age")}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={t("age")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("selectGender")}</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">{t("selectGender")}</option>
                    <option value="male">{t("male")}</option>
                    <option value="female">{t("female")}</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("occupationRole")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("occupationRole")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <Label>{t("theyLeaveBehind")}</Label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="father" />
                <Label htmlFor="father" className="text-sm">
                  {t("father")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mother" />
                <Label htmlFor="mother" className="text-sm">
                  {t("mother")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="wife" />
                <Label htmlFor="wife" className="text-sm">
                  {t("wife")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="husband" />
                <Label htmlFor="husband" className="text-sm">
                  {t("husband")}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox id="daughter" />
                  <Label htmlFor="daughter" className="text-sm">
                    {t("daughterS")}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        daughters: Math.max(0, prev.daughters - 1),
                      }))
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2 text-sm min-w-[20px] text-center">
                    {familyCounts.daughters}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        daughters: prev.daughters + 1,
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox id="son" />
                  <Label htmlFor="son" className="text-sm">
                    {t("sonS")}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        sons: Math.max(0, prev.sons - 1),
                      }))
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2 text-sm min-w-[20px] text-center">
                    {familyCounts.sons}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        sons: prev.sons + 1,
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox id="brother" />
                  <Label htmlFor="brother" className="text-sm">
                    {t("brotherS")}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        brothers: Math.max(0, prev.brothers - 1),
                      }))
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2 text-sm min-w-[20px] text-center">
                    {familyCounts.brothers}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        brothers: prev.brothers + 1,
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox id="sister" />
                  <Label htmlFor="sister" className="text-sm">
                    {t("sisterS")}
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        sisters: Math.max(0, prev.sisters - 1),
                      }))
                    }
                  >
                    -
                  </Button>
                  <span className="mx-2 text-sm min-w-[20px] text-center">
                    {familyCounts.sisters}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() =>
                      setFamilyCounts((prev: any) => ({
                        ...prev,
                        sisters: prev.sisters + 1,
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="grandfather" />
                <Label htmlFor="grandfather" className="text-sm">
                  {t("grandfather")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="grandmother" />
                <Label htmlFor="grandmother" className="text-sm">
                  {t("grandmother")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="other" />
                <Label htmlFor="other" className="text-sm">
                  {t("otherRelative")}
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="photo">{t("portraitPhoto")}</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("uploadDignified")}
            </p>
            <Input type="file" accept="image/*" className="mt-2" />
          </div>
        </div>

        <div>
          <Label>{t("additionalPhotos")}</Label>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <UploadIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              {t("uploadAdditionalPhotos")}
            </p>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="mt-2"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setAdditionalPhotos((prev) => [...prev, ...files].slice(0, 5));
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t("additionalPhotosNote")}
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
          <Label htmlFor="socialMedia">{t("socialMediaContent")}</Label>
          <p className="text-sm text-muted-foreground mb-2">
            {t("socialMediaNote")}
          </p>
          <div className="space-y-2">
            {socialMediaUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={t("socialMediaPlaceholder")}
                  value={url}
                  onChange={(e) => updateSocialMediaUrl(index, e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => handleSocialMediaFetch(index)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                {socialMediaUrls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocialMediaUrl(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {socialMediaUrls.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocialMediaUrl}
                className="w-full"
              >
                {t("addAnotherSocialMediaLink")}
              </Button>
            )}
            {socialMediaPreview && (
              <div className="border rounded p-2">
                <p className="text-sm text-muted-foreground mb-2">
                  {t("preview")}
                </p>
                <img
                  src={socialMediaPreview}
                  alt="Social media preview"
                  className="w-full max-w-xs rounded"
                />
                <Button size="sm" variant="outline" className="mt-2">
                  <Eye className="w-3 h-3 mr-1" />
                  {t("blurFaces")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="background"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("background")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("backgroundPlaceholder")}
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
