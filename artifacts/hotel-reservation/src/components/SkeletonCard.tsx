import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col md:flex-row bg-card rounded-2xl overflow-hidden border border-border shadow-sm p-0 h-full w-full">
      <Skeleton className="h-48 md:h-auto md:w-72 flex-shrink-0 rounded-none" />
      <div className="flex flex-col flex-grow p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="w-full">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-16" />
        </div>
        
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        <div className="mt-auto pt-6 flex items-end justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
