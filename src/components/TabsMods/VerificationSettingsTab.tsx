import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export const VerificationSettingsTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Verification Levels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Documentation Level</Label>
            <p className="text-sm text-muted-foreground">
              Basic documentation with source verification
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Documented</Badge>
              <span className="text-sm">Requires 1 moderator approval</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Verified Level</Label>
            <p className="text-sm text-muted-foreground">
              Cross-referenced with multiple sources
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="default">Verified</Badge>
              <span className="text-sm">Requires 2 moderator approvals</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Third Party Verified</Label>
            <p className="text-sm text-muted-foreground">
              External organization confirmation
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="destructive">Third Party Verified</Badge>
              <span className="text-sm">Requires external verifier</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Third Party Organizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Human Rights Watch</div>
                <div className="text-sm text-muted-foreground">
                  Active verifier
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Amnesty International</div>
                <div className="text-sm text-muted-foreground">
                  Pending activation
                </div>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">Syria Justice Network</div>
                <div className="text-sm text-muted-foreground">
                  Regional verifier
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Organization
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
