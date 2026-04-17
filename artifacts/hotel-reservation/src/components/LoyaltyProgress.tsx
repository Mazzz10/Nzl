import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Award, Diamond } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function LoyaltyProgress() {
  const currentBookings = 3;
  const targetBookings = 6; // for Gold
  const progress = (currentBookings / targetBookings) * 100;

  const tiers = [
    { name: 'Bronze', icon: Star, color: 'text-amber-700', active: true },
    { name: 'Silver', icon: Award, color: 'text-slate-400', active: true },
    { name: 'Gold', icon: Crown, color: 'text-yellow-500', active: false },
    { name: 'Platinum', icon: Diamond, color: 'text-sky-300', active: false },
  ];

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md bg-gradient-to-br from-card to-muted/30" data-testid="card-loyalty">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-6 w-6 text-slate-400" />
              <h3 className="font-serif text-2xl font-semibold">Silver Member</h3>
            </div>
            <p className="text-sm text-muted-foreground">You're {targetBookings - currentBookings} bookings away from Gold status.</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-serif font-bold text-primary">850</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Points</div>
          </div>
        </div>

        <div className="relative mb-10 pt-4">
          <Progress value={progress} className="h-2 bg-muted" />
          
          <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2 mt-5">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-card border-2 ${tier.active ? `border-primary ${tier.color}` : 'border-muted text-muted-foreground'} z-10 relative`}>
                    <Icon className="h-4 w-4" />
                    {tier.name === 'Silver' && (
                      <span className="absolute -inset-1 rounded-full animate-ping bg-primary/20" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${tier.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {tier.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 border border-border/50">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Crown className="h-4 w-4 text-yellow-500" /> 
            Gold Tier Perks
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">• Late checkout up to 4 PM</li>
            <li className="flex items-center gap-2">• Complimentary room upgrades</li>
            <li className="flex items-center gap-2">• 25% bonus points on all stays</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
