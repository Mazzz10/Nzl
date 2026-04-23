import React from 'react';
import { useAppState } from '../hooks/use-app-state';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { motion } from 'framer-motion';
import { useLocale } from '../lib/i18n';

export default function Home({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar navigateTo={navigateTo} />

      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col justify-center overflow-hidden bg-slate-900 px-4 pb-20 pt-20 sm:pb-28 sm:pt-24 md:pb-40 md:pt-32">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/78 via-black/62 to-black/72" />

        <div className="container mx-auto max-w-6xl relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-8 max-w-3xl text-center sm:mb-10 md:mb-12"
          >
            <h1 className="mb-4 font-serif text-3xl font-medium leading-tight text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
              {t('homeHeroTitle')}
            </h1>
            <div className="mx-auto max-w-2xl rounded-xl bg-black/35 px-4 py-3 backdrop-blur-[2px] sm:px-5">
              <p className="text-base font-light text-white/95 sm:text-lg md:text-xl">
                {t('homeHeroSubtitle')}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <SearchBar
              onSearch={(params) => navigateTo({ name: 'search_results', params })}
              variant="hero"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
