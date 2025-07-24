import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, ExternalLink, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "./LanguageSelector";
import { useTranslation } from "@/lib/translations";
import { formatDate, calculateDaysSince } from "@/lib/dateUtils";
import { useState } from "react";

interface VictimCardProps {
  victim: {
    id: string;
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

export const VictimCard = ({ victim, showReportButton = false, clickable = false }: VictimCardProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [isLifeStoryExpanded, setIsLifeStoryExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const daysSinceDeath = calculateDaysSince(victim.date);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % victim.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + victim.images.length) % victim.images.length);
  };

  const CardWrapper = clickable ? Link : 'div';
  const cardProps = clickable ? { to: `/case/${victim.id}` } : {} as any;

  return (
    <TooltipProvider>
      <CardWrapper {...cardProps}>
        <Card className={`hover:shadow-lg transition-shadow mx-auto max-w-sm ${clickable ? 'cursor-pointer' : ''}`}>
          <CardContent className="p-3 md:p-4 lg:p-6" onClick={clickable ? undefined : (e) => e.stopPropagation()}>
            {/* Photo display */}
            <div className="mb-3 md:mb-4" onClick={(e) => e.stopPropagation()}>
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
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
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
                <p className="text-sm text-muted-foreground">{t('age')}: {victim.age}</p>
                {victim.familyRelationship && (
                  <p className="text-sm text-muted-foreground italic">
                    {victim.occupation && `${victim.occupation}. `}{victim.familyRelationship}
                  </p>
                )}
              </div>
                <div className="flex gap-1">
                  {!clickable && (
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
                  {!clickable && victim.newsLink && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      asChild
                    >
                      <a href={victim.newsLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 text-blue-500" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-2 text-xs">
                <Tooltip>
                  <TooltipTrigger asChild>
                     <span 
                       className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300 cursor-help touch-manipulation"
                       onClick={(e) => e.stopPropagation()}
                     >
                       {t('documented')}
                     </span>
                   </TooltipTrigger>
                   <TooltipContent side="top" className="z-50">
                     <p className="max-w-xs text-xs">
                       {t('documentedDescription')}
                     </p>
                   </TooltipContent>
                </Tooltip>
                {victim.verified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <span 
                         className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300 cursor-help touch-manipulation"
                         onClick={(e) => e.stopPropagation()}
                       >
                         {t('verified')}
                       </span>
                     </TooltipTrigger>
                     <TooltipContent side="top" className="z-50">
                       <p className="max-w-xs text-xs">
                         {t('verifiedDescription')}
                       </p>
                     </TooltipContent>
                  </Tooltip>
                )}
                {victim.thirdPartyVerified && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <span 
                         className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300 cursor-help touch-manipulation"
                         onClick={(e) => e.stopPropagation()}
                       >
                         {t('thirdPartyVerified')}
                       </span>
                     </TooltipTrigger>
                     <TooltipContent side="top" className="z-50">
                       <p className="max-w-xs text-xs">
                         {t('thirdPartyDescription')}
                       </p>
                     </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                     <span 
                       className="bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300 cursor-help touch-manipulation"
                       onClick={(e) => e.stopPropagation()}
                     >
                       {t('proofOfId')}
                     </span>
                   </TooltipTrigger>
                   <TooltipContent side="top" className="z-50">
                     <p className="max-w-xs text-xs">
                       {t('proofOfIdDescription')}
                     </p>
                   </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <span 
                       className="bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300 cursor-help touch-manipulation"
                       onClick={(e) => e.stopPropagation()}
                     >
                       {t('proofOfDeath')}
                     </span>
                   </TooltipTrigger>
                   <TooltipContent side="top" className="z-50">
                     <p className="max-w-xs text-xs">
                       {t('proofOfDeathDescription')}
                     </p>
                   </TooltipContent>
                </Tooltip>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                   <span>{t('locationOfIncident')}: {victim.location}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="ltr-text">{t('dateOfIncident')}: {formatDate(victim.date)}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="text-sm">{t('submittedBy')}: {t('relative')}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <span className="text-sm">{t('causeOfDeath')}: {victim.causeOfDeath}</span>
                 </div>
                 {victim.perpetrator && (
                   <div className="flex items-center gap-1">
                     <span className="text-sm">{t('perpetrator')}: {victim.perpetrator}</span>
                   </div>
                 )}
                 {victim.newsLink && (
                   <div className="flex items-center gap-1">
                     <ExternalLink className="h-3 w-3" />
                     <span className="text-sm">{t('incidentNewsStory')}: </span>
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
                     {t('enforcedLegalResponse')}: 
                     <span className={victim.actionTaken === 'pending' ? 'text-red-600' : ''}>
                       {victim.actionTaken === 'pending' 
                         ? ` ${t('noneSince')} ${daysSinceDeath} ${t('days')}`
                         : ` ${victim.actionTaken}`
                       }
                     </span>
                   </span>
                 </div>
              </div>
              
              {/* Who were they expandable section */}
              <Collapsible open={isLifeStoryExpanded} onOpenChange={setIsLifeStoryExpanded}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 w-full justify-start">
                  {isLifeStoryExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                   {t('whoWereThey')}
                 </CollapsibleTrigger>
                 <CollapsibleContent className="text-xs text-muted-foreground mt-1 space-y-2 animate-in slide-in-from-top-2">
                   {victim.lifeStory && (
                     <div>
                       <span className="font-medium">{t('aboutThem')}:</span>
                       <p className="mt-1">{victim.lifeStory}</p>
                     </div>
                   )}
                   {victim.deathDetails && (
                     <div>
                       <span className="font-medium">{t('howTheyDied')}:</span>
                       <p className="mt-1">{victim.deathDetails}</p>
                     </div>
                   )}
                   {!victim.lifeStory && !victim.deathDetails && (
                     <p>{t('informationNotAvailable')}</p>
                   )}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      </CardWrapper>
    </TooltipProvider>
  );
};