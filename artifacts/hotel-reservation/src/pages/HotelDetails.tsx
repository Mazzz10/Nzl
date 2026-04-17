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

export default function HotelDetails({ hotelId, params, navigateTo }: { hotelId: string; params: SearchParams; navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const hotel = sampleHotels.find(h => h.id === hotelId);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!hotel) return <div>Hotel not found</div>;

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
          variant="ghost" 
          className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigateTo({ name: 'search_results', params })}
          data-testid="button-back-to-search"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to search results
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
              {hotel.location}
            </div>
          </div>
          <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-lg">
            <div className="text-right">
              <div className="font-medium text-sm">Excellent</div>
              <div className="text-xs text-muted-foreground">{hotel.reviewCount} reviews</div>
            </div>
            <div className="bg-primary text-primary-foreground h-10 w-10 rounded flex items-center justify-center font-bold text-lg">
              {hotel.rating}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 h-[50vh] min-h-[400px] rounded-2xl overflow-hidden">
          <div className={`md:col-span-2 ${hotel.images[0]} bg-cover bg-center`} />
          <div className="hidden md:flex flex-col gap-4">
            <div className={`flex-1 ${hotel.images[1]} bg-cover bg-center rounded-xl`} />
            <div className={`flex-1 ${hotel.images[2]} bg-cover bg-center rounded-xl relative`}>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors">
                <span className="text-white font-medium">+ View All Photos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Description & Amenities */}
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {hotel.description}
              </p>
              
              <h3 className="font-medium mb-4">Popular Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {hotel.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-2 text-muted-foreground">
                    <CheckIcon name={amenity} />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Rooms */}
            <section>
              <h2 className="font-serif text-2xl font-semibold mb-6">Choose your room</h2>
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
                Guest Reviews <span className="text-primary text-xl">({hotel.rating})</span>
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
                <p className="text-muted-foreground">No reviews yet for this property.</p>
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
