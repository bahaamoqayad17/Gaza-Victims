import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FourthStep({
  formData,
  additionalPhotos,
  evidenceFiles,
  isGraphicContent,
}) {
  return (
    <div className="space-y-6">
      <h4 className="font-semibold">Case Preview</h4>

      <Card>
        <CardHeader>
          <CardTitle>Victim Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Name:</span>{" "}
            {formData.name || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Age:</span>{" "}
            {formData.age || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Occupation:</span>{" "}
            {formData.occupation || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Background:</span>{" "}
            {formData.background || "Not provided"}
          </p>
          {additionalPhotos.length > 0 && (
            <div>
              <span className="font-medium">Additional Photos:</span>{" "}
              {additionalPhotos.length} uploaded
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Incident Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Date:</span>{" "}
            {formData.date || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Location:</span>{" "}
            {formData.location || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Circumstances:</span>{" "}
            {formData.circumstances || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Witnesses:</span>{" "}
            {formData.witnesses || "Not provided"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">Files:</span> {evidenceFiles.length}{" "}
            uploaded
          </p>
          <p>
            <span className="font-medium">Graphic Content:</span>{" "}
            {isGraphicContent ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-medium">Source:</span>{" "}
            {formData.source || "Not provided"}
          </p>
          <p>
            <span className="font-medium">Notes:</span>{" "}
            {formData.notes || "Not provided"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
