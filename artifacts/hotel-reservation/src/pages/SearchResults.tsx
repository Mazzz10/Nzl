import React, { useState, useEffect } from 'react';
import { useAppState } from '../hooks/use-app-state';
import { SearchParams } from '../types';
import { sampleHotels } from '../data/hotels';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import SkeletonCard from '../components/SkeletonCard';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useLocale } from '../lib/i18n';

export default function SearchResults({ params, navigateTo }: { params: SearchParams; navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const { t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 1000]);

  const amenityLabels = [
    t('amenityPool'),
    t('amenitySpa'),
    t('amenityGym'),
    t('amenityFreeWifi'),
    t('amenityPetFriendly'),
    t('amenityRestaurant'),
  ];

  useEffect(() => {
    // Simulate network delay
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Navbar navigateTo={navigateTo} />

      {/* Top Bar */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto flex items-center justify-end px-4 py-3 sm:py-4">
          <div className="w-full sm:w-auto">
            <SearchBar
              initialParams={params}
              onSearch={(newParams) => navigateTo({ name: 'search_results', params: newParams })}
              variant="compact"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto flex-1 px-4 py-5 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

          {/* Mobile Filter Toggle */}
          <div className="mb-2 flex items-center justify-between lg:hidden">
            <h1 className="font-serif text-xl font-semibold sm:text-2xl">{t('resultsPropertiesFound', { count: sampleHotels.length })}</h1>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" /> {t('resultsFilters')}
            </Button>
          </div>

          <div className="mb-3 lg:hidden">
            <Select defaultValue="recommended">
              <SelectTrigger className="h-10 w-full" data-testid="select-sort-mobile">
                <SelectValue placeholder={t('resultsSortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">{t('resultsRecommended')}</SelectItem>
                <SelectItem value="price-low">{t('resultsPriceLow')}</SelectItem>
                <SelectItem value="price-high">{t('resultsPriceHigh')}</SelectItem>
                <SelectItem value="rating">{t('resultsGuestRating')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Left Sidebar Filters - 3 columns */}
          <div className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6 lg:sticky lg:top-40 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">{t('resultsFilters')}</h2>
                <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground px-2" data-testid="button-clear-filters">
                  {t('resultsClearAll')}
                </Button>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">{t('resultsPricePerNight')}</h3>
                <Slider
                  defaultValue={[50, 1000]}
                  max={2000}
                  step={50}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-4"
                  data-testid="slider-price"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}+</span>
                </div>
              </div>

              {/* Star Rating Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-medium mb-4">{t('resultsStarRating')}</h3>
                <div className="space-y-3">
                  {[5, 4, 3].map(star => (
                    <div key={star} className="flex items-center space-x-2">
                      <Checkbox id={`star-${star}`} data-testid={`checkbox-star-${star}`} />
                      <Label htmlFor={`star-${star}`} className="text-sm font-normal flex items-center cursor-pointer">
                        {star} {t('resultsStars')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <h3 className="text-sm font-medium mb-4">{t('resultsAmenities')}</h3>
                <div className="space-y-3">
                  {amenityLabels.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox id={`amenity-${amenity}`} data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(' ', '-')}`} />
                      <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Area - 9 columns */}
          <div className="lg:col-span-9 space-y-5 sm:space-y-6">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <h1 className="text-2xl font-serif font-semibold">{t('resultsPropertiesFound', { count: sampleHotels.length })}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('resultsSortBy')}</span>
                <Select defaultValue="recommended">
                  <SelectTrigger className="w-[180px] h-9" data-testid="select-sort">
                    <SelectValue placeholder={t('resultsSortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">{t('resultsRecommended')}</SelectItem>
                    <SelectItem value="price-low">{t('resultsPriceLow')}</SelectItem>
                    <SelectItem value="price-high">{t('resultsPriceHigh')}</SelectItem>
                    <SelectItem value="rating">{t('resultsGuestRating')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="space-y-6">
                {sampleHotels.map((hotel, i) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <HotelCard
                      hotel={hotel}
                      onClick={() => navigateTo({ name: 'hotel_details', hotelId: hotel.id, params })}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
