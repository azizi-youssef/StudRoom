'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fallbackClassName?: string;
  fallbackBgClass?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export function Avatar({ src, alt, fallback, className, size = 'md', fallbackClassName, fallbackBgClass }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Déterminer le texte de fallback : initiale du nom/email
  const getFallbackText = () => {
    if (fallback) return fallback;
    if (alt) return alt.charAt(0).toUpperCase();
    return 'U';
  };

  // Déterminer si on doit afficher l'image
  const shouldShowImage = src && !imageError && src.trim() !== '';

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const defaultBgClass = fallbackBgClass || 'bg-primary-600';

  return (
    <div className={cn('relative rounded-full overflow-hidden flex items-center justify-center font-bold shadow-xs', sizeClasses[size], className)}>
      {shouldShowImage ? (
        <>
          {isLoading && (
            <div className={cn('absolute inset-0 flex items-center justify-center', defaultBgClass, fallbackClassName, 'text-white')}>
              <span className="animate-pulse">{getFallbackText()}</span>
            </div>
          )}
          <img
            src={src}
            alt={alt || 'Photo de profil'}
            referrerPolicy="no-referrer"
            className={cn('w-full h-full object-cover transition-opacity duration-200', isLoading ? 'opacity-0' : 'opacity-100')}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      ) : (
        <div className={cn('w-full h-full flex items-center justify-center', defaultBgClass, fallbackClassName, 'text-white')}>
          <span>{getFallbackText()}</span>
        </div>
      )}
    </div>
  );
}

// Sous-composants pour flexibilité
export function AvatarImage({ src, alt, className, onError, onLoad }: { src?: string | null; alt?: string; className?: string; onError?: () => void; onLoad?: () => void }) {
  return (
    <img
      src={src || undefined}
      alt={alt || 'Photo de profil'}
      referrerPolicy="no-referrer"
      className={cn('w-full h-full object-cover', className)}
      onError={onError}
      onLoad={onLoad}
    />
  );
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('w-full h-full flex items-center justify-center bg-primary-600 text-white font-bold', className)}>
      {children}
    </div>
  );
}
