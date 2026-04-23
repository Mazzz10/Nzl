import React, { useState } from 'react';
import { SearchParams } from '../types';
import { trendingDestinations } from '../data/hotels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useLocale } from '../lib/i18n';

interface SearchBarProps {
  initialParams?: SearchParams;
  onSearch: (params: SearchParams) => void;
  variant?: 'hero' | 'compact';
}

export default function SearchBar({ initialParams, onSearch, variant = 'hero' }: SearchBarProps) {
  const { t } = useLocale();
  const today = new Date();
  const tomorrow = addDays(today, 1);

  // FIX: Allow toDateValue to handle empty strings gracefully so the user can clear the checkout date mid-selection
  const toDateValue = (value: string | undefined): Date | undefined => {
    if (!value) return undefined;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? today : parsed;
  };

  const [destination, setDestination] = useState(initialParams?.destination || '');
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(initialParams?.checkIn || format(today, 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState(initialParams?.checkOut || format(tomorrow, 'yyyy-MM-dd'));
  const [activeDateField, setActiveDateField] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [adults, setAdults] = useState(Math.max(1, initialParams?.adults ?? initialParams?.guests ?? 2));
  const [children, setChildren] = useState(Math.max(0, initialParams?.children ?? 0));
  const [rooms, setRooms] = useState(Math.max(1, initialParams?.rooms ?? 1));

  const guests = adults + children;
  const guestWord = guests > 1 ? t('searchGuestsPlural') : t('searchGuest');
  const roomWord = rooms > 1 ? t('searchRoomsPlural') : t('searchRoom');

  // FIX: Handle empty date states gracefully in the UI
  const displayDate = (value: string) => value ? format(toDateValue(value) as Date, 'dd MMM yyyy') : t('searchAddDate');
  const displayLongDate = (value: string) => value ? format(toDateValue(value) as Date, 'EEE, dd MMM yyyy') : t('searchSelectDate');

  const selectedRange: DateRange = {
    from: toDateValue(checkIn),
    to: toDateValue(checkOut),
  };
  const destinationQuery = destination.trim().toLowerCase();
  const destinationOptions = destinationQuery
    ? trendingDestinations.filter((dest) =>
      dest.name.toLowerCase().includes(destinationQuery) ||
      dest.country.toLowerCase().includes(destinationQuery),
    )
    : trendingDestinations;
  const checkInDate = toDateValue(checkIn);
  const checkOutDate = toDateValue(checkOut);
  const activeSummaryCardClass = 'rounded-xl border border-blue-500 bg-background p-4';
  const inactiveSummaryCardClass = 'rounded-xl border border-border/70 bg-muted/20 p-4';

  const handleDestinationSelect = (value: string) => {
    setDestination(value);
    setIsDestinationOpen(false);
  };

  // Selecting a date updates the currently active field from the summary cards.
  const handleDateRangeSelect = (range?: DateRange) => {
    if (!range?.from) return;

    if (activeDateField === 'checkOut') {
      const nextCheckOutDate = range.to ?? range.from;
      const currentCheckInDate = toDateValue(checkIn);

      if (currentCheckInDate && nextCheckOutDate <= currentCheckInDate) {
        setCheckIn(format(nextCheckOutDate, 'yyyy-MM-dd'));
        setCheckOut(format(addDays(nextCheckOutDate, 1), 'yyyy-MM-dd'));
      } else {
        setCheckOut(format(nextCheckOutDate, 'yyyy-MM-dd'));
      }

      setActiveDateField('checkOut');
      return;
    }

    if (!range.to) {
      // First click while editing check-in.
      setCheckIn(format(range.from, 'yyyy-MM-dd'));
      if (!checkOut || (toDateValue(checkOut) && toDateValue(checkOut)! <= range.from)) {
        setCheckOut('');
      }
      setActiveDateField('checkIn');
      return;
    }

    // Completed range while editing check-in.
    setCheckIn(format(range.from, 'yyyy-MM-dd'));
    setCheckOut(format(range.to, 'yyyy-MM-dd'));
    setActiveDateField('checkOut');
  };

  const handleCheckInSelect = (date?: Date) => {
    if (!date) return;
    const nextCheckIn = format(date, 'yyyy-MM-dd');
    setCheckIn(nextCheckIn);
    setActiveDateField('checkIn');
    if (checkOut && toDateValue(checkOut)! < date) {
      setCheckOut(format(addDays(date, 1), 'yyyy-MM-dd'));
    }
  };

  const handleCheckOutSelect = (date?: Date) => {
    if (!date) return;
    setCheckOut(format(date, 'yyyy-MM-dd'));
    setActiveDateField('checkOut');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent search if dates are incomplete
    if (!checkIn || !checkOut) return;
    onSearch({ destination, checkIn, checkOut, guests, adults, children, rooms });
  };

  const todayStr = format(today, 'yyyy-MM-dd');

  // Reusable Calendar Component with Fixed Styling
  // Reusable Calendar Component with Fixed Styling
  const SharedCalendarPicker = () => (
    <CalendarPicker
      mode="range"
      numberOfMonths={2}
      selected={selectedRange}
      onSelect={handleDateRangeSelect}
      defaultMonth={checkInDate || today}
      modifiers={{
        activeCheckIn: activeDateField === 'checkIn' ? checkInDate : undefined,
        activeCheckOut: activeDateField === 'checkOut' ? checkOutDate : undefined,
      }}
      disabled={{
        before: activeDateField === 'checkOut' && checkInDate
          ? checkInDate
          : (toDateValue(todayStr) as Date),
      }}
      showOutsideDays={false}
      className="[--cell-size:2.6rem]"
      initialFocus
    />
  );
  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-card p-2 rounded-full border shadow-sm w-full max-w-4xl mx-auto" data-testid="form-search-compact">
        {/* Compact Form Inputs (Unchanged structure) */}
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('searchWhereTo')}
            className="border-0 shadow-none p-0 h-8 focus-visible:ring-2 focus-visible:ring-blue-500"
            data-testid="input-compact-destination"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-8 rounded-md px-1 text-left text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                data-testid="input-compact-checkin"
              >
                {displayDate(checkIn)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4" align="start">
              <CalendarPicker
                mode="single"
                selected={toDateValue(checkIn)}
                onSelect={handleCheckInSelect}
                disabled={{ before: toDateValue(todayStr) as Date }}
                className="[--cell-size:2.5rem]"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex items-center gap-2 px-4 border-r border-border">
          <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-8 rounded-md px-1 text-left text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                data-testid="input-compact-checkout"
              >
                {displayDate(checkOut)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4" align="start">
              <CalendarPicker
                mode="single"
                selected={toDateValue(checkOut)}
                onSelect={handleCheckOutSelect}
                disabled={{ before: toDateValue(checkIn) as Date }}
                className="[--cell-size:2.5rem]"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1 flex items-center gap-2 px-4">
          <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="h-8 rounded-md px-1 text-left text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                data-testid="input-compact-guests"
              >
                {guests} {guestWord}, {rooms} {roomWord}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-4">
              <div className="space-y-3">
                <GuestCounter label={t('searchAdults')} value={adults} min={1} onChange={setAdults} />
                <GuestCounter label={t('searchChildren')} value={children} min={0} onChange={setChildren} />
                <GuestCounter label={t('searchRooms')} value={rooms} min={1} onChange={setRooms} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" size="icon" className="rounded-full flex-shrink-0" data-testid="button-compact-search" disabled={!checkIn || !checkOut}>
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-card p-7 md:p-8 rounded-3xl shadow-xl w-full max-w-5xl mx-auto" data-testid="form-search-hero">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-base">{t('searchDestination')}</Label>
          <Popover open={isDestinationOpen} onOpenChange={setIsDestinationOpen}>
            <PopoverAnchor asChild>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setIsDestinationOpen(true);
                  }}
                  onFocus={() => setIsDestinationOpen(true)}
                  onClick={() => setIsDestinationOpen(true)}
                  placeholder={t('searchDestinationPlaceholder')}
                  className="h-12 pl-12 text-base bg-muted/50 border-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500"
                  data-testid="input-hero-destination"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[min(92vw,35rem)] overflow-hidden rounded-2xl p-0"
            >
              <div className="border-b border-border/70 px-5 py-4">
                <p className="text-2xl font-serif font-semibold">{t('searchTrendingDestinations')}</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {destinationOptions.length > 0 ? (
                  destinationOptions.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleDestinationSelect(dest.name)}
                      className="flex w-full items-center gap-4 border-b border-border/70 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                    >
                      <MapPin className="h-7 w-7 shrink-0 text-foreground/80" />
                      <div>
                        <p className="text-2xl font-semibold text-foreground">{dest.name}</p>
                        <p className="text-lg text-muted-foreground">{dest.country}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="px-5 py-4 text-sm text-muted-foreground">{t('searchNoDestinations')}</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkIn" className="text-base">{t('searchCheckInLabel')}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="checkIn"
                  type="button"
                  onClick={() => setActiveDateField('checkIn')}
                  className="h-12 w-full rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-left text-base outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                  data-testid="input-hero-checkin"
                >
                  {displayDate(checkIn)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-[95vw] rounded-[1.75rem] border border-border/60 bg-background p-4 shadow-xl" align="start">
                <div className="inline-flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkIn')}
                      aria-pressed={activeDateField === 'checkIn'}
                      className={`${activeDateField === 'checkIn' ? activeSummaryCardClass : inactiveSummaryCardClass} w-full text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckIn')}</p>
                      <p className="mt-1 text-[1.55rem] font-semibold leading-tight text-foreground">{displayLongDate(checkIn)}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkOut')}
                      aria-pressed={activeDateField === 'checkOut'}
                      className={`${activeDateField === 'checkOut' ? activeSummaryCardClass : inactiveSummaryCardClass} w-full text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckOut')}</p>
                      <p className="mt-1 text-[1.55rem] font-semibold leading-tight text-foreground">{displayLongDate(checkOut)}</p>
                    </button>
                  </div>
                  <SharedCalendarPicker />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut" className="text-base">{t('searchCheckOutLabel')}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="checkOut"
                  type="button"
                  onClick={() => setActiveDateField('checkOut')}
                  className="h-12 w-full rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-left text-base outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                  data-testid="input-hero-checkout"
                >
                  {displayDate(checkOut)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-fit max-w-[95vw] rounded-[1.75rem] border border-border/60 bg-background p-4 shadow-xl" align="start">
                <div className="inline-flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkIn')}
                      aria-pressed={activeDateField === 'checkIn'}
                      className={`${activeDateField === 'checkIn' ? activeSummaryCardClass : inactiveSummaryCardClass} w-full text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckIn')}</p>
                      <p className="mt-1 text-[1.55rem] font-semibold leading-tight text-foreground">{displayLongDate(checkIn)}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkOut')}
                      aria-pressed={activeDateField === 'checkOut'}
                      className={`${activeDateField === 'checkOut' ? activeSummaryCardClass : inactiveSummaryCardClass} w-full text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckOut')}</p>
                      <p className="mt-1 text-[1.55rem] font-semibold leading-tight text-foreground">{displayLongDate(checkOut)}</p>
                    </button>
                  </div>
                  <SharedCalendarPicker />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests" className="text-base">{t('searchGuests')}</Label>
          <div className="relative flex flex-col gap-2 xl:flex-row">
            <div className="relative flex-1">
              <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="guests"
                    type="button"
                    className="h-12 w-full rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-left text-base whitespace-nowrap overflow-hidden text-ellipsis outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1"
                    data-testid="input-hero-guests"
                  >
                    {guests} {guestWord}, {rooms} {roomWord}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-72 p-4">
                  <div className="space-y-3">
                    <GuestCounter label={t('searchAdults')} value={adults} min={1} onChange={setAdults} />
                    <GuestCounter label={t('searchChildren')} value={children} min={0} onChange={setChildren} />
                    <GuestCounter label={t('searchRooms')} value={rooms} min={1} onChange={setRooms} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="h-12 px-6 text-base w-full xl:w-auto" data-testid="button-hero-search" disabled={!checkIn || !checkOut}>
              {t('searchAction')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function GuestCounter({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (value: number) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={t('searchDecrease', { label })}
        >
          -
        </Button>
        <span className="w-6 text-center text-sm">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(value + 1)}
          aria-label={t('searchIncrease', { label })}
        >
          +
        </Button>
      </div>
    </div>
  );
}