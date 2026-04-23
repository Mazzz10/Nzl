import React from 'react';
import { useAppState, AppView } from './hooks/use-app-state';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn.tsx';
import SignUp from './pages/SignUp.tsx';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LocaleProvider } from './lib/i18n';

function App() {
  const { view, navigateTo } = useAppState();

  return (
    <LocaleProvider>
      <TooltipProvider>
        <div className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground">
          <AnimatePresence mode="wait">
            <motion.div
              key={view.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {view.name === 'home' && <Home navigateTo={navigateTo} />}
              {view.name === 'search_results' && <SearchResults params={view.params} navigateTo={navigateTo} />}
              {view.name === 'hotel_details' && <HotelDetails hotelId={view.hotelId} params={view.params} navigateTo={navigateTo} />}
              {view.name === 'checkout' && <Checkout hotelId={view.hotelId} roomId={view.roomId} params={view.params} selectedAddOns={view.selectedAddOns} navigateTo={navigateTo} />}
              {view.name === 'sign_in' && <SignIn navigateTo={navigateTo} />}
              {view.name === 'sign_up' && <SignUp navigateTo={navigateTo} />}
              {view.name === 'dashboard' && <Dashboard navigateTo={navigateTo} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <Toaster />
      </TooltipProvider>
    </LocaleProvider>
  );
}

export default App;
