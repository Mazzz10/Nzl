import React from 'react';
import { useAppState } from '../hooks/use-app-state';
import { Building2, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar({ navigateTo }: { navigateTo: ReturnType<typeof useAppState>['navigateTo'] }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigateTo({ name: 'home' })}
          data-testid="link-home-logo"
        >
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-semibold tracking-tight text-primary">Lumière Hotels</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => navigateTo({ name: 'search_results', params: { destination: '', checkIn: '', checkOut: '', guests: 2 } })}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-nav-destinations"
          >
            Destinations
          </button>
          <button 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-nav-offers"
          >
            Offers
          </button>
          <button 
            onClick={() => navigateTo({ name: 'dashboard' })}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-nav-dashboard"
          >
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2"
            onClick={() => navigateTo({ name: 'dashboard' })}
            data-testid="button-nav-signin"
          >
            <User className="h-4 w-4" />
            <span>Sign In</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
