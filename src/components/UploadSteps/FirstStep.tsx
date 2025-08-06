import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { X } from "lucide-react";
import { Eye } from "lucide-react";
import { Download } from "lucide-react";
import { Textarea } from "../ui/textarea";

export default function FirstStep({
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
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Full name" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" placeholder="Age" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input id="occupation" placeholder="Occupation or role" />
        </div>
      </div>

      <div>
        <Label>They leave behind</Label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="father" />
              <Label htmlFor="father" className="text-sm">
                Father
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mother" />
              <Label htmlFor="mother" className="text-sm">
                Mother
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="wife" />
              <Label htmlFor="wife" className="text-sm">
                Wife
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="husband" />
              <Label htmlFor="husband" className="text-sm">
                Husband
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-2 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox id="daughter" />
                <Label htmlFor="daughter" className="text-sm">
                  Daughter(s)
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    setFamilyCounts((prev) => ({
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
                    setFamilyCounts((prev) => ({
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
                  Son(s)
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    setFamilyCounts((prev) => ({
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
                    setFamilyCounts((prev) => ({
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
                  Brother(s)
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    setFamilyCounts((prev) => ({
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
                    setFamilyCounts((prev) => ({
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
                  Sister(s)
                </Label>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() =>
                    setFamilyCounts((prev) => ({
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
                    setFamilyCounts((prev) => ({
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
                Grandfather
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="grandmother" />
              <Label htmlFor="grandmother" className="text-sm">
                Grandmother
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="other" />
              <Label htmlFor="other" className="text-sm">
                Other Relative
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="photo">Portrait Photo</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
          <UploadIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Upload a dignified portrait photo
          </p>
          <Input type="file" accept="image/*" className="mt-2" />
        </div>
      </div>

      <div>
        <Label>Additional Photos and Videos (up to 5)</Label>
        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
          <UploadIcon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Upload additional photos showing the person's life
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
          ⚠️ Note: Any other person appearing in photos must consent or be
          blurred prior to uploading
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
        <Label htmlFor="socialMedia">Social Media Content</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Note: Link photos or videos directly from the victim's social media
          page and the media will be extracted and added in their profile.
        </p>
        <div className="space-y-2">
          {socialMediaUrls.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Paste URL from social media post (Instagram, Facebook, etc.)"
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
              + Add another social media link
            </Button>
          )}
          {socialMediaPreview && (
            <div className="border rounded p-2">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <img
                src={socialMediaPreview}
                alt="Social media preview"
                className="w-full max-w-xs rounded"
              />
              <Button size="sm" variant="outline" className="mt-2">
                <Eye className="w-3 h-3 mr-1" />
                Blur faces
              </Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="background">Background</Label>
        <Textarea
          id="background"
          placeholder="Brief background about the victim's life..."
          rows={3}
        />
      </div>
    </div>
  );
}
