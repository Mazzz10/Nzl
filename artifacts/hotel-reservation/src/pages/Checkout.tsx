import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/use-app-state';
import { SearchParams } from '../types';
import { sampleHotels } from '../data/hotels';
import Navbar from '../components/Navbar';
import BookingSummary from '../components/BookingSummary';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function Checkout({ hotelId, roomId, params, selectedAddOns, navigateTo }: { 
  hotelId: string; 
  roomId: string; 
  params: SearchParams; 
  selectedAddOns: string[];
  navigateTo: ReturnType<typeof useAppState>['navigateTo'] 
}) {
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const hotel = sampleHotels.find(h => h.id === hotelId);
  const room = hotel?.roomTypes.find(r => r.id === roomId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!hotel || !room) return <div>Invalid booking details</div>;

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    requests: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isGuestInfoValid = formData.firstName && formData.lastName && formData.email && formData.phone;
  const isPaymentValid = formData.cardNumber && formData.expiry && formData.cvv && formData.cardName;

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      navigateTo({ name: 'dashboard' });
    }, 3000);
  };

  if (isConfirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar navigateTo={navigateTo} />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Check className="h-12 w-12 text-primary" />
              </motion.div>
            </div>
            <h1 className="font-serif text-4xl font-semibold mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-8">
              We're preparing your stay at {hotel.name}. A confirmation email has been sent to {formData.email}.
            </p>
            <div className="animate-pulse text-sm text-primary font-medium">
              Redirecting to your dashboard...
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar navigateTo={navigateTo} />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => step > 1 ? setStep(step - 1) : navigateTo({ name: 'hotel_details', hotelId, params })}
          data-testid="button-back-checkout"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {step > 1 ? 'Back' : 'Back to hotel'}
        </Button>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-border -z-10" />
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-500" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
            
            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                  step > num ? 'bg-primary text-primary-foreground' : 
                  step === num ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                  'bg-card text-muted-foreground border-2 border-border'
                }`}>
                  {step > num ? <Check className="h-5 w-5" /> : num}
                </div>
                <span className={`mt-2 text-xs font-medium ${step >= num ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {num === 1 ? 'Room Details' : num === 2 ? 'Guest Info' : 'Payment'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* Step 1: Room Details */}
                {step === 1 && (
                  <Card className="border-border/50 shadow-sm" data-testid="checkout-step-1">
                    <CardContent className="p-8">
                      <h2 className="font-serif text-2xl font-semibold mb-6">Review your selection</h2>
                      
                      <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        <div className={`h-32 sm:w-48 rounded-lg ${hotel.images[0]} bg-cover bg-center flex-shrink-0`} />
                        <div>
                          <h3 className="font-serif text-xl font-medium mb-1">{hotel.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.location}</p>
                          <div className="bg-muted/30 inline-block px-3 py-1.5 rounded text-sm font-medium">
                            {room.name}
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full h-12 text-lg" onClick={() => setStep(2)} data-testid="button-continue-1">
                        Continue to Guest Info
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Guest Info */}
                {step === 2 && (
                  <Card className="border-border/50 shadow-sm" data-testid="checkout-step-2">
                    <CardContent className="p-8">
                      <h2 className="font-serif text-2xl font-semibold mb-6">Guest Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="pl-9" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="pl-9" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="pl-9" required />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-8">
                        <Label htmlFor="requests">Special Requests (Optional)</Label>
                        <Textarea 
                          id="requests" 
                          name="requests" 
                          placeholder="e.g. early check-in, high floor..." 
                          value={formData.requests} 
                          onChange={handleInputChange}
                          className="min-h-[100px]" 
                        />
                      </div>
                      
                      <Button 
                        className="w-full h-12 text-lg" 
                        onClick={() => setStep(3)} 
                        disabled={!isGuestInfoValid}
                        data-testid="button-continue-2"
                      >
                        Continue to Payment
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <Card className="border-border/50 shadow-sm" data-testid="checkout-step-3">
                    <CardContent className="p-8">
                      <h2 className="font-serif text-2xl font-semibold mb-6">Payment Method</h2>
                      
                      <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between mb-8 border border-border/50">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <span className="font-medium">Credit or Debit Card</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input id="cardNumber" name="cardNumber" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date *</Label>
                            <Input id="expiry" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input id="cvv" name="cvv" placeholder="123" value={formData.cvv} onChange={handleInputChange} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card *</Label>
                          <Input id="cardName" name="cardName" value={formData.cardName} onChange={handleInputChange} />
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full h-12 text-lg" 
                        onClick={handleConfirm} 
                        disabled={!isPaymentValid}
                        data-testid="button-confirm-booking"
                      >
                        Confirm Booking
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                        By confirming, you agree to our Terms & Conditions
                      </p>
                    </CardContent>
                  </Card>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <BookingSummary 
              room={room}
              params={params}
              selectedAddOnIds={selectedAddOns}
              onBook={() => {}}
              isReadOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
