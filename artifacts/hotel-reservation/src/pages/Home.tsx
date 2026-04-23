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
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 px-4 overflow-hidden flex-1 flex flex-col justify-center bg-slate-900">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/78 via-black/62 to-black/72" />

        <div className="container mx-auto max-w-6xl relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium mb-6 leading-tight">
              {t('homeHeroTitle')}
            </h1>
            <div className="mx-auto max-w-2xl rounded-xl bg-black/35 px-5 py-3 backdrop-blur-[2px]">
              <p className="text-lg md:text-xl text-white/95 font-light">
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
