import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyDH(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount) + " DH";
}

export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

export function getPropertyTypeLabel(type: string): string {
  switch (type) {
    case 'apartment_shared':
      return 'Appartement partagé';
    case 'studio_private':
      return 'Studio individuel';
    case 'room_private':
      return 'Chambre privée';
    case 'residence_suite':
      return 'Suite résidence';
    default:
      return 'Logement étudiant';
  }
}

/**
 * Nettoie et sécurise l'URL d'une image pour next/image.
 * Protège contre les chemins locaux Windows (ex: C:/Users/...), les chaînes vides,
 * et extrait le chemin relatif /images/... si disponible.
 */
export function sanitizeImageUrl(url?: string | null, fallback = '/images/studroom_hero.jpg'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Si un chemin absolu Windows / Linux contenant public/images a été injecté
  const match = trimmed.match(/[/\\]public([/\\]images[/\\].*)$/i);
  if (match && match[1]) {
    return match[1].replace(/\\/g, '/');
  }

  // Si c'est un chemin de dossier Windows sans nom de fichier (ex: C:/.../public/images) ou file://
  if (trimmed.match(/^[a-zA-Z]:[/\\]/i) || trimmed.startsWith('file:')) {
    return fallback;
  }

  // Si c'est déjà un chemin web relatif valide ou une URL http/https
  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Chemin relatif simple
  if (trimmed.startsWith('images/')) {
    return '/' + trimmed;
  }

  return fallback;
}

