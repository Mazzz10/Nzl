import React from 'react';
import { RoomType, SearchParams, AddOn } from '../types';
import { addOns } from '../data/hotels';
import { format, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Users } from 'lucide-react';
import { useLocale } from '../lib/i18n';
import { getLocalizedAddOnName, getLocalizedRoomText } from '../lib/hotel-localization';

interface BookingSummaryProps {
  room: RoomType | null;
  params: SearchParams;
  selectedAddOnIds: string[];
  onBook: () => void;
  isReadOnly?: boolean;
}

export default function BookingSummary({ room, params, selectedAddOnIds, onBook, isReadOnly = false }: BookingSummaryProps) {
  const { t, language } = useLocale();

  if (!room) {
    return (
      <Card className="sticky top-24" data-testid="card-booking-summary-empty">
        <CardHeader>
          <CardTitle className="font-serif text-xl">{t('summaryYourStay')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground py-8">
          {t('summarySelectRoom')}
        </CardContent>
      </Card>
    );
  }

  const checkInDate = new Date(params.checkIn);
  const checkOutDate = new Date(params.checkOut);
  const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));

  const basePrice = room.pricePerNight * nights;
  const localizedRoomText = getLocalizedRoomText(room, language);

  const selectedAddOns = addOns.filter(a => selectedAddOnIds.includes(a.id));
  const addOnsTotal = selectedAddOns.reduce((total, addon) => {
    return total + (addon.type === 'per_night' ? addon.price * nights : addon.price);
  }, 0);

  const subtotal = basePrice + addOnsTotal;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  return (
    <Card className="sticky top-24 shadow-lg border-primary/10" data-testid="card-booking-summary">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-xl">{t('summaryBooking')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1 flex-1 border-r border-border/50">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {t('summaryCheckIn')}</span>
            <div className="font-medium text-sm">{format(checkInDate, 'MMM d, yyyy')}</div>
          </div>
          <div className="space-y-1 flex-1 ps-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> {t('summaryCheckOut')}</span>
            <div className="font-medium text-sm">{format(checkOutDate, 'MMM d, yyyy')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{t('summaryGuests', { count: params.guests })}</span>
          <span className="text-muted-foreground mx-1">•</span>
          <span>{t('summaryNights', { count: nights, suffix: nights > 1 ? 's' : '' })}</span>
        </div>

        <div>
          <h4 className="font-medium mb-1">{localizedRoomText.name}</h4>
          <p className="text-sm text-muted-foreground">{localizedRoomText.bedType}</p>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">${room.pricePerNight} × {nights} nights</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>

          {selectedAddOns.map(addon => (
            <div key={addon.id} className="flex justify-between">
              <span className="text-muted-foreground">{getLocalizedAddOnName(addon, language)}</span>
              <span>${(addon.type === 'per_night' ? addon.price * nights : addon.price).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('summaryTaxes')}</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-end">
          <span className="font-semibold text-lg">{t('summaryTotal')}</span>
          <span className="font-serif text-3xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
      </CardContent>

      {!isReadOnly && (
        <CardFooter>
          <Button className="w-full h-12 text-lg transition-colors duration-200 hover:bg-primary/80" onClick={onBook} data-testid="button-book-now">
            {t('summaryBookNow')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
