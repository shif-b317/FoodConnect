import React from 'react';

export const Skeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div 
      className={`bg-[#EDE4D7] animate-pulse rounded-fc-md ${height} ${width} ${className}`}
      aria-busy="true"
      aria-label="Loading content"
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-5 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton height="h-12" width="w-12" className="rounded-fc-md" />
        <div className="space-y-2 flex-1">
          <Skeleton height="h-4" width="w-3/4" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
      </div>
      <Skeleton height="h-16" width="w-full" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton height="h-6" width="w-24" className="rounded-full" />
        <Skeleton height="h-8" width="w-28" />
      </div>
    </div>
  );
};

export default Skeleton;
