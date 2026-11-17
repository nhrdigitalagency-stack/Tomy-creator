import React, { useState } from 'react';
import { Film } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  pictureClassName?: string;
  fallbackTitle?: string;
  aspectClassName?: string;
  priority?: boolean;
  sizes?: string;
}

interface ResponsiveVariantSpec {
  slug: string;
  widths: number[];
}

const LOCAL_RESPONSIVE_MAP: Record<string, ResponsiveVariantSpec> = {
  '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg': {
    slug: 'img-8871',
    widths: [480, 960, 1280]
  },
  '/assets/aistudio/IMG_8868.JPG_42386957.jpeg': {
    slug: 'img-8868',
    widths: [480, 960, 1600]
  },
  '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg': {
    slug: 'img-0964',
    widths: [480, 960, 1600]
  },
  '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg': {
    slug: 'img-8869',
    widths: [480, 960, 1066]
  },
  '/assets/aistudio/WhatsApp_Image_2026-11-16_at_10.25.07_b5ed22ad.jpeg': {
    slug: 'logo-tc',
    widths: [320, 640, 800]
  }
};

function buildSanitySrcSet(url: string, format?: 'webp'): string {
  const widths = [480, 960, 1600];
  const sep = url.includes('?') ? '&' : '?';
  return widths
    .map((w) => {
      const fmParam = format ? `&fm=${format}&q=82` : '&auto=format&q=84';
      return `${url}${sep}w=${w}&fit=max${fmParam} ${w}w`;
    })
    .join(', ');
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  pictureClassName = 'block w-full h-full',
  fallbackTitle,
  aspectClassName = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
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

  const localSpec = LOCAL_RESPONSIVE_MAP[src];
  const isSanityCdn = src.includes('cdn.sanity.io/images/');

  const webpSrcSet = localSpec
    ? localSpec.widths
        .map((w) => `/assets/responsive/${localSpec.slug}-${w}w.webp ${w}w`)
        .join(', ')
    : isSanityCdn
      ? buildSanitySrcSet(src, 'webp')
      : null;

  const fallbackSrcSet = localSpec
    ? localSpec.widths
        .map((w) => `/assets/responsive/${localSpec.slug}-${w}w.jpg ${w}w`)
        .join(', ')
    : isSanityCdn
      ? buildSanitySrcSet(src)
      : null;

  const fallbackImgSrc = localSpec
    ? `/assets/responsive/${localSpec.slug}-${localSpec.widths[Math.min(1, localSpec.widths.length - 1)]}w.jpg`
    : src;

  return (
    <picture className={pictureClassName}>
      {webpSrcSet && (
        <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      )}
      {fallbackSrcSet && (
        <source type="image/jpeg" srcSet={fallbackSrcSet} sizes={sizes} />
      )}
      <img
        src={fallbackImgSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setHasError(true)}
        className={className}
      />
    </picture>
  );
};
