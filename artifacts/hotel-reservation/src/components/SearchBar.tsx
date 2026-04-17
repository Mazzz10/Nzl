import React, { useState } from 'react';
import { SearchParams } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface SearchBarProps {
  initialParams?: SearchParams;
  onSearch: (params: SearchParams) => void;
  variant?: 'hero' | 'compact';
}

export default function SearchBar({ initialParams, onSearch, variant = 'hero' }: SearchBarProps) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  const [destination, setDestination] = useState(initialParams?.destination || '');
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || format(today, 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || format(tomorrow, 'yyyy-MM-dd'));
  const [guests, setGuests] = useState(initialParams?.guests || 2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ destination, checkIn, checkOut, guests });
  };

  const todayStr = format(today, 'yyyy-MM-dd');

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-card p-2 rounded-full border shadow-sm w-full max-w-4xl mx-auto" data-testid="form-search-compact">
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)} 
            placeholder="Where to?" 
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8"
            data-testid="input-compact-destination"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input 
            type="date" 
            min={todayStr}
            value={checkIn} 
            onChange={(e) => setCheckIn(e.target.value)} 
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-sm"
            data-testid="input-compact-checkin"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input 
            type="date" 
            min={checkIn || todayStr}
            value={checkOut} 
            onChange={(e) => setCheckOut(e.target.value)} 
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 text-sm"
            data-testid="input-compact-checkout"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4">
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input 
            type="number" 
            min={1} max={10}
            value={guests} 
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)} 
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-8 w-16"
            data-testid="input-compact-guests"
          />
        </div>
        <Button type="submit" size="icon" className="rounded-full flex-shrink-0" data-testid="button-compact-search">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-card p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto" data-testid="form-search-hero">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="destination"
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              placeholder="City, region, or hotel" 
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-transparent"
              data-testid="input-hero-destination"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="checkIn">Check-in</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="checkIn"
              type="date" 
              min={todayStr}
              value={checkIn} 
              onChange={(e) => setCheckIn(e.target.value)} 
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-transparent"
              data-testid="input-hero-checkin"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut">Check-out</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              id="checkOut"
              type="date" 
              min={checkIn || todayStr}
              value={checkOut} 
              onChange={(e) => setCheckOut(e.target.value)} 
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-transparent"
              data-testid="input-hero-checkout"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id="guests"
                type="number" 
                min={1} max={10}
                value={guests} 
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)} 
                className="pl-9 bg-muted/50 border-transparent focus-visible:bg-transparent"
                data-testid="input-hero-guests"
              />
            </div>
            <Button type="submit" className="w-full md:w-auto" data-testid="button-hero-search">
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
