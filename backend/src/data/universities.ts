import { DbUniversity } from '../shared/types/database';

export const UNIVERSITIES_DATA: DbUniversity[] = [
  {
    id: 'uni-fsp-selouane',
    city_id: 'city-selouane',
    name: 'Faculté Pluridisciplinaire de Nador (FSP Selouane)',
    short_name: 'FSP Selouane',
    address: 'Route Nationale 19, Selouane, Nador',
    location_lat: 35.0741,
    location_lng: -2.9125,
  },
  {
    id: 'uni-est-nador',
    city_id: 'city-selouane',
    name: 'École Supérieure de Technologie de Nador (EST Nador)',
    short_name: 'EST Nador',
    address: 'Quartier Universitaire, Selouane',
    location_lat: 35.0758,
    location_lng: -2.9110,
  },
  {
    id: 'uni-ista-selouane',
    city_id: 'city-selouane',
    name: 'Institut Spécialisé de Technologie Appliquée (ISTA Selouane)',
    short_name: 'ISTA Selouane',
    address: 'Al Omrane, Selouane',
    location_lat: 35.0780,
    location_lng: -2.9050,
  },
];
