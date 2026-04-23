import React from 'react';
import { Hotel } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Coffee, Dumbbell, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale } from '../lib/i18n';
import { getLocalizedHotelText } from '../lib/hotel-localization';

interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void;
}

const HOTEL_IMAGE_BY_ID: Record<string, string> = {
  h1: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1400&auto=format&fit=crop',
  h2: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1400&auto=format&fit=crop',
  h3: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1400&auto=format&fit=crop',
  h4: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1400&auto=format&fit=crop',
  h5: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop',
  h6: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1400&auto=format&fit=crop',
};

const getAmenityIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'free wifi': return <Wifi className="h-3 w-3" />;
    case 'restaurant': return <Coffee className="h-3 w-3" />;
    case 'gym': return <Dumbbell className="h-3 w-3" />;
    case 'pet friendly': return <PawPrint className="h-3 w-3" />;
    default: return null;
  }
};

export default function HotelCard({ hotel, onClick }: HotelCardProps) {
  const { t, language } = useLocale();
  const imageUrl = HOTEL_IMAGE_BY_ID[hotel.id] ?? 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1400&auto=format&fit=crop';
  const localizedHotelText = getLocalizedHotelText(hotel, language);

  const localizeAmenity = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'pool':
        return t('amenityPool');
      case 'spa':
        return t('amenitySpa');
      case 'gym':
        return t('amenityGym');
      case 'free wifi':
        return t('amenityFreeWifi');
      case 'pet friendly':
        return t('amenityPetFriendly');
      case 'restaurant':
        return t('amenityRestaurant');
      default:
        return amenity;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      className="group flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer transition-colors hover:border-primary/20"
      onClick={onClick}
      data-testid={`card-hotel-${hotel.id}`}
    >
      <div className="relative h-48 md:h-auto md:w-72 flex-shrink-0 overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={`${hotel.name} hotel`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col flex-grow p-6 z-10 bg-card">
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-1">{hotel.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5 me-1" />
              {localizedHotelText.location}
            </div>
          </div>
          <div className="text-end">
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium mb-1">
              <span className="text-lg">{hotel.rating}</span>
              <span className="text-xs opacity-80">({hotel.reviewCount})</span>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-4 line-clamp-2 leading-relaxed">
          {localizedHotelText.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {hotel.amenities.slice(0, 4).map(amenity => (
            <Badge key={amenity} variant="secondary" className="bg-muted/50 text-muted-foreground hover:bg-muted font-normal text-xs py-0.5">
              {getAmenityIcon(amenity)}
              <span className="ms-1">{localizeAmenity(amenity)}</span>
            </Badge>
          ))}
          {hotel.amenities.length > 4 && (
            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground font-normal text-xs py-0.5">
              +{hotel.amenities.length - 4}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-6 flex items-end justify-between">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">{t('hotelStartingFrom')}</span>
            <span className="text-2xl font-serif font-bold text-foreground">${hotel.pricePerNight}</span>
            <span className="text-sm text-muted-foreground"> {t('hotelPerNight')}</span>
          </div>
          <Button
            className="transition-colors duration-200 hover:bg-primary/80"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            data-testid={`button-view-details-${hotel.id}`}
          >
            {t('hotelViewDetails')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
