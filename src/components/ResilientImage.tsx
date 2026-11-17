import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  aspectClassName?: string;
  priority?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  aspectClassName = '',
  priority = false
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#111827] text-[#B5BFCC] p-6 text-center border border-white/10 ${aspectClassName} ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="w-8 h-8 text-[#D9B777] mb-3 opacity-80" />
        <span className="font-serif-display text-sm text-[#F6F7FA] tracking-wide">
          {fallbackTitle || alt}
        </span>
        <span className="text-xs text-[#B5BFCC]/70 mt-1">
          Visuel Tomy Creator · 237 Cinématique
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
