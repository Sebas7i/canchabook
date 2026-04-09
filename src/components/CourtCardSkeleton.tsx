import React from 'react';

const CourtCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-card overflow-hidden border border-gray-50 dark:border-zinc-800 shadow-premium">
      <div className="relative h-64 bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
      <div className="p-8 space-y-5">
        <div className="flex justify-between items-start">
          <div className="h-6 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-inner animate-pulse"></div>
          <div className="h-8 w-1/4 bg-gray-200 dark:bg-zinc-800 rounded-inner animate-pulse"></div>
        </div>
        <div className="h-10 w-full bg-gray-100 dark:bg-zinc-800/50 rounded-inner animate-pulse"></div>
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 dark:bg-zinc-800 animate-pulse"></div>
            ))}
          </div>
          <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CourtCardSkeleton;
