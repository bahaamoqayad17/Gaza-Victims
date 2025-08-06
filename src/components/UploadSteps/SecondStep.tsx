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

export default function SecondStep({
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
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date of Incident (DD/MM/YYYY)</Label>
          <Input id="date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="City, Country" />
        </div>
      </div>

      <div>
        <Label htmlFor="cause">Cause of Death</Label>
        <Select value={cause} onValueChange={setCause}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select cause of death" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="bombing">Bombing</SelectItem>
            <SelectItem value="shooting">Shooting</SelectItem>
            <SelectItem value="torture">Torture</SelectItem>
            <SelectItem value="intentional-starvation">
              Intentional Starvation
            </SelectItem>
            <SelectItem value="detention-related">
              Detention Related Death
            </SelectItem>
            <SelectItem value="forced-disappearance">
              Forced Disappearance
            </SelectItem>
            <SelectItem value="targeted-killing">Targeted Killing</SelectItem>
            <SelectItem value="medical-negligence">
              Medical Negligence/Denial of Care
            </SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {cause === "other" && (
          <div className="mt-2">
            <Label htmlFor="otherCause">Please specify</Label>
            <Input
              id="otherCause"
              value={otherCauseDetails}
              onChange={(e) => setOtherCauseDetails(e.target.value)}
              placeholder="Please describe the cause of death"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="circumstances">Circumstances</Label>
        <Textarea
          id="circumstances"
          placeholder="Description of what happened..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="perpetrator">Perpetrator</Label>
        <Select value={perpetrator} onValueChange={setPerpetrator}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select perpetrator type" />
          </SelectTrigger>
          <SelectContent className="bg-background border shadow-lg z-50">
            <SelectItem value="military-forces">Military Forces</SelectItem>
            <SelectItem value="police-forces">Police Forces</SelectItem>
            <SelectItem value="armed-militia">Armed Militia</SelectItem>
            <SelectItem value="terrorist-group">Terrorist Group</SelectItem>
            <SelectItem value="criminal-organization">
              Criminal Organization
            </SelectItem>
            <SelectItem value="government-officials">
              Government Officials
            </SelectItem>
            <SelectItem value="unknown-perpetrator">
              Unknown Perpetrator
            </SelectItem>
            <SelectItem value="civilian">Civilian</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {perpetrator === "other" && (
          <div className="mt-2">
            <Label htmlFor="otherPerpetrator">Please specify</Label>
            <Input
              id="otherPerpetrator"
              value={otherPerpetratorDetails}
              onChange={(e) => setOtherPerpetratorDetails(e.target.value)}
              placeholder="Please describe the perpetrator"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="perpetratorEvidence">
          How do you know they are the ones who did it?
        </Label>
        <Textarea
          id="perpetratorEvidence"
          value={perpetratorEvidence}
          onChange={(e) => setPerpetratorEvidence(e.target.value)}
          placeholder="Describe the evidence or reasoning that identifies this perpetrator..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="witnesses">Witness Information (Optional)</Label>
        <Textarea
          id="witnesses"
          placeholder="Any witness accounts or references..."
          rows={2}
        />
      </div>
    </div>
  );
}
