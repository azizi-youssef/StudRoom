'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { DbPropertyImage } from '@/shared/types/database';
import { Dialog } from '@/components/ui/dialog';

interface PropertyGalleryProps {
  images: DbPropertyImage[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const mainImage = images[selectedImageIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      
      {/* Main Large Image */}
      <div
        className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-card border border-slate-200/80 cursor-pointer group bg-slate-100"
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
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-slate-900 shadow-md flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-brand-600" />
            Agrandir la photo
          </div>
        </div>
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all ${
                selectedImageIndex === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || title}
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth="2xl"
      >
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden">
            <Image
              src={mainImage.image_url}
              alt={mainImage.alt_text || title}
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center text-sm font-semibold text-slate-700">
            {mainImage.alt_text || title} ({selectedImageIndex + 1} / {images.length})
          </p>
        </div>
      </Dialog>

    </div>
  );
}
