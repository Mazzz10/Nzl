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

export default function Dashboard({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
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

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar navigateTo={navigateTo} />
      
      <div className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">Welcome back, Alex</h1>
              <p className="text-muted-foreground">Manage your stays and view your loyalty status.</p>
            </div>
            
            <div className="flex gap-6 p-4 bg-muted/30 rounded-xl border border-border/50 w-full md:w-auto">
              <div className="text-center px-4 border-r border-border">
                <div className="text-2xl font-semibold font-serif text-primary">3</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Bookings</div>
              </div>
              <div className="text-center px-4 border-r border-border">
                <div className="text-2xl font-semibold font-serif text-primary">12</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Nights</div>
              </div>
              <div className="text-center px-4">
                <div className="text-2xl font-semibold font-serif text-primary">850</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Points</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Bookings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">Your Trips</h2>
              <Button onClick={() => navigateTo({ name: 'home' })} variant="outline" size="sm" data-testid="button-book-another">
                <Search className="mr-2 h-4 w-4" /> Book Another Stay
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past" data-testid="tab-past">Past Stays</TabsTrigger>
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
                        <div className={`h-32 sm:h-auto sm:w-48 ${booking.image} bg-cover bg-center flex-shrink-0`} />
                        <CardContent className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant="outline" className={`mb-2 ${getStatusColor(booking.status)}`}>
                                {booking.status}
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
                              <span>{booking.roomName} • {booking.guests} Guests</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex gap-3">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">View Itinerary</Button>
                            <Button variant="outline" size="sm" className="w-full sm:w-auto text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">Cancel</Button>
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
                        <div className={`h-24 sm:h-auto sm:w-40 ${booking.image} bg-cover bg-center flex-shrink-0 grayscale-[0.3]`} />
                        <CardContent className="flex-1 p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Badge variant="outline" className={`mb-1 ${getStatusColor(booking.status)}`}>
                                {booking.status}
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
                            <Button variant="secondary" size="sm">Book Again</Button>
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
            <h2 className="font-serif text-2xl font-semibold mb-6">Lumière Rewards</h2>
            <LoyaltyProgress />
          </div>

        </div>
      </div>
    </div>
  );
}
