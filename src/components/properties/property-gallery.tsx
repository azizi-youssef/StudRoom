'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Maximize2, ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';
import { DbPropertyImage } from '@/shared/types/database';

interface PropertyGalleryProps {
  images: DbPropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images && images.length > 0 ? images : [
    { id: 'default', property_id: '', image_url: '/images/studroom_hero.jpg', alt_text: title, is_primary: true, display_order: 0 }
  ];

  const mainImage = safeImages[selectedImageIndex] || safeImages[0];

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
  }, [safeImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
  }, [safeImages.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  return (
    <div className="flex flex-col gap-4">
      
      {/* Main Large Showcase Image */}
      <div
        className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-card border border-slate-200/80 cursor-pointer group bg-slate-900"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={mainImage.image_url}
          alt={mainImage.alt_text || title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 70vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover Center Indicator */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 shadow-xl flex items-center gap-2 transform -translate-y-1 group-hover:translate-y-0 transition-all">
            <Maximize2 className="w-4 h-4 text-primary-600" />
            Ouvrir la galerie plein écran
          </div>
        </div>

        {/* Image navigation arrows on main card (desktop hover) */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Photo précédente"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Photo suivante"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Floating Photo Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/10 shadow-lg">
          <Camera className="w-3.5 h-3.5 text-primary-400" />
          <span>
            {selectedImageIndex + 1} / {safeImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnails row */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all group/thumb ${
                selectedImageIndex === idx
                  ? 'border-primary-600 ring-2 ring-primary-500/30 scale-[1.02]'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || title}
                fill
                sizes="150px"
                className="object-cover group-hover/thumb:scale-105 transition-transform"
              />
            </button>
          ))}
        </div>
      )}

      {/* Custom Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm tracking-tight truncate max-w-xs sm:max-w-md">
                {title}
              </span>
              <span className="text-xs text-slate-400 px-2.5 py-1 bg-slate-800 rounded-lg">
                {selectedImageIndex + 1} sur {safeImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center transition-all"
              aria-label="Fermer la galerie"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Main View with Previous / Next navigation */}
          <div
            className="relative w-full max-w-5xl h-[65vh] sm:h-[72vh] my-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={mainImage.image_url}
                alt={mainImage.alt_text || title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain"
                priority
              />
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/90 hover:bg-primary-600 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 z-20"
                  aria-label="Précédent"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-800/90 hover:bg-primary-600 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 z-20"
                  aria-label="Suivant"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Filmstrip */}
          {safeImages.length > 1 && (
            <div
              className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2 scrollbar-none z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-primary-500 scale-105 shadow-md'
                      : 'border-transparent opacity-50 hover:opacity-90'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
