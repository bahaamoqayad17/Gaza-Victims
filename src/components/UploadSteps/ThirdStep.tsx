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

export default function ThirdStep({
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
}) {
  return (
    <div className="space-y-6">
      {/* Evidence Collection Tutorial */}
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Evidence Collection Tutorial
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
                  Video Tutorial: Safe Evidence Collection
                </p>
                <p className="text-xs text-muted-foreground">Duration: 2:30</p>
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
              Watch Tutorial
            </Button>
          </div>
          <div className="text-sm space-y-2">
            <h5 className="font-medium text-blue-900 dark:text-blue-100">
              Quick Safety Tips:
            </h5>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs">
              <li>• Use secure, private networks when uploading</li>
              <li>• Remove metadata from photos if safety is a concern</li>
              <li>• Consider using VPN for additional privacy</li>
              <li>• Blur faces of living individuals for their protection</li>
              <li>• Document with timestamp and location when safe to do so</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <Label>Proof of ID</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload government ID, passport, or identity documents
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            You can add multiple photos and videos (up to 20 items). If
            possible, also take video of the ID document.
          </p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="mt-2"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setProofOfIdFiles((prev) => [...prev, ...files].slice(0, 20));
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
        <Label>Proof of Death</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload death certificate, medical reports, or documentation of death
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            You can add multiple photos and videos (up to 20 items). If
            possible, also take video of the victim's face and body for
            identification.
          </p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="mt-2"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setProofOfDeathFiles((prev) => [...prev, ...files].slice(0, 20));
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
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="graphic"
              checked={isGraphicContent}
              onCheckedChange={(checked) =>
                setIsGraphicContent(checked as boolean)
              }
            />
            <Label htmlFor="graphic" className="text-sm">
              This evidence contains graphic content
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label>Additional Evidence</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload documents, images, videos, audio files, or any other evidence
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            Include anything captured before, during, or after the incident that
            is related to this case.
          </p>
          <Input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
            className="mt-2"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setAdditionalEvidenceFiles((prev) => [...prev, ...files]);
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
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="additionalEvidenceGraphic"
              checked={isAdditionalEvidenceGraphic}
              onCheckedChange={(checked) =>
                setIsAdditionalEvidenceGraphic(checked as boolean)
              }
            />
            <Label htmlFor="additionalEvidenceGraphic" className="text-sm">
              This additional evidence contains graphic content
            </Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="source">Source of Information</Label>
        <Input id="source" placeholder="How you obtained this information" />
      </div>

      <div>
        <Label htmlFor="relationship">To the victim you are:</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select your relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relative">Relative</SelectItem>
            <SelectItem value="eyewitness">Eye witness</SelectItem>
            <SelectItem value="journalist">Journalist</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>News Article Links (Optional)</Label>
        <div className="space-y-2">
          {newsLinks.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Link to news article about this case"
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
              + Add another news article link
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any additional relevant information..."
          rows={3}
        />
      </div>
    </div>
  );
}
