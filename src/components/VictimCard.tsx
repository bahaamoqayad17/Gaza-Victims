import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MobileTooltip } from "./MobileTooltip";
import {
  AlertTriangle,
  ExternalLink,
  MapPin,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Check,
  Download,
  Instagram,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "./LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { formatDate, calculateDaysSince } from "@/lib/dateUtils";
import { useState } from "react";
import { toast } from "sonner";
import { useDownloadCaseMutation } from "@/store/api/apiSlice";

interface VictimCardProps {
  victim: {
    _id: string;
    generated_id: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    date: string;
    status: string;
    causeOfDeath: string;
    actionTaken: string;
    verified?: boolean;
    thirdPartyVerified?: boolean;
    digitalForensicsVerified?: boolean;
    newsLink?: string;
    lifeStory?: string;
    deathDetails?: string;
    familyRelationship?: string;
    occupation?: string;
    perpetrator?: string;
    images: string[];
  };
  showReportButton?: boolean;
  clickable?: boolean;
}

export const VictimCard = ({
  victim,
  showReportButton = false,
  clickable = false,
}: VictimCardProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const caseUrl = `${window.location.origin}/case/${victim.generated_id}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(caseUrl);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const [downloadCase, { isLoading: isDownloading }] =
    useDownloadCaseMutation();

  const handleDownload = async () => {
    if (!victim?.generated_id) return;

    try {
      const blob = await downloadCase({
        generated_id: victim.generated_id,
      }).unwrap();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const caseName = victim?.name?.replace(/[^a-zA-Z0-9]/g, "_") || "case";
      link.download = `case-${caseName}-${Date.now()}.zip`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your case file download has started.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Error",
        description: "Failed to download case file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareOnSocial = (platform: string) => {
    const text = `Remember ${victim.name}, age ${victim.age}, from ${victim.location}`;
    const encodedUrl = encodeURIComponent(caseUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct share URL, so we copy to clipboard
        navigator.clipboard.writeText(`${text} ${caseUrl}`);
        toast.success("Case info copied to clipboard for Instagram sharing");
        return;
      case "messenger":
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=YOUR_APP_ID`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const daysSinceDeath = calculateDaysSince(victim.date);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % victim.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(
      (prev) => (prev - 1 + victim.images.length) % victim.images.length
    );
  };

  return (
    <div className="flex flex-col">
      <Card className="hover:shadow-lg transition-shadow mx-auto max-w-sm">
        <CardContent className="p-3 md:p-4 lg:p-6">
          {/* Photo display */}
          <div className="mb-3 md:mb-4">
            <div className="relative">
              <div className="aspect-[4/3] w-full overflow-hidden bg-muted border rounded">
                <img
                  src={victim.images[currentImageIndex]}
                  alt={`${victim.name} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-300 hover:grayscale"
                />
              </div>

              {/* Custom navigation buttons */}
              {victim.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white border-none hover:bg-black/70 rounded-full flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white border-none hover:bg-black/70 rounded-full flex items-center justify-center"
                  >
                    ›
                  </button>

                  {/* Image indicators */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {victim.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Victim details */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{victim.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {t("age")}: {victim.age}
                </p>
                {victim.familyRelationship && (
                  <p className="text-sm text-muted-foreground italic">
                    {victim.occupation && `${victim.occupation}. `}
                    {victim.familyRelationship}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                {showReportButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    asChild
                  >
                    <Link to="/report">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                    </Link>
                  </Button>
                )}
                {/* {victim.newsLink && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    asChild
                  >
                    <a
                      href={victim.newsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3 text-blue-500" />
                    </a>
                  </Button>
                )} */}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-1 gap-y-2 mb-2 text-xs">
              <MobileTooltip content={t("documentedDescription")}>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300">
                  {t("documented")}
                </span>
              </MobileTooltip>
              {victim.verified && (
                <MobileTooltip content={t("verifiedDescription")}>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">
                    {t("verified")}
                  </span>
                </MobileTooltip>
              )}
              {victim.thirdPartyVerified && (
                <MobileTooltip content={t("thirdPartyDescription")}>
                  <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">
                    {t("thirdPartyVerified")}
                  </span>
                </MobileTooltip>
              )}
              {victim.digitalForensicsVerified && (
                <MobileTooltip content={t("digitalForensicsDescription")}>
                  <span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 border border-cyan-300">
                    {t("digitalForensicsVerified")}
                  </span>
                </MobileTooltip>
              )}
              <MobileTooltip content={t("proofOfIdDescription")}>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300">
                  {t("proofOfId")}
                </span>
              </MobileTooltip>
              <MobileTooltip content={t("proofOfDeathDescription")}>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300">
                  {t("proofOfDeath")}
                </span>
              </MobileTooltip>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>
                  {t("locationOfIncident")}: {victim.location}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="ltr-text">
                  {t("dateOfIncident")}: {formatDate(victim.date)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {t("submittedBy")}: {t("relative")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {t("causeOfDeath")}:{" "}
                  {t(victim.causeOfDeath as keyof typeof t)}
                </span>
              </div>
              {victim.perpetrator && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">
                    {t("perpetrator")}:{" "}
                    {t(victim.perpetrator as keyof typeof t)}
                  </span>
                </div>
              )}
              {victim.newsLink && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-sm">{t("incidentNewsStory")}: </span>
                  <a
                    href={victim.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-xs truncate"
                  >
                    {victim.newsLink}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  {t("enforcedLegalResponse")}:
                  <span
                    className={
                      victim.actionTaken === "pending" ? "text-red-600" : ""
                    }
                  >
                    {victim.actionTaken === "pending"
                      ? ` ${t("noneSince")} ${daysSinceDeath} ${t("days")}`
                      : ` ${victim.actionTaken}`}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-2 mt-2 mx-auto">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/case/${victim.generated_id}`}>{t("learnMore")}</Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Download className="h-3 w-3 mr-1" />
          )}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share this case</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("twitter")}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("facebook")}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("whatsapp")}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("telegram")}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("instagram")}
                  className="flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareOnSocial("messenger")}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Messenger
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={caseUrl}
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                />
                <Button
                  onClick={handleCopyUrl}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
