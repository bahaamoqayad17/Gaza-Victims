import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AlertTriangle, ExternalLink, Calendar, MapPin, Clock } from "lucide-react";
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
                        className="w-full h-full object-cover"
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
              <h4 className="font-semibold text-lg">{victim.name}</h4>
              <div className="flex gap-1">
                {showReportButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    asChild
                  >
                    <Link to="/report-case">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                    </Link>
                  </Button>
                )}
                {victim.newsLink && (
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
            
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="outline" className="text-xs">
                {t('name')}: {victim.name}
              </Badge>
              <Badge variant="outline" className="text-xs bg-green-50">
                {t('age')}: {victim.age}
              </Badge>
              {victim.verified && (
                <Badge className="text-xs bg-blue-500">
                  Documented
                </Badge>
              )}
              {victim.verified && (
                <Badge className="text-xs bg-green-500">
                  Verified
                </Badge>
              )}
              {victim.thirdPartyVerified && (
                <Badge className="text-xs bg-purple-500">
                  Third Party Verified
                </Badge>
              )}
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
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
};