import React from 'react';
import { Hotel } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Coffee, Dumbbell, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void;
}

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
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
      className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm cursor-pointer transition-colors hover:border-primary/20"
      onClick={onClick}
      data-testid={`card-hotel-${hotel.id}`}
    >
      <div className={`h-48 md:h-auto md:w-72 flex-shrink-0 ${hotel.images[0]} transition-transform duration-700 hover:scale-105`} />
      
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
              {hotel.location}
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
          {hotel.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {hotel.amenities.slice(0, 4).map(amenity => (
            <Badge key={amenity} variant="secondary" className="bg-muted/50 text-muted-foreground hover:bg-muted font-normal text-xs py-0.5">
              {getAmenityIcon(amenity)}
              <span className="ms-1">{amenity}</span>
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
            <span className="text-xs text-muted-foreground block mb-0.5">Starting from</span>
            <span className="text-2xl font-serif font-bold text-foreground">${hotel.pricePerNight}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          <Button onClick={(e) => { e.stopPropagation(); onClick(); }} data-testid={`button-view-details-${hotel.id}`}>
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
