import React from 'react';
import { RoomType, AddOn } from '../types';
import { addOns } from '../data/hotels';
import { Users, BedDouble, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface RoomCardProps {
  room: RoomType;
  isSelected: boolean;
  selectedAddOns: string[];
  onSelect: () => void;
  onToggleAddOn: (addOnId: string) => void;
}

export default function RoomCard({ room, isSelected, selectedAddOns, onSelect, onToggleAddOn }: RoomCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'}`} data-testid={`card-room-${room.id}`}>
      <div className="flex flex-col sm:flex-row">
        <div className={`h-48 sm:h-auto sm:w-1/3 flex-shrink-0 ${room.image} bg-cover bg-center`} />
        
        <CardContent className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-2xl font-semibold">{room.name}</h3>
            <div className="text-right">
              <span className="text-2xl font-bold font-serif">${room.pricePerNight}</span>
              <span className="text-sm text-muted-foreground block">/ night</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {room.bedType}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Up to {room.maxGuests} guests</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{room.description}</p>
          
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-3">Optional Add-ons for this room</h4>
            <div className="space-y-3">
              {addOns.map(addon => (
                <div key={addon.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`addon-${room.id}-${addon.id}`} 
                      checked={selectedAddOns.includes(addon.id)}
                      onCheckedChange={() => onToggleAddOn(addon.id)}
                      disabled={!isSelected}
                      data-testid={`checkbox-addon-${addon.id}`}
                    />
                    <Label htmlFor={`addon-${room.id}-${addon.id}`} className="text-sm font-normal cursor-pointer">
                      {addon.name}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">+${addon.price} {addon.type === 'per_night' ? '/night' : '/stay'}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            variant={isSelected ? "default" : "outline"}
            onClick={onSelect}
            data-testid={`button-select-room-${room.id}`}
          >
            {isSelected ? (
              <><Check className="mr-2 h-4 w-4" /> Selected</>
            ) : "Select This Room"}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
