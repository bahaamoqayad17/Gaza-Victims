import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, ExternalLink, Calendar, MapPin, Clock, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "./LanguageSelector";
import { useTranslation } from "@/lib/translations";

interface VictimCardProps {
  victim: {
    id: string;
    name: string;
    age: number;
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
    images: string[];
  };
  showReportButton?: boolean;
  clickable?: boolean;
}

export const VictimCard = ({ victim, showReportButton = false, clickable = false }: VictimCardProps) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  
  const daysSinceDeath = Math.floor((new Date().getTime() - new Date(victim.date).getTime()) / (1000 * 3600 * 24));

  const CardWrapper = clickable ? Link : 'div';
  const cardProps = clickable ? { to: `/case/${victim.id}` } : {} as any;

  return (
    <CardWrapper {...cardProps}>
      <Card className={`hover:shadow-lg transition-shadow mx-auto max-w-sm ${clickable ? 'cursor-pointer' : ''}`}>
        <CardContent className="p-3 md:p-4 lg:p-6">
          {/* Photo carousel */}
          <div className="mb-3 md:mb-4">
            <Carousel className="w-full">
              <CarouselContent>
                {victim.images.map((image, index) => (
                  <CarouselItem key={index}>
                     <div className="aspect-[4/3] w-full overflow-hidden bg-muted border rounded">
                       <img 
                         src={image} 
                         alt={`${victim.name} - Photo ${index + 1}`}
                         className="w-full h-full object-cover transition-all duration-300 hover:grayscale"
                       />
                     </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {victim.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-2 w-6 h-6" />
                  <CarouselNext className="right-2 w-6 h-6" />
                </>
              )}
            </Carousel>
          </div>

          {/* Victim details */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{victim.name}</h4>
                <p className="text-sm text-muted-foreground">{t('age')}: {victim.age}</p>
                {victim.familyRelationship && (
                  <p className="text-xs text-muted-foreground italic">{victim.familyRelationship}</p>
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
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-300">Documented</span>
              {victim.verified && (
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 border border-emerald-300">Verified</span>
              )}
              {victim.thirdPartyVerified && (
                <span className="bg-violet-100 text-violet-800 px-2 py-0.5 border border-violet-300">Third Party Verified</span>
              )}
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 border border-blue-300">Proof of ID</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 border border-amber-300">Proof of Death</span>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{t('location')}: {victim.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{t('date')}: {new Date(victim.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{t('causeOfDeath')}: {victim.causeOfDeath}</span>
              </div>
              {victim.newsLink && (
                <div className="flex items-center gap-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>News Story: </span>
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
                <span className="text-xs">
                  {t('actionTaken')}: 
                  <span className={victim.actionTaken === 'pending' ? 'text-orange-600' : ''}>
                    {' '}{victim.actionTaken}
                    {victim.actionTaken === 'pending' && (
                      <span className="text-red-600">
                        {' '}{t('forXDays')} {daysSinceDeath} {t('days')}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            </div>
            
            {/* Who were they expandable section */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2">
                <ChevronDown className="h-3 w-3" />
                Who were they?
              </CollapsibleTrigger>
              <CollapsibleContent className="text-xs text-muted-foreground mt-1 space-y-2">
                {victim.lifeStory && (
                  <div>
                    <span className="font-medium">About them:</span>
                    <p className="mt-1">{victim.lifeStory}</p>
                  </div>
                )}
                {victim.deathDetails && (
                  <div>
                    <span className="font-medium">How they died:</span>
                    <p className="mt-1">{victim.deathDetails}</p>
                  </div>
                )}
                {!victim.lifeStory && !victim.deathDetails && (
                  <p>Information not available.</p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};