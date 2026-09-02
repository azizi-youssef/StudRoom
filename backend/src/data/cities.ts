import { DbCity } from '../shared/types/database';

export const CITIES_DATA: DbCity[] = [
  {
    id: 'city-selouane',
    name: 'Selouane',
    slug: 'selouane',
    region: 'Nador / Oriental',
    is_active: true,
  },
  {
    id: 'city-nador',
    name: 'Nador Ville',
    slug: 'nador',
    region: 'Oriental',
    is_active: true,
  },
  {
    id: 'city-oujda',
    name: 'Oujda',
    slug: 'oujda',
    region: 'Oriental',
    is_active: false,
  },
  {
    id: 'city-tanger',
    name: 'Tanger',
    slug: 'tanger',
    region: 'Tanger-Tétouan-Al Hoceïma',
    is_active: false,
  },
];
