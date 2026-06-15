'use client';

import React, { useState } from 'react';

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackSrc = '/products/earbuds.png' 
}: { 
  src: string | undefined | null; 
  alt: string; 
  className?: string;
  fallbackSrc?: string;
}) {
  const [error, setError] = useState(false);

  // If no src is provided at all, treat it as an error immediately to show fallback
  const finalSrc = error || !src ? fallbackSrc : src;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
