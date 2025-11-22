import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  FileImage,
  FileVideo,
  Filter,
  Calendar,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LanguageSelector, useLanguage } from "@/components/LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useDownloadArchiveMutation } from "@/store/api/apiSlice";
import { useToast } from "@/hooks/use-toast";

const DownloadArchive = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { toast } = useToast();
  const [downloadArchive, { isLoading }] = useDownloadArchiveMutation();

  const [includeMedia, setIncludeMedia] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);
  const [includeVideos, setIncludeVideos] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleDownload = async () => {
    try {
      console.log("Downloading archive with filters:", {
        includeMedia,
        includePhotos,
        includeVideos,
        statusFilter,
        locationFilter,
        dateFrom,
        dateTo,
      });

      const result = await downloadArchive({
        includeMedia,
        includePhotos,
        includeVideos,
        statusFilter,
        locationFilter,
        dateFrom,
        dateTo,
      }).unwrap();

      // Create blob and trigger download
      const blob = new Blob([result], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gaza-victims-archive-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: t("archiveDownloadStarted"),
        description: t("archiveDownloadStartedDescription"),
      });
    } catch (error) {
      console.error("Error downloading archive:", error);
      toast({
        title: t("downloadFailed"),
        description: t("downloadFailedDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Download Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                {t("archiveDownloadOptions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Options */}
              <div className="space-y-4">
                <h4 className="font-medium">{t("mediaContent")}</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-media"
                      checked={includeMedia}
                      onCheckedChange={(checked) =>
                        setIncludeMedia(checked as boolean)
                      }
                    />
                    <Label htmlFor="include-media">
                      {t("includeMediaFiles")}
                    </Label>
                  </div>

                  {includeMedia && (
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-photos"
                          checked={includePhotos}
                          onCheckedChange={(checked) =>
                            setIncludePhotos(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="include-photos"
                          className="flex items-center gap-2"
                        >
                          <FileImage className="w-4 h-4" />
                          {t("photos")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-videos"
                          checked={includeVideos}
                          onCheckedChange={(checked) =>
                            setIncludeVideos(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="include-videos"
                          className="flex items-center gap-2"
                        >
                          <FileVideo className="w-4 h-4" />
                          {t("videos")}
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Filters */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t("contentFilters")}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">{t("status")}</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue placeholder={t("allStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allStatus")}</SelectItem>
                        <SelectItem value="documented">
                          {t("documented")}
                        </SelectItem>
                        <SelectItem value="verified">
                          {t("verified")}
                        </SelectItem>
                        <SelectItem value="investigating">
                          {t("investigating")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location-filter">{t("location")}</Label>
                    <Input
                      id="location-filter"
                      placeholder={t("filterByLocation")}
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date-from"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      {t("dateFrom")}
                    </Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-to">{t("dateTo")}</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Download Info */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">{t("downloadInformation")}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t("zipFormat")}</li>
                  <li>• {t("largeMayTake")}</li>
                  <li>• {t("linksValid")}</li>
                  <li>• {t("mediaIncrease")}</li>
                </ul>
              </div>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isLoading ? t("preparingArchive") : t("prepareArchive")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DownloadArchive;
