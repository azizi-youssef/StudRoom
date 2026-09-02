import { DbAmenity } from '@/shared/types/database';

export const AMENITIES_DATA: DbAmenity[] = [
  { id: 'amenity-wifi', name: 'Wi-Fi Fibre 100 Mbps', icon_name: 'Wifi', category: 'essential' },
  { id: 'amenity-desk', name: 'Bureau de travail individuel', icon_name: 'Laptop', category: 'essential' },
  { id: 'amenity-bed', name: 'Lit meublé avec matelas orthopédique', icon_name: 'Bed', category: 'essential' },
  { id: 'amenity-wardrobe', name: 'Armoire de rangement', icon_name: 'Folder', category: 'essential' },
  { id: 'amenity-kitchen', name: 'Cuisine équipée (Plaque, Frigo, Micro-ondes)', icon_name: 'Utensils', category: 'comfort' },
  { id: 'amenity-washing', name: 'Machine à laver automatique', icon_name: 'Shirt', category: 'comfort' },
  { id: 'amenity-ac', name: 'Climatisation / Chauffage', icon_name: 'Wind', category: 'comfort' },
  { id: 'amenity-water-heater', name: 'Chauffe-eau solaire / électrique', icon_name: 'Flame', category: 'essential' },
  { id: 'amenity-balcony', name: 'Balcon privatifs', icon_name: 'Sun', category: 'comfort' },
  { id: 'amenity-security', name: 'Accès sécurisé & Gardiennage', icon_name: 'ShieldCheck', category: 'security' },
  { id: 'amenity-cleaning', name: 'Ménage des parties communes', icon_name: 'Sparkles', category: 'services' },
  { id: 'amenity-parking', name: 'Parking gratuit sécurisé', icon_name: 'Car', category: 'services' },
];
