import React, { useState } from 'react';
import { SearchParams } from '../types';
import { trendingDestinations } from '../data/hotels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { useIsMobile } from '../hooks/use-mobile';
import { useLocale } from '../lib/i18n';

interface SearchBarProps {
  initialParams?: SearchParams;
  onSearch: (params: SearchParams) => void;
  variant?: 'hero' | 'compact';
}

export default function SearchBar({ initialParams, onSearch, variant = 'hero' }: SearchBarProps) {
  const { t, language, isRtl } = useLocale();
  const isMobile = useIsMobile();
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
  const [isCompactMobileOpen, setIsCompactMobileOpen] = useState(false);

  const guests = adults + children;
  const guestWord = guests > 1 ? t('searchGuestsPlural') : t('searchGuest');
  const roomWord = rooms > 1 ? t('searchRoomsPlural') : t('searchRoom');

  const dateLocale = language === 'AR' ? 'ar-EG-u-ca-gregory' : 'en-US';
  const textAlignClass = isRtl ? 'text-right' : 'text-left';

  const formatUiDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(dateLocale, options).format(date);
  };

  // FIX: Handle empty date states gracefully in the UI
  const displayDate = (value: string) => value
    ? formatUiDate(toDateValue(value) as Date, { day: '2-digit', month: 'short', year: 'numeric' })
    : t('searchAddDate');
  const displayLongDate = (value: string) => value
    ? formatUiDate(toDateValue(value) as Date, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
    : t('searchSelectDate');

  const destinationSummary = destination || t('searchWhereTo');
  const staySummary = checkIn && checkOut ? `${displayDate(checkIn)} - ${displayDate(checkOut)}` : t('searchSelectDate');
  const occupancySummary = `${guests} ${guestWord}, ${rooms} ${roomWord}`;

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

  const handleSearchAndClose = (e: React.FormEvent) => {
    handleSearch(e);
    if (checkIn && checkOut) {
      setIsCompactMobileOpen(false);
    }
  };

  const todayStr = format(today, 'yyyy-MM-dd');

  // Reusable Calendar Component with Fixed Styling
  // Reusable Calendar Component with Fixed Styling
  const SharedCalendarPicker = () => (
    <CalendarPicker
      mode="range"
      numberOfMonths={isMobile ? 1 : 2}
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
      className="[--cell-size:2.25rem] sm:[--cell-size:2.6rem]"
      initialFocus
    />
  );
  if (variant === 'compact' && isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsCompactMobileOpen(true)}
          className="mx-auto flex w-full items-center justify-between gap-3 rounded-full border bg-card px-4 py-3 shadow-sm transition-colors hover:border-primary/30"
          data-testid="button-search-pill-mobile"
          aria-label={t('searchAction')}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Search className="h-4 w-4 shrink-0 text-primary" />
            <div className={`min-w-0 ${textAlignClass}`}>
              <p className="truncate text-sm font-semibold text-foreground">{destinationSummary}</p>
              <p className="truncate text-xs text-muted-foreground">{staySummary} • {occupancySummary}</p>
            </div>
          </div>
          <span className="shrink-0 text-sm font-semibold text-primary">{t('searchAction')}</span>
        </button>

        <Sheet open={isCompactMobileOpen} onOpenChange={setIsCompactMobileOpen}>
          <SheetContent
            side="bottom"
            className="h-[min(84vh,620px)] overflow-y-auto rounded-t-3xl border-border/70 px-4 pb-6 pt-8"
          >
            <SheetHeader className={`mb-4 ${textAlignClass}`}>
              <SheetTitle className="font-serif text-2xl">{t('searchAction')}</SheetTitle>
            </SheetHeader>

            <form onSubmit={handleSearchAndClose} className="grid grid-cols-1 gap-3" data-testid="form-search-compact-mobile">
              <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t('searchWhereTo')}
                  className={`h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-blue-500 ${textAlignClass}`}
                  data-testid="input-compact-mobile-destination"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                      data-testid="input-compact-mobile-checkin"
                    >
                      {displayDate(checkIn)}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit max-w-[95vw] p-3 sm:p-4" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={toDateValue(checkIn)}
                      onSelect={handleCheckInSelect}
                      disabled={{ before: toDateValue(todayStr) as Date }}
                      className="[--cell-size:2.25rem] sm:[--cell-size:2.5rem]"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                      data-testid="input-compact-mobile-checkout"
                    >
                      {displayDate(checkOut)}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit max-w-[95vw] p-3 sm:p-4" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={toDateValue(checkOut)}
                      onSelect={handleCheckOutSelect}
                      disabled={{ before: toDateValue(checkIn) as Date }}
                      className="[--cell-size:2.25rem] sm:[--cell-size:2.5rem]"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2">
                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                      data-testid="input-compact-mobile-guests"
                    >
                      {guests} {guestWord}, {rooms} {roomWord}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-[min(90vw,18rem)] p-4">
                    <div className="space-y-3">
                      <GuestCounter label={t('searchAdults')} value={adults} min={1} onChange={setAdults} />
                      <GuestCounter label={t('searchChildren')} value={children} min={0} onChange={setChildren} />
                      <GuestCounter label={t('searchRooms')} value={rooms} min={1} onChange={setRooms} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                type="submit"
                className={`h-11 w-full gap-2 rounded-full ${isRtl ? 'flex-row-reverse' : ''}`}
                data-testid="button-compact-mobile-search"
                disabled={!checkIn || !checkOut}
              >
                <Search className="h-4 w-4" />
                <span>{t('searchAction')}</span>
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <form
        onSubmit={handleSearch}
        className="mx-auto grid w-full max-w-4xl gap-2 rounded-2xl border bg-card p-3 shadow-sm md:grid-cols-2 lg:flex lg:items-center lg:gap-2 lg:rounded-full lg:p-2"
        data-testid="form-search-compact"
      >
        <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 lg:flex-1 lg:border-0 lg:px-4 lg:py-0 lg:pe-4 lg:border-e lg:rounded-none">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t('searchWhereTo')}
            className="h-8 border-0 p-0 text-sm shadow-none focus-visible:ring-2 focus-visible:ring-blue-500"
            data-testid="input-compact-destination"
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 lg:flex-1 lg:border-0 lg:px-4 lg:py-0 lg:pe-4 lg:border-e lg:rounded-none">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                data-testid="input-compact-checkin"
              >
                {displayDate(checkIn)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit max-w-[95vw] p-3 sm:p-4" align="start">
              <CalendarPicker
                mode="single"
                selected={toDateValue(checkIn)}
                onSelect={handleCheckInSelect}
                disabled={{ before: toDateValue(todayStr) as Date }}
                className="[--cell-size:2.25rem] sm:[--cell-size:2.5rem]"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 lg:flex-1 lg:border-0 lg:px-4 lg:py-0 lg:pe-4 lg:border-e lg:rounded-none">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                data-testid="input-compact-checkout"
              >
                {displayDate(checkOut)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-fit max-w-[95vw] p-3 sm:p-4" align="start">
              <CalendarPicker
                mode="single"
                selected={toDateValue(checkOut)}
                onSelect={handleCheckOutSelect}
                disabled={{ before: toDateValue(checkIn) as Date }}
                className="[--cell-size:2.25rem] sm:[--cell-size:2.5rem]"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 lg:flex-1 lg:border-0 lg:px-4 lg:py-0">
          <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`h-8 min-w-0 rounded-md px-1 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 ${textAlignClass}`}
                data-testid="input-compact-guests"
              >
                {guests} {guestWord}, {rooms} {roomWord}
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(90vw,18rem)] p-4">
              <div className="space-y-3">
                <GuestCounter label={t('searchAdults')} value={adults} min={1} onChange={setAdults} />
                <GuestCounter label={t('searchChildren')} value={children} min={0} onChange={setChildren} />
                <GuestCounter label={t('searchRooms')} value={rooms} min={1} onChange={setRooms} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          type="submit"
          className={`h-10 w-full gap-2 rounded-xl lg:h-10 lg:w-auto lg:rounded-full ${isRtl ? 'flex-row-reverse' : ''}`}
          data-testid="button-compact-search"
          disabled={!checkIn || !checkOut}
        >
          <Search className="h-4 w-4" />
          <span>{t('searchAction')}</span>
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-5xl rounded-3xl bg-card p-5 shadow-xl sm:p-6 md:p-8" data-testid="form-search-hero">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm md:text-base">{t('searchDestination')}</Label>
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
                  className="h-12 border-transparent bg-muted/50 pl-12 text-sm focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-blue-500 md:text-base"
                  data-testid="input-hero-destination"
                />
              </div>
            </PopoverAnchor>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[min(94vw,35rem)] overflow-hidden rounded-2xl p-0"
            >
              <div className="border-b border-border/70 px-4 py-3 sm:px-5 sm:py-4">
                <p className="font-serif text-xl font-semibold sm:text-2xl">{t('searchTrendingDestinations')}</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {destinationOptions.length > 0 ? (
                  destinationOptions.map((dest) => (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => handleDestinationSelect(dest.name)}
                      className={`flex w-full items-center gap-3 border-b border-border/70 px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/30 sm:gap-4 sm:px-5 sm:py-4 ${textAlignClass}`}
                    >
                      <MapPin className="h-5 w-5 shrink-0 text-foreground/80 sm:h-7 sm:w-7" />
                      <div>
                        <p className="text-base font-semibold text-foreground sm:text-2xl">{dest.name}</p>
                        <p className="text-sm text-muted-foreground sm:text-lg">{dest.country}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-4 text-sm text-muted-foreground sm:px-5">{t('searchNoDestinations')}</p>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkIn" className="text-sm md:text-base">{t('searchCheckInLabel')}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="checkIn"
                  type="button"
                  onClick={() => setActiveDateField('checkIn')}
                  className={`h-12 w-full rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 md:text-base ${textAlignClass}`}
                  data-testid="input-hero-checkin"
                >
                  {displayDate(checkIn)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(96vw,46rem)] rounded-[1.5rem] border border-border/60 bg-background p-3 shadow-xl sm:p-4" align="start">
                <div className="inline-flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkIn')}
                      aria-pressed={activeDateField === 'checkIn'}
                      className={`${activeDateField === 'checkIn' ? activeSummaryCardClass : inactiveSummaryCardClass} ${textAlignClass} w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckIn')}</p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-foreground sm:text-[1.55rem]">{displayLongDate(checkIn)}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkOut')}
                      aria-pressed={activeDateField === 'checkOut'}
                      className={`${activeDateField === 'checkOut' ? activeSummaryCardClass : inactiveSummaryCardClass} ${textAlignClass} w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckOut')}</p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-foreground sm:text-[1.55rem]">{displayLongDate(checkOut)}</p>
                    </button>
                  </div>
                  <SharedCalendarPicker />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkOut" className="text-sm md:text-base">{t('searchCheckOutLabel')}</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="checkOut"
                  type="button"
                  onClick={() => setActiveDateField('checkOut')}
                  className={`h-12 w-full rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 md:text-base ${textAlignClass}`}
                  data-testid="input-hero-checkout"
                >
                  {displayDate(checkOut)}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(96vw,46rem)] rounded-[1.5rem] border border-border/60 bg-background p-3 shadow-xl sm:p-4" align="start">
                <div className="inline-flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkIn')}
                      aria-pressed={activeDateField === 'checkIn'}
                      className={`${activeDateField === 'checkIn' ? activeSummaryCardClass : inactiveSummaryCardClass} ${textAlignClass} w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckIn')}</p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-foreground sm:text-[1.55rem]">{displayLongDate(checkIn)}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveDateField('checkOut')}
                      aria-pressed={activeDateField === 'checkOut'}
                      className={`${activeDateField === 'checkOut' ? activeSummaryCardClass : inactiveSummaryCardClass} ${textAlignClass} w-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                    >
                      <p className="text-sm font-medium text-muted-foreground">{t('searchCheckOut')}</p>
                      <p className="mt-1 text-lg font-semibold leading-tight text-foreground sm:text-[1.55rem]">{displayLongDate(checkOut)}</p>
                    </button>
                  </div>
                  <SharedCalendarPicker />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests" className="text-sm md:text-base">{t('searchGuests')}</Label>
          <div className="relative flex flex-col gap-2 xl:flex-row">
            <div className="relative flex-1">
              <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="guests"
                    type="button"
                    className={`h-12 w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-transparent bg-muted/50 pl-12 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-[state=open]:ring-2 data-[state=open]:ring-blue-500 data-[state=open]:ring-offset-1 md:text-base ${textAlignClass}`}
                    data-testid="input-hero-guests"
                  >
                    {guests} {guestWord}, {rooms} {roomWord}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[min(90vw,18rem)] p-4">
                  <div className="space-y-3">
                    <GuestCounter label={t('searchAdults')} value={adults} min={1} onChange={setAdults} />
                    <GuestCounter label={t('searchChildren')} value={children} min={0} onChange={setChildren} />
                    <GuestCounter label={t('searchRooms')} value={rooms} min={1} onChange={setRooms} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button type="submit" className="h-12 w-full px-6 text-base xl:w-auto" data-testid="button-hero-search" disabled={!checkIn || !checkOut}>
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