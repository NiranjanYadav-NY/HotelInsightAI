import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const clamped = Math.max(0, Math.min(maxRating, rating));

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, idx) => {
          const starValue = idx + 1;
          const isFilled = clamped >= starValue;
          const isHalf = !isFilled && clamped > idx;

          return (
            <div key={idx} className="relative">
              <Star
                className={`${iconSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-200 text-amber-400'
                    : 'text-slate-200 fill-slate-100'
                } transition-colors`}
              />
            </div>
          );
        })}
      </div>
      {showNumber && (
        <span className="font-mono font-bold text-slate-800 text-sm ml-1">
          {rating.toFixed(1)} <span className="text-slate-400 font-normal text-xs">/ {maxRating}.0</span>
        </span>
      )}
    </div>
  );
};
