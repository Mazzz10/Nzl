import React, { useMemo, useState } from 'react';
import { useAppState } from '../hooks/use-app-state';
import { Building2, CircleUserRound, Coins, Languages, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppLanguage, useLocale } from '../lib/i18n';

const countryOptions = [
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CD', name: 'Congo, Dem Rep of', flag: '🇨🇩' },
  { code: 'CI', name: "Cote d'Ivoire", flag: '🇨🇮' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
];

const currencyOptions = [
  { code: 'SAR', name: 'Saudi Arabian Riyal' },
  { code: 'AED', name: 'Emirates Dirham' },
  { code: 'AOA', name: 'Angolan Kwanza' },
  { code: 'ARS', name: 'Argentine Peso' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'AZN', name: 'Azerbaijani Manat' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'BHD', name: 'Bahraini Dinar' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'BWP', name: 'Botswana Pula' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CDF', name: 'Congolese Franc' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CLP', name: 'Chilean Peso' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'COP', name: 'Colombian Peso' },
  { code: 'DZD', name: 'Algerian Dinar' },
  { code: 'EGP', name: 'Egyptian Pound' },
  { code: 'ETB', name: 'Ethiopian Birr' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'GHS', name: 'Ghana Cedi' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
];

const languageOptions = [
  { code: 'EN', name: 'English' },
  { code: 'AR', name: 'العربية' },
];

export default function Navbar({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const { language, setLanguage, t } = useLocale();
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('SA');
  const [countryQuery, setCountryQuery] = useState('');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [languageQuery, setLanguageQuery] = useState('');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('SAR');
  const [currencyQuery, setCurrencyQuery] = useState('');

  const selectedCountryOption = useMemo(
    () => countryOptions.find((country) => country.code === selectedCountry) ?? countryOptions[0],
    [selectedCountry],
  );

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    if (!query) return countryOptions;

    return countryOptions.filter((country) =>
      country.code.toLowerCase().includes(query) ||
      country.name.toLowerCase().includes(query),
    );
  }, [countryQuery]);

  const filteredLanguages = useMemo(() => {
    const query = languageQuery.trim().toLowerCase();
    if (!query) return languageOptions;

    return languageOptions.filter((language) =>
      language.code.toLowerCase().includes(query) ||
      language.name.toLowerCase().includes(query),
    );
  }, [languageQuery]);

  const filteredCurrencies = useMemo(() => {
    const query = currencyQuery.trim().toLowerCase();
    if (!query) return currencyOptions;

    return currencyOptions.filter((currency) =>
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query),
    );
  }, [currencyQuery]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigateTo({ name: 'home' })}
            data-testid="link-home-logo"
          >
            <Building2 className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
            <span className="font-serif text-xl font-semibold tracking-tight text-primary sm:text-2xl">Nzl</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="hidden md:flex items-center rounded-md border border-border/70 bg-muted/40 px-3 py-1.5 text-sm font-semibold text-foreground/90">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                data-testid="button-nav-country"
                onClick={() => setIsCountryOpen(true)}
              >
                <span role="img" aria-label={`${selectedCountryOption.name} flag`}>{selectedCountryOption.flag}</span>
                <span>{selectedCountryOption.code}</span>
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                data-testid="button-nav-language"
                onClick={() => setIsLanguageOpen(true)}
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{language}</span>
              </button>
              <span className="mx-3 text-border">|</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-primary/10 hover:text-primary transition-colors"
                data-testid="button-nav-currency"
                onClick={() => setIsCurrencyOpen(true)}
              >
                <Coins className="h-3.5 w-3.5" />
                <span>{selectedCurrency}</span>
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigateTo({ name: 'home' })}
              data-testid="button-nav-mobile-search"
              aria-label={t('searchAction')}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              onClick={() => navigateTo({ name: 'dashboard' })}
              data-testid="button-nav-mobile-dashboard"
              aria-label={t('navOpenProfile')}
            >
              <CircleUserRound className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              onClick={() => navigateTo({ name: 'dashboard' })}
              data-testid="button-nav-dashboard"
              aria-label={t('navOpenProfile')}
            >
              <CircleUserRound className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="hidden md:flex items-center gap-2 transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
              onClick={() => navigateTo({ name: 'sign_in' })}
              data-testid="button-nav-signin"
            >
              <CircleUserRound className="h-5 w-5" />
              <span>{t('navSignIn')}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  data-testid="button-nav-mobile-menu"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60" data-testid="menu-nav-mobile">
                <DropdownMenuItem onSelect={() => setIsCountryOpen(true)} data-testid="menu-item-mobile-country">
                  <span role="img" aria-label={`${selectedCountryOption.name} flag`}>{selectedCountryOption.flag}</span>
                  <span>{t('navCountryRegion')}</span>
                  <DropdownMenuShortcut>{selectedCountryOption.code}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setIsLanguageOpen(true)} data-testid="menu-item-mobile-language">
                  <Languages className="h-4 w-4" />
                  <span>{t('navLanguage')}</span>
                  <DropdownMenuShortcut>{language}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => setIsCurrencyOpen(true)} data-testid="menu-item-mobile-currency">
                  <Coins className="h-4 w-4" />
                  <span>{t('navCurrency')}</span>
                  <DropdownMenuShortcut>{selectedCurrency}</DropdownMenuShortcut>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => navigateTo({ name: 'sign_in' })}
                  data-testid="menu-item-mobile-signin"
                >
                  <CircleUserRound className="h-4 w-4" />
                  <span>{t('navSignIn')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <Dialog open={isCountryOpen} onOpenChange={setIsCountryOpen}>
        <DialogContent className="max-h-[90vh] max-w-[min(96vw,1180px)] gap-0 overflow-hidden rounded-[24px] border-border/70 p-0">
          <div className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <DialogTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{t('navCountryRegion')}</DialogTitle>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder={t('navSearch')}
                className="h-12 w-full rounded-xl border border-green-500/70 bg-background pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-green-500/40 sm:h-14 sm:pl-14 sm:pr-5 sm:text-xl md:text-2xl"
              />
            </div>
          </div>

          <div className="max-h-[62vh] overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-10 gap-y-1 py-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredCountries.map((country) => {
                  const isSelected = country.code === selectedCountry;

                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setSelectedCountry(country.code);
                        setIsCountryOpen(false);
                      }}
                      className="grid w-full grid-cols-[max-content,1fr,max-content] items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                    >
                      <span className="text-xl sm:text-2xl" aria-hidden>{country.flag}</span>
                      <span className="text-base leading-tight text-foreground/95 sm:text-xl md:text-2xl">{country.name}</span>
                      {isSelected ? <span className="ml-1 text-2xl font-bold leading-none text-green-600">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-8 text-lg text-muted-foreground">{t('navNoCountriesFound')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DialogContent className="max-h-[90vh] max-w-[min(96vw,1180px)] gap-0 overflow-hidden rounded-[24px] border-border/70 p-0">
          <div className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <DialogTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{t('navLanguage')}</DialogTitle>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={languageQuery}
                onChange={(e) => setLanguageQuery(e.target.value)}
                placeholder={t('navSearch')}
                className="h-12 w-full rounded-xl border border-blue-500/70 bg-background pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-blue-500/40 sm:h-14 sm:pl-14 sm:pr-5 sm:text-xl md:text-2xl"
              />
            </div>
          </div>

          <div className="max-h-[62vh] overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
            {filteredLanguages.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-10 gap-y-1 py-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredLanguages.map((langOption) => {
                  const isSelected = langOption.code === language;

                  return (
                    <button
                      key={langOption.code}
                      type="button"
                      onClick={() => {
                        setLanguage(langOption.code as AppLanguage);
                        setIsLanguageOpen(false);
                      }}
                      className="grid w-full grid-cols-[max-content,1fr,max-content] items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                    >
                      <span className="min-w-[3.2rem] text-base font-bold tracking-tight text-foreground sm:min-w-[3.5rem] sm:text-xl md:text-2xl">{langOption.code}</span>
                      <span className="text-base leading-tight text-foreground/95 sm:text-xl md:text-2xl">{langOption.name}</span>
                      {isSelected ? <span className="ml-1 text-2xl font-bold leading-none text-blue-600">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-8 text-lg text-muted-foreground">{t('navNoLanguagesFound')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
        <DialogContent className="max-h-[90vh] max-w-[min(96vw,1180px)] gap-0 overflow-hidden rounded-[24px] border-border/70 p-0">
          <div className="border-b border-border/70 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <DialogTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{t('navCurrency')}</DialogTitle>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={currencyQuery}
                onChange={(e) => setCurrencyQuery(e.target.value)}
                placeholder={t('navSearch')}
                className="h-12 w-full rounded-xl border border-blue-500/70 bg-background pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground/80 focus:ring-2 focus:ring-blue-500/40 sm:h-14 sm:pl-14 sm:pr-5 sm:text-xl md:text-2xl"
              />
            </div>
          </div>

          <div className="max-h-[62vh] overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
            {filteredCurrencies.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-10 gap-y-1 py-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredCurrencies.map((currency) => {
                  const isSelected = currency.code === selectedCurrency;

                  return (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => {
                        setSelectedCurrency(currency.code);
                        setIsCurrencyOpen(false);
                      }}
                      className="grid w-full grid-cols-[max-content,1fr,max-content] items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                    >
                      <span className="min-w-[3.2rem] text-base font-bold tracking-tight text-foreground sm:min-w-[3.5rem] sm:text-xl md:text-2xl">{currency.code}</span>
                      <span className="text-base leading-tight text-foreground/95 sm:text-xl md:text-2xl">{currency.name}</span>
                      {isSelected ? <span className="ml-1 text-2xl font-bold leading-none text-green-600">✓</span> : null}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="px-3 py-8 text-lg text-muted-foreground">{t('navNoCurrenciesFound')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
