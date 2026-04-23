import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/use-app-state';
import { SearchParams } from '../types';
import { sampleHotels } from '../data/hotels';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import BookingSummary from '../components/BookingSummary';
import { motion } from 'framer-motion';
import { MapPin, Star, ChevronLeft, Wifi, Coffee, Dumbbell, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useLocale } from '../lib/i18n';
import { getLocalizedHotelText } from '../lib/hotel-localization';

const HOTEL_GALLERY_BY_ID: Record<string, string[]> = {
  h1: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1800&auto=format&fit=crop',
  ],
  h2: [
    'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1800&auto=format&fit=crop',
  ],
  h3: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448075-bb485b067938?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1800&auto=format&fit=crop',
  ],
  h4: [
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1800&auto=format&fit=crop',
  ],
  h5: [
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565031491910-e57fac031c41?q=80&w=1800&auto=format&fit=crop',
  ],
  h6: [
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521783988139-89397d761dce?q=80&w=1800&auto=format&fit=crop',
  ],
};

export default function HotelDetails({ hotelId, params, navigateTo }: { hotelId: string; params: SearchParams; navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const { t, language } = useLocale();
  const hotel = sampleHotels.find(h => h.id === hotelId);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!hotel) return <div>{t('detailsHotelNotFound')}</div>;

  const hotelGallery = HOTEL_GALLERY_BY_ID[hotel.id] ?? HOTEL_GALLERY_BY_ID.h1;
  const localizedHotelText = getLocalizedHotelText(hotel, language);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedAddOnIds([]); // Reset add-ons when room changes
  };

  const handleToggleAddOn = (addOnId: string) => {
    setSelectedAddOnIds(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const selectedRoom = hotel.roomTypes.find(r => r.id === selectedRoomId) || null;

  const mainImage = hotelGallery[selectedImageIndex] ?? hotelGallery[0];

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

  const handleBook = () => {
    if (selectedRoomId) {
      navigateTo({
        name: 'checkout',
        hotelId,
        roomId: selectedRoomId,
        params,
        selectedAddOns: selectedAddOnIds
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar navigateTo={navigateTo} />

      <div className="container mx-auto px-4 py-6">
        <Button
          variant="outline"
          className="mb-6 h-11 rounded-full border-primary/30 bg-primary/5 px-4 font-semibold text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => navigateTo({ name: 'search_results', params })}
          data-testid="button-back-to-search"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {t('detailsBackToResults')}
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-2">{hotel.name}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 me-1" />
              {localizedHotelText.location}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-lg">
            <div className="text-right">
              <div className="font-medium text-sm">{t('detailsExcellent')}</div>
              <div className="text-xs text-muted-foreground">{hotel.reviewCount} {t('detailsReviews')}</div>
            </div>
            <div className="bg-primary text-primary-foreground h-10 w-10 rounded flex items-center justify-center font-bold text-lg">
              {hotel.rating}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 h-[58vh] min-h-[420px]">
          <button
            type="button"
            className="group md:col-span-2 relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card"
            onClick={() => setIsGalleryOpen(true)}
            data-testid="button-main-photo"
          >
            <img
              src={mainImage}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-30 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-black/5" />
            <img src={mainImage} alt={`${hotel.name} main photo`} className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" />
          </button>
          <div className="hidden md:flex h-full min-h-0 flex-col rounded-2xl border border-border/60 bg-card/30 p-2">
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {hotelGallery.map((image, idx) => {
                const isActive = idx === selectedImageIndex;

                return (
                  <button
                    key={image}
                    type="button"
                    className={`relative h-44 shrink-0 overflow-hidden rounded-xl border transition ${isActive ? 'border-primary ring-2 ring-primary/40' : 'border-border/60 hover:border-primary/40'}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    data-testid={`button-side-photo-${idx}`}
                  >
                    <img src={image} alt={`${hotel.name} photo ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="mt-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              data-testid="button-view-all-photos"
            >
              {t('detailsViewAllPhotos')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">

            {/* Description & Amenities */}
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">{t('detailsAboutProperty')}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {localizedHotelText.description}
              </p>

              <h3 className="font-medium mb-4">{t('detailsPopularAmenities')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-muted-foreground">
                    <CheckIcon name={amenity} />
                    <span>{localizeAmenity(amenity)}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Rooms */}
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-6">{t('detailsChooseRoom')}</h2>
              <div className="space-y-6">
                {hotel.roomTypes.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selectedRoomId === room.id}
                    selectedAddOns={selectedAddOnIds}
                    onSelect={() => handleRoomSelect(room.id)}
                    onToggleAddOn={handleToggleAddOn}
                  />
                ))}
              </div>
            </section>

            <Separator />

            {/* Reviews */}
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-6 flex items-center gap-2">
                {t('detailsGuestReviews')} <span className="text-primary text-xl">({hotel.rating})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotel.reviews.map(review => (
                  <div key={review.id} className="bg-muted/20 p-6 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">{review.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{review.author}</div>
                          <div className="text-xs text-muted-foreground">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-secondary text-secondary me-1" />
                        <span className="font-medium text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
              {hotel.reviews.length === 0 && (
                <p className="text-muted-foreground">{t('detailsNoReviews')}</p>
              )}
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <BookingSummary
              room={selectedRoom}
              params={params}
              selectedAddOnIds={selectedAddOnIds}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-[min(95vw,1200px)] rounded-2xl p-0 overflow-hidden">
          <div className="border-b border-border/60 px-6 py-4">
            <DialogTitle className="font-serif text-3xl">{t('detailsPhotosTitle', { name: hotel.name })}</DialogTitle>
          </div>
          <div className="max-h-[75vh] overflow-y-auto p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {hotelGallery.map((image, idx) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`overflow-hidden rounded-xl border ${selectedImageIndex === idx ? 'border-primary ring-2 ring-primary/40' : 'border-border/60'}`}
                  data-testid={`button-gallery-photo-${idx}`}
                >
                  <img
                    src={image}
                    alt={`${hotel.name} gallery ${idx + 1}`}
                    className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CheckIcon({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case 'free wifi': return <Wifi className="h-5 w-5" />;
    case 'restaurant': return <Coffee className="h-5 w-5" />;
    case 'gym': return <Dumbbell className="h-5 w-5" />;
    case 'pet friendly': return <PawPrint className="h-5 w-5" />;
    default: return <Star className="h-5 w-5" />;
  }
}
