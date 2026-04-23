import { useState } from 'react';
import { SearchParams } from '../types';

export type AppView =
  | { name: 'home' }
  | { name: 'search_results'; params: SearchParams }
  | { name: 'hotel_details'; hotelId: string; params: SearchParams }
  | { name: 'checkout'; hotelId: string; roomId: string; params: SearchParams; selectedAddOns: string[] }
  | { name: 'sign_in' }
  | { name: 'sign_up' }
  | { name: 'dashboard' };

export function useAppState() {
  const [view, setView] = useState<AppView>({ name: 'home' });

  const navigateTo = (newView: AppView) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView(newView);
  };

  return { view, navigateTo };
}
