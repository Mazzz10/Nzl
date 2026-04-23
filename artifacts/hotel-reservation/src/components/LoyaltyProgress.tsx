import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Star, Award, Diamond } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLocale } from '../lib/i18n';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function LoyaltyProgress() {
  const { t, isRtl } = useLocale();
  const currentBookings = 3;
  const targetBookings = 6; // for Gold
  const progress = (currentBookings / targetBookings) * 100;

  const tiers = [
    { name: t('loyaltyBronze'), icon: Star, color: 'text-amber-700', active: true },
    { name: t('loyaltySilver'), icon: Award, color: 'text-slate-400', active: true },
    { name: t('loyaltyGold'), icon: Crown, color: 'text-yellow-500', active: false },
    { name: t('loyaltyPlatinum'), icon: Diamond, color: 'text-sky-300', active: false },
  ];

  return (
    <Card className="overflow-hidden border-primary/10 shadow-md bg-gradient-to-br from-card to-muted/30" data-testid="card-loyalty">
      <CardContent className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-6 w-6 text-slate-400" />
              <h3 className="font-serif text-xl font-semibold sm:text-2xl">{t('loyaltySilverMember')}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{t('loyaltyAwayFromGold', { count: targetBookings - currentBookings })}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="font-serif text-2xl font-bold text-primary sm:text-3xl">850</div>
            <div className="flex items-center justify-start gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:justify-end">
              <span>{t('dashboardPoints')}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={t('dashboardPointsInfoLabel')}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-sm ring-1 ring-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    i
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-center text-xs leading-relaxed">
                  {t('dashboardPointsFormula')}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="relative mb-8 pt-4 sm:mb-10">
          <Progress value={progress} dir={isRtl ? 'rtl' : 'ltr'} className="h-2 bg-muted" />

          <div dir={isRtl ? 'rtl' : 'ltr'} className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2 mt-5">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full border-2 bg-card ${tier.active ? `border-primary ${tier.color}` : 'border-muted text-muted-foreground'} relative z-10 flex items-center justify-center sm:h-8 sm:w-8`}>
                    <Icon className="h-4 w-4" />
                    {tier.name === t('loyaltySilver') && (
                      <span className="absolute -inset-1 rounded-full animate-ping bg-primary/20" />
                    )}
                  </div>
                  <span className={`mt-2 text-[10px] font-medium sm:text-xs ${tier.active ? 'text-foreground' : 'text-muted-foreground'}`}>
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
            {t('loyaltyGoldPerks')}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-2">• {t('loyaltyPerk1')}</li>
            <li className="flex items-center gap-2">• {t('loyaltyPerk2')}</li>
            <li className="flex items-center gap-2">• {t('loyaltyPerk3')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
