import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  readOnly = true,
  onChange = () => {},
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const currentDisplay = hoverRating || rating;

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentDisplay;

        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'} focus:outline-none`}
          >
            <Star
              className={`${sizeClasses[size] || sizeClasses.md} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;

