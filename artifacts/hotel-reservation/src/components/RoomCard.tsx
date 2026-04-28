import React from 'react';
import { RoomType, AddOn } from '../types';
import { addOns } from '../data/hotels';
import { Users, BedDouble, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { getRoomImageById } from '../lib/room-images';
import { useLocale } from '../lib/i18n';
import { getLocalizedAddOnName, getLocalizedRoomText } from '../lib/hotel-localization';

interface RoomCardProps {
  room: RoomType;
  isSelected: boolean;
  selectedAddOns: string[];
  onSelect: () => void;
  onToggleAddOn: (addOnId: string) => void;
  isCompared?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: () => void;
}

export default function RoomCard({
  room,
  isSelected,
  selectedAddOns,
  onSelect,
  onToggleAddOn,
  isCompared = false,
  compareDisabled = false,
  onToggleCompare
}: RoomCardProps) {
  const { t, language } = useLocale();
  const roomImage = getRoomImageById(room.id);
  const localizedRoomText = getLocalizedRoomText(room, language);

  const handleAddOnChange = (addOnId: string) => {
    if (!isSelected) {
      onSelect();
    }
    onToggleAddOn(addOnId);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'}`} data-testid={`card-room-${room.id}`}>
      <div className="flex flex-col sm:flex-row">
        <div className="h-48 sm:h-auto sm:w-1/3 flex-shrink-0 overflow-hidden bg-muted/20">
          {roomImage ? (
            <img
              src={roomImage}
              alt={`${room.name} photo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className={`h-full w-full ${room.image} bg-cover bg-center`} />
          )}
        </div>

        <CardContent className="flex-1 p-4 sm:p-6">
          <div className="mb-2 flex flex-wrap justify-between gap-3 sm:items-start">
            <h3 className="font-serif text-xl font-semibold sm:text-2xl">{localizedRoomText.name}</h3>
            <div className="text-right">
              <span className="font-serif text-xl font-bold sm:text-2xl">${room.pricePerNight}</span>
              <span className="text-sm text-muted-foreground block">{t('hotelPerNight')}</span>
              {onToggleCompare && (
                <Button
                  type="button"
                  size="sm"
                  variant={isCompared ? 'secondary' : 'outline'}
                  className={`mt-3 w-full sm:w-auto ${isCompared ? 'hover:opacity-90' : 'hover:border-primary/60 hover:bg-primary/5'}`}
                  onClick={onToggleCompare}
                  disabled={compareDisabled && !isCompared}
                  aria-pressed={isCompared}
                  title={compareDisabled && !isCompared ? t('detailsCompareHint') : t('detailsCompare')}
                >
                  {isCompared ? t('detailsCompared') : t('detailsCompare')}
                </Button>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
            <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {localizedRoomText.bedType}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {t('roomUpToGuests', { count: room.maxGuests })}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{localizedRoomText.description}</p>

          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium mb-3">{t('roomOptionalAddons')}</h4>
            <div className="space-y-3">
              {addOns.map(addon => (
                <div key={addon.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`addon-${room.id}-${addon.id}`}
                      checked={selectedAddOns.includes(addon.id)}
                      onCheckedChange={() => handleAddOnChange(addon.id)}
                      data-testid={`checkbox-addon-${addon.id}`}
                    />
                    <Label htmlFor={`addon-${room.id}-${addon.id}`} className="text-sm font-normal cursor-pointer">
                      {getLocalizedAddOnName(addon, language)}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground sm:text-right">+${addon.price} {addon.type === 'per_night' ? t('roomAddonPerNight') : t('roomAddonPerStay')}</span>
                </div>
              ))}
            </div>
          </div>

          <Button
            className={`w-full transition-colors duration-200 ${isSelected ? 'hover:bg-primary/90' : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'}`}
            variant={isSelected ? "default" : "outline"}
            onClick={onSelect}
            data-testid={`button-select-room-${room.id}`}
          >
            {isSelected ? (
              <><Check className="mr-2 h-4 w-4" /> {t('roomSelected')}</>
            ) : t('roomSelectThis')}
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
