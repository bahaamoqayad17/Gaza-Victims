import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { Step2FormData } from "@/lib/validationSchemas";
import { useLanguage } from "../LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { InteractiveMap } from "../InteractiveMap";
import { useState } from "react";
import { MapPin } from "lucide-react";

export default function SecondStep({
  form,
  cause,
  setCause,
  otherCauseDetails,
  setOtherCauseDetails,
  perpetrator,
  otherPerpetratorDetails,
  setOtherPerpetratorDetails,
  perpetratorEvidence,
  setPerpetratorEvidence,
  setPerpetrator,
}: {
  form: UseFormReturn<Step2FormData>;
  cause: string;
  setCause: (cause: string) => void;
  otherCauseDetails: string;
  setOtherCauseDetails: (details: string) => void;
  perpetrator: string;
  otherPerpetratorDetails: string;
  setOtherPerpetratorDetails: (details: string) => void;
  perpetratorEvidence: string;
  setPerpetratorEvidence: (evidence: string) => void;
  setPerpetrator: (perpetrator: string) => void;
}) {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dateOfIncident")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="locationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("location")}</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InteractiveMap
          onLocationSelect={(loc) => {
            form.setValue("location.lat", loc.lat.toString(), {
              shouldValidate: true,
            });
            form.setValue("location.lng", loc.lng.toString(), {
              shouldValidate: true,
            });

            setSelectedCoordinates(loc);

            if (!form.getValues("locationName")) {
              form.setValue(
                "locationName",
                `${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`
              );
            }
          }}
          enableSelection={true}
        />

        {/* Display selected coordinates */}
        {selectedCoordinates && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Location Selected:</span>
              <span>
                {selectedCoordinates.lat.toFixed(6)},{" "}
                {selectedCoordinates.lng.toFixed(6)}
              </span>
            </div>
          </div>
        )}

        {/* Hidden fields for location object */}
        <FormField
          control={form.control}
          name="location.lat"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.lng"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cause"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("causeOfDeath")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCause(value);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t("selectCauseOfDeath")} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="bombing">{t("bombing")}</SelectItem>
                    <SelectItem value="shooting">{t("shooting")}</SelectItem>
                    <SelectItem value="torture">{t("torture")}</SelectItem>
                    <SelectItem value="intentional-starvation">
                      {t("intentionalStarvation")}
                    </SelectItem>
                    <SelectItem value="detention-related">
                      {t("detentionRelatedDeath")}
                    </SelectItem>
                    <SelectItem value="forced-disappearance">
                      {t("forcedDisappearance")}
                    </SelectItem>
                    <SelectItem value="targeted-killing">
                      {t("targetedKilling")}
                    </SelectItem>
                    <SelectItem value="medical-negligence">
                      {t("medicalNegligence")}
                    </SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {cause === "other" && (
          <div className="mt-2">
            <Label htmlFor="otherCause">{t("pleaseSpecify")}</Label>
            <Input
              id="otherCause"
              value={otherCauseDetails}
              onChange={(e) => setOtherCauseDetails(e.target.value)}
              placeholder={t("pleaseDescribeTheCauseOfDeath")}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="circumstances"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("circumstances")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("descriptionOfWhatHappened")}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="perpetrator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("perpetrator")}</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setPerpetrator(value);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t("selectPerpetratorType")} />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="military-forces">
                      {t("militaryForces")}
                    </SelectItem>
                    <SelectItem value="police-forces">
                      {t("policeForces")}
                    </SelectItem>
                    <SelectItem value="armed-militia">
                      {t("armedMilitia")}
                    </SelectItem>
                    <SelectItem value="terrorist-group">
                      {t("terroristGroup")}
                    </SelectItem>
                    <SelectItem value="criminal-organization">
                      {t("criminalOrganization")}
                    </SelectItem>
                    <SelectItem value="government-officials">
                      {t("governmentOfficials")}
                    </SelectItem>
                    <SelectItem value="unknown-perpetrator">
                      {t("unknownPerpetrator")}
                    </SelectItem>
                    <SelectItem value="civilian">{t("civilian")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {perpetrator === "other" && (
          <div className="mt-2">
            <Label htmlFor="otherPerpetrator">{t("pleaseSpecify")}</Label>
            <Input
              id="otherPerpetrator"
              value={otherPerpetratorDetails}
              onChange={(e) => setOtherPerpetratorDetails(e.target.value)}
              placeholder={t("pleaseDescribeThePerpetrator")}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="perpetratorEvidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("howDoYouKnowTheyAreTheOnesWhoDidIt")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("describeTheEvidenceOrReasoning")}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="witnesses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("witnessInformation")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("anyWitnessAccountsOrReferences")}
                  rows={2}
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
