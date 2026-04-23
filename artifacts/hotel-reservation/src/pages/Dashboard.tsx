import React from 'react';
import { useAppState } from '../hooks/use-app-state';
import { sampleBookings } from '../data/hotels';
import Navbar from '../components/Navbar';
import LoyaltyProgress from '../components/LoyaltyProgress';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useLocale } from '../lib/i18n';

const BOOKING_IMAGE_BY_HOTEL_ID: Record<string, string> = {
  h1: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1400&auto=format&fit=crop',
  h2: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=1400&auto=format&fit=crop',
  h3: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1400&auto=format&fit=crop',
  h4: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1400&auto=format&fit=crop',
  h5: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1400&auto=format&fit=crop',
  h6: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1400&auto=format&fit=crop',
};

export default function Dashboard({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const { t } = useLocale();
  // Mock new booking for demo purposes if we just completed checkout
  const upcomingBookings = [sampleBookings[0]];
  upcomingBookings[0].status = 'Confirmed';

  const pastBookings = sampleBookings.slice(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20';
      case 'Completed': return 'bg-slate-500/10 text-slate-700 hover:bg-slate-500/20 border-slate-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const localizeStatus = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return t('statusConfirmed');
      case 'Completed':
        return t('statusCompleted');
      case 'Cancelled':
        return t('statusCancelled');
      default:
        return status;
    }
  };

  const getBookingImage = (hotelId: string) => BOOKING_IMAGE_BY_HOTEL_ID[hotelId];

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar navigateTo={navigateTo} />

      <div className="bg-card border-b border-border py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="mb-2 font-serif text-2xl font-semibold sm:text-3xl md:text-4xl">{t('dashboardWelcomeBack', { name: 'Mazen' })}</h1>
              <p className="text-muted-foreground">{t('dashboardManageText')}</p>
            </div>

            <div className="grid w-full grid-cols-3 gap-2 rounded-xl border border-border/50 bg-muted/30 p-3 sm:p-4 md:w-auto md:gap-6">
              <div className="border-r border-border px-2 text-center sm:px-4">
                <div className="text-2xl font-semibold font-serif text-primary">3</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboardBookings')}</div>
              </div>
              <div className="border-r border-border px-2 text-center sm:px-4">
                <div className="text-2xl font-semibold font-serif text-primary">12</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboardNights')}</div>
              </div>
              <div className="px-2 text-center sm:px-4">
                <div className="text-2xl font-semibold font-serif text-primary">850</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('dashboardPoints')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Main Content - Bookings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <h2 className="font-serif text-2xl font-semibold">{t('dashboardYourTrips')}</h2>
              <Button onClick={() => navigateTo({ name: 'home' })} variant="outline" size="sm" data-testid="button-book-another">
                <Search className="mr-2 h-4 w-4" /> {t('dashboardBookAnother')}
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" data-testid="tab-upcoming">{t('dashboardUpcoming')}</TabsTrigger>
                <TabsTrigger value="past" data-testid="tab-past">{t('dashboardPastStays')}</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4" data-testid="content-upcoming">
                {upcomingBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="overflow-hidden border-primary/20 shadow-sm" data-testid={`card-booking-${booking.id}`}>
                      <div className="flex flex-col sm:flex-row">
                        <div className="h-32 sm:h-auto sm:w-48 overflow-hidden bg-muted/20 flex-shrink-0">
                          {getBookingImage(booking.hotelId) ? (
                            <img
                              src={getBookingImage(booking.hotelId)}
                              alt={`${booking.hotelName} photo`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`h-full w-full ${booking.image} bg-cover bg-center`} />
                          )}
                        </div>
                        <CardContent className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant="outline" className={`mb-2 ${getStatusColor(booking.status)}`}>
                                {localizeStatus(booking.status)}
                              </Badge>
                              <h3 className="font-serif text-xl font-semibold">{booking.hotelName}</h3>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">${booking.totalAmount}</span>
                            </div>
                          </div>

                          <div className="text-sm text-muted-foreground space-y-2 mt-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(booking.checkIn), 'MMM d, yyyy')} – {format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{booking.roomName} • {t('dashboardGuests', { count: booking.guests })}</span>
                            </div>
                          </div>

                          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">{t('dashboardViewItinerary')}</Button>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">{t('dashboardCancel')}</Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="past" className="space-y-4" data-testid="content-past">
                {pastBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="overflow-hidden border-border/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col sm:flex-row">
                        <div className="h-24 sm:h-auto sm:w-40 overflow-hidden bg-muted/20 flex-shrink-0 grayscale-[0.3]">
                          {getBookingImage(booking.hotelId) ? (
                            <img
                              src={getBookingImage(booking.hotelId)}
                              alt={`${booking.hotelName} photo`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`h-full w-full ${booking.image} bg-cover bg-center`} />
                          )}
                        </div>
                        <CardContent className="flex-1 p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant="outline" className={`mb-1 ${getStatusColor(booking.status)}`}>
                                {localizeStatus(booking.status)}
                              </Badge>
                              <h3 className="font-serif text-lg font-medium">{booking.hotelName}</h3>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">${booking.totalAmount}</span>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground mt-2">
                            <span>{format(new Date(booking.checkIn), 'MMM d, yyyy')} – {format(new Date(booking.checkOut), 'MMM d, yyyy')}</span>
                          </div>

                          <div className="mt-4">
                            <Button variant="secondary" size="sm">{t('dashboardBookAgain')}</Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Loyalty */}
          <div className="lg:col-span-1">
            <h2 className="mb-5 font-serif text-xl font-semibold sm:mb-6 sm:text-2xl">{t('dashboardRewards')}</h2>
            <LoyaltyProgress />
          </div>

        </div>
      </div>
    </div>
  );
}
