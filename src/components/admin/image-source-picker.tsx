'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Check,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Catalogue des images locales déjà disponibles dans le projet StudRoom (/public/images/)
export const LOCAL_STUDROOM_IMAGES = [
  {
    name: 'Résidence Al Omrane',
    url: '/images/studroom_al_omrane.jpg',
    category: 'Façade & Extérieur',
  },
  {
    name: 'Résidence Facultaire',
    url: '/images/studroom_facultaire.jpg',
    category: 'Façade & Extérieur',
  },
  {
    name: 'Campus StudRoom Selouane',
    url: '/images/studroom_hero.jpg',
    category: 'Campus & Accueil',
  },
  {
    name: 'Intérieur Aménagé',
    url: '/images/studroom_ui_showcase.jpg',
    category: 'Salon & Déco',
  },
  {
    name: 'Chambre Étudiant Moderne',
    url: '/images/h.jpeg',
    category: 'Chambre',
  },
  {
    name: 'Chambre avec Bureau Études',
    url: '/images/h2.jpeg',
    category: 'Chambre',
  },
  {
    name: 'Studio Meublé Lumineux',
    url: '/images/h3.jpeg',
    category: 'Studio',
  },
  {
    name: 'Espace Commun & Salon',
    url: '/images/hero.jpeg',
    category: 'Salon',
  },
];

interface ImageSourcePickerProps {
  onImageSelected: (url: string, suggestedName?: string) => void;
  className?: string;
}

export function ImageSourcePicker({ onImageSelected, className = '' }: ImageSourcePickerProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'local_library' | 'url'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Gestion de l'upload local depuis le PC
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPreviewUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const confirmUploadedFile = () => {
    if (previewUrl) {
      onImageSelected(previewUrl, fileName || 'Photo locale importée');
      setPreviewUrl(null);
      setFileName(null);
    }
  };

  // 2. Sélection d'une image de la bibliothèque locale
  const handleSelectLocalImage = (item: { name: string; url: string }) => {
    onImageSelected(item.url, item.name);
  };

  // 3. Soumission d'une URL Web
  const handleConfirmUrl = () => {
    if (manualUrl.trim()) {
      onImageSelected(manualUrl.trim());
      setManualUrl('');
    }
  };

  return (
    <div className={`bg-slate-950/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-3 ${className}`}>
      {/* Onglets de sélection de source */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Importer depuis PC
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('local_library')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'local_library'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Bibliothèque StudRoom
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          URL Web
        </button>
      </div>

      {/* CONTENU ONGLET 1 : IMPORT DEPUIS LE PC */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {!previewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                dragOver
                  ? 'border-primary-400 bg-primary-950/30'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-primary-950/80 border border-primary-800/80 flex items-center justify-center text-primary-400 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Cliquez pour parcourir ou glissez-déposez une image
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prend en charge JPG, PNG, WebP (Photos de vos dossiers locaux, bureau, etc.)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                <img src={previewUrl} alt="Aperçu import" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold text-white truncate">{fileName || 'Fichier image'}</p>
                <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Image locale chargée avec succès
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  onClick={confirmUploadedFile}
                  className="bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Insérer cette photo
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setFileName(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Annuler"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENU ONGLET 2 : BIBLIOTHÈQUE LOCALE DU PROJET */}
      {activeTab === 'local_library' && (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] text-slate-400">
            Sélectionnez une photo locale existante du projet (<code className="text-primary-400 font-mono">/public/images/</code>) :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {LOCAL_STUDROOM_IMAGES.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectLocalImage(item)}
                className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-primary-500 bg-slate-900 cursor-pointer transition shadow-md flex flex-col"
              >
                <div className="w-full aspect-[4/3] bg-slate-950 relative overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-primary-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold bg-primary-600 px-2 py-0.5 rounded-lg shadow">
                      + Choisir
                    </span>
                  </div>
                </div>
                <div className="p-1.5 bg-slate-950/80 border-t border-slate-800/80">
                  <p className="text-[10px] font-bold text-white truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate font-mono">{item.url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 3 : URL WEB / CLOUD */}
      {activeTab === 'url' && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              placeholder="Collez une URL d'image (ex: https://images.unsplash.com/...)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
            <Button
              type="button"
              onClick={handleConfirmUrl}
              size="sm"
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl"
            >
              Ajouter par URL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
