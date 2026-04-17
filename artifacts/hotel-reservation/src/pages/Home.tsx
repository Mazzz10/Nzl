import React from 'react';
import { useAppState } from '../hooks/use-app-state';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { trendingDestinations } from '../data/hotels';
import { motion } from 'framer-motion';

export default function Home({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar navigateTo={navigateTo} />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 px-4 overflow-hidden flex-1 flex flex-col justify-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-amber-900/40" />
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1542314831-c6a4d14241cc?q=80&w=2000&auto=format&fit=crop')] opacity-20 mix-blend-overlay bg-cover bg-center" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white font-medium mb-6 leading-tight">
              Extraordinary stays,<br />curated for you.
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light max-w-2xl mx-auto">
              Discover the world's most exceptional hotels and resorts. Your journey begins with Lumière.
            </p>
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

      {/* Trending Destinations */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Trending Destinations</h2>
              <p className="text-muted-foreground">Most popular choices for travelers from your region</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingDestinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-[3/4]"
                onClick={() => navigateTo({ name: 'search_results', params: { destination: dest.name, checkIn: '', checkOut: '', guests: 2 } })}
                data-testid={`card-destination-${dest.id}`}
              >
                <div className={`absolute inset-0 ${dest.image} transition-transform duration-700 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-medium text-lg">{dest.name}</h3>
                  <p className="text-white/70 text-sm">{dest.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
