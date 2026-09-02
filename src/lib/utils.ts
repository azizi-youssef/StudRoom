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
