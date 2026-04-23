import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/use-app-state';
import { SearchParams } from '../types';
import { sampleHotels } from '../data/hotels';
import Navbar from '../components/Navbar';
import BookingSummary from '../components/BookingSummary';
import GmailInput from '../components/GmailInput';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, CreditCard, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getRoomImageById } from '../lib/room-images';
import { useLocale } from '../lib/i18n';
import { getGmailUsername, normalizeGmailEmail } from '../lib/email';

export default function Checkout({ hotelId, roomId, params, selectedAddOns, navigateTo }: {
  hotelId: string;
  roomId: string;
  params: SearchParams;
  selectedAddOns: string[];
  navigateTo: ReturnType<typeof useAppState>['navigateTo']
}) {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [guestSubmitted, setGuestSubmitted] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const hotel = sampleHotels.find(h => h.id === hotelId);
  const room = hotel?.roomTypes.find(r => r.id === roomId);
  const selectedRoomImage = getRoomImageById(roomId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (!hotel || !room) return <div>{t('checkoutInvalidDetails')}</div>;

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

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let normalizedValue = value;

    if (name === 'phone') {
      normalizedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    if (name === 'cardNumber') {
      normalizedValue = formatCardNumber(value);
    }

    if (name === 'expiry') {
      normalizedValue = formatExpiry(value);
    }

    if (name === 'cvv') {
      normalizedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    if (name === 'email') {
      normalizedValue = getGmailUsername(value);
    }

    setFormData(prev => ({ ...prev, [name]: normalizedValue }));
  };

  const trimmedFirstName = formData.firstName.trim();
  const trimmedLastName = formData.lastName.trim();
  const normalizedGuestEmail = normalizeGmailEmail(formData.email);
  const guestEmailUsername = getGmailUsername(formData.email);
  const trimmedEmail = normalizedGuestEmail.trim();
  const isGmailEmail = /^[^\s@]+@gmail\.com$/i.test(trimmedEmail);
  const isPhoneValid = /^\d{10}$/.test(formData.phone);

  const showFirstNameError = guestSubmitted || formData.firstName.length > 0;
  const showLastNameError = guestSubmitted || formData.lastName.length > 0;
  const showEmailError = guestSubmitted || guestEmailUsername.length > 0;
  const showPhoneError = guestSubmitted || formData.phone.length > 0;

  const firstNameError = showFirstNameError
    ? (!trimmedFirstName ? t('checkoutErrFirstNameRequired') : '')
    : '';
  const lastNameError = showLastNameError
    ? (!trimmedLastName ? t('checkoutErrLastNameRequired') : '')
    : '';
  const emailError = showEmailError
    ? (!guestEmailUsername
      ? t('checkoutErrEmailRequired')
      : (!isGmailEmail ? t('checkoutErrEmailGmail') : ''))
    : '';
  const phoneError = showPhoneError
    ? (!formData.phone
      ? t('checkoutErrPhoneRequired')
      : (!isPhoneValid ? t('checkoutErrPhoneDigits') : ''))
    : '';

  const isGuestInfoValid = Boolean(trimmedFirstName && trimmedLastName && isGmailEmail && isPhoneValid);

  const cardDigits = formData.cardNumber.replace(/\s/g, '');
  const isCardNumberValid = /^\d{16}$/.test(cardDigits);
  const isCvvValid = /^\d{3}$/.test(formData.cvv);
  const trimmedCardName = formData.cardName.trim();

  const expiryMatch = formData.expiry.match(/^(\d{2})\/(\d{2})$/);
  const expiryMonth = expiryMatch ? Number(expiryMatch[1]) : 0;
  const expiryYear = expiryMatch ? Number(expiryMatch[2]) : 0;
  const isExpiryMonthValid = expiryMonth >= 1 && expiryMonth <= 12;

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  const isExpiryNotPast = expiryMatch
    ? expiryYear > currentYear || (expiryYear === currentYear && expiryMonth >= currentMonth)
    : false;

  const isCardNameValid = /^[A-Za-z][A-Za-z\s'-]{1,}$/.test(trimmedCardName);

  const showCardNumberError = paymentSubmitted || formData.cardNumber.length > 0;
  const showExpiryError = paymentSubmitted || formData.expiry.length > 0;
  const showCvvError = paymentSubmitted || formData.cvv.length > 0;
  const showCardNameError = paymentSubmitted || formData.cardName.length > 0;

  const cardNumberError = showCardNumberError
    ? (!cardDigits
      ? t('checkoutErrCardNumberRequired')
      : (!isCardNumberValid ? t('checkoutErrCardNumberDigits') : ''))
    : '';
  const expiryError = showExpiryError
    ? (!formData.expiry
      ? t('checkoutErrExpiryRequired')
      : (!expiryMatch || !isExpiryMonthValid
        ? t('checkoutErrExpiryFormat')
        : (!isExpiryNotPast ? t('checkoutErrExpiryPast') : '')))
    : '';
  const cvvError = showCvvError
    ? (!formData.cvv
      ? t('checkoutErrCvvRequired')
      : (!isCvvValid ? t('checkoutErrCvvDigits') : ''))
    : '';
  const cardNameError = showCardNameError
    ? (!trimmedCardName
      ? t('checkoutErrCardNameRequired')
      : (!isCardNameValid ? t('checkoutErrCardNameInvalid') : ''))
    : '';

  const isPaymentValid = isCardNumberValid && isCvvValid && isExpiryMonthValid && isExpiryNotPast && isCardNameValid;

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      navigateTo({ name: 'dashboard' });
    }, 3000);
  };

  const handleContinueToPayment = () => {
    setGuestSubmitted(true);
    if (!isGuestInfoValid) return;

    if (normalizedGuestEmail !== formData.email) {
      setFormData((prev) => ({ ...prev, email: normalizedGuestEmail }));
    }

    setStep(3);
  };

  const handleConfirmBooking = () => {
    setPaymentSubmitted(true);
    if (!isPaymentValid) return;
    handleConfirm();
  };

  if (isConfirmed) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar navigateTo={navigateTo} />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md text-center"
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
            <h1 className="mb-4 font-serif text-3xl font-semibold sm:text-4xl">{t('checkoutConfirmedTitle')}</h1>
            <p className="mb-8 text-base text-muted-foreground sm:text-lg">
              {t('checkoutConfirmedText', { hotel: hotel.name, email: formData.email })}
            </p>
            <div className="animate-pulse text-sm text-primary font-medium">
              {t('checkoutRedirecting')}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar navigateTo={navigateTo} />

      <div className="container mx-auto px-4 py-5 sm:py-8">
        <Button
          variant="ghost"
          className="mb-5 pl-0 hover:bg-transparent hover:text-primary sm:mb-8"
          onClick={() => step > 1 ? setStep(step - 1) : navigateTo({ name: 'hotel_details', hotelId, params })}
          data-testid="button-back-checkout"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {step > 1 ? t('checkoutBack') : t('checkoutBackToHotel')}
        </Button>

        {/* Stepper */}
        <div className="mx-auto mb-8 max-w-4xl sm:mb-12">
          <div className="relative flex items-start justify-between gap-2 sm:items-center">
            <div className="absolute left-0 top-4 h-1 w-full -z-10 bg-border sm:top-1/2 sm:-translate-y-1/2" />
            <div
              className="absolute left-0 top-4 h-1 -z-10 bg-primary transition-all duration-500 sm:top-1/2 sm:-translate-y-1/2"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />

            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-1 flex-col items-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 sm:h-10 sm:w-10 ${step > num ? 'bg-primary text-primary-foreground' :
                  step === num ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                    'bg-card text-muted-foreground border-2 border-border'
                  }`}>
                  {step > num ? <Check className="h-5 w-5" /> : num}
                </div>
                <span className={`mt-1 text-center text-[11px] font-medium sm:mt-2 sm:text-xs ${step >= num ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {num === 1 ? t('checkoutStepRoom') : num === 2 ? t('checkoutStepGuest') : t('checkoutStepPayment')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
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
                    <CardContent className="p-5 sm:p-8">
                      <h2 className="mb-5 font-serif text-xl font-semibold sm:mb-6 sm:text-2xl">{t('checkoutReviewSelection')}</h2>

                      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <div className="h-40 overflow-hidden rounded-lg bg-muted/20 sm:h-32 sm:w-48 sm:flex-shrink-0">
                          {selectedRoomImage ? (
                            <img
                              src={selectedRoomImage}
                              alt={`${room.name} photo`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`h-full w-full ${hotel.images[0]} bg-cover bg-center`} />
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-medium mb-1">{hotel.name}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{hotel.location}</p>
                          <div className="bg-muted/30 inline-block px-3 py-1.5 rounded text-sm font-medium">
                            {room.name}
                          </div>
                        </div>
                      </div>

                      <Button className="h-12 w-full text-base transition-colors duration-200 hover:bg-primary/80 sm:text-lg" onClick={() => setStep(2)} data-testid="button-continue-1">
                        {t('checkoutContinueGuest')}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Guest Info */}
                {step === 2 && (
                  <Card className="border-border/50 shadow-sm" data-testid="checkout-step-2">
                    <CardContent className="p-5 sm:p-8">
                      <h2 className="mb-5 font-serif text-xl font-semibold sm:mb-6 sm:text-2xl">{t('checkoutGuestInfo')}</h2>

                      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t('checkoutFirstName')}</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`pl-9 ${firstNameError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                              aria-invalid={Boolean(firstNameError)}
                              required
                            />
                          </div>
                          {firstNameError && <p className="text-xs text-destructive">{firstNameError}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t('checkoutLastName')}</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={lastNameError ? 'border-destructive focus-visible:ring-destructive' : ''}
                            aria-invalid={Boolean(lastNameError)}
                            required
                          />
                          {lastNameError && <p className="text-xs text-destructive">{lastNameError}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('checkoutEmailAddress')}</Label>
                          <GmailInput
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name"
                            title={t('checkoutEmailTitle')}
                            aria-invalid={Boolean(emailError)}
                            required
                          />
                          {emailError && <p className="text-xs text-destructive">{emailError}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('checkoutPhoneNumber')}</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="05XXXXXXXX"
                              pattern="\d{10}"
                              title={t('checkoutPhoneTitle')}
                              className={`pl-9 ${phoneError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                              aria-invalid={Boolean(phoneError)}
                              required
                            />
                          </div>
                          {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
                        </div>
                      </div>

                      <div className="space-y-2 mb-8">
                        <Label htmlFor="requests">{t('checkoutSpecialRequests')}</Label>
                        <Textarea
                          id="requests"
                          name="requests"
                          placeholder={t('checkoutSpecialRequestsPlaceholder')}
                          value={formData.requests}
                          onChange={handleInputChange}
                          className="min-h-[100px]"
                        />
                      </div>

                      <Button
                        className="h-12 w-full text-base transition-colors duration-200 hover:bg-primary/80 sm:text-lg"
                        onClick={handleContinueToPayment}
                        data-testid="button-continue-2"
                      >
                        {t('checkoutContinuePayment')}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <Card className="border-border/50 shadow-sm" data-testid="checkout-step-3">
                    <CardContent className="p-5 sm:p-8">
                      <h2 className="mb-5 font-serif text-xl font-semibold sm:mb-6 sm:text-2xl">{t('checkoutPaymentMethod')}</h2>

                      <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between mb-8 border border-border/50">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <span className="font-medium">{t('checkoutCardType')}</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                          <div className="w-8 h-5 bg-slate-200 rounded"></div>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">{t('checkoutCardNumber')}</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            maxLength={19}
                            pattern="(?:\d{4}\s){3}\d{4}"
                            title={t('checkoutCardTitle')}
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={cardNumberError ? 'border-destructive focus-visible:ring-destructive' : ''}
                            aria-invalid={Boolean(cardNumberError)}
                          />
                          {cardNumberError && <p className="text-xs text-destructive">{cardNumberError}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">{t('checkoutExpiryDate')}</Label>
                            <Input
                              id="expiry"
                              name="expiry"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              maxLength={5}
                              pattern="(0[1-9]|1[0-2])\/\d{2}"
                              title={t('checkoutExpiryTitle')}
                              placeholder="MM/YY"
                              value={formData.expiry}
                              onChange={handleInputChange}
                              className={expiryError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              aria-invalid={Boolean(expiryError)}
                            />
                            {expiryError && <p className="text-xs text-destructive">{expiryError}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">{t('checkoutCvv')}</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              maxLength={3}
                              pattern="\d{3}"
                              title={t('checkoutCvvTitle')}
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              className={cvvError ? 'border-destructive focus-visible:ring-destructive' : ''}
                              aria-invalid={Boolean(cvvError)}
                            />
                            {cvvError && <p className="text-xs text-destructive">{cvvError}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">{t('checkoutNameOnCard')}</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            autoComplete="cc-name"
                            pattern="[A-Za-z][A-Za-z\s'-]{1,}"
                            title={t('checkoutNameTitle')}
                            placeholder={t('checkoutCardholderPlaceholder')}
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className={cardNameError ? 'border-destructive focus-visible:ring-destructive' : ''}
                            aria-invalid={Boolean(cardNameError)}
                          />
                          {cardNameError && <p className="text-xs text-destructive">{cardNameError}</p>}
                        </div>
                      </div>

                      <Button
                        className="h-12 w-full text-base transition-colors duration-200 hover:bg-primary/80 sm:text-lg"
                        onClick={handleConfirmBooking}
                        data-testid="button-confirm-booking"
                      >
                        {t('checkoutConfirmBooking')}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                        {t('checkoutTerms')}
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
              onBook={() => { }}
              isReadOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
