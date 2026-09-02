import { 
  DbProperty, 
  DbRoom, 
  DbAmenity, 
  DbPropertyImage, 
  DbUniversityProximity,
  DbUniversity,
  DbCity
} from './database';

export interface AmenityItem extends DbAmenity {}

export interface UniversityProximityItem extends DbUniversityProximity {
  university: DbUniversity;
}

export interface RoomDetail extends DbRoom {
  property?: PropertyDetail;
  city?: DbCity;
  amenities?: DbAmenity[];
}

export interface PropertyDetail extends DbProperty {
  city: DbCity;
  rooms: DbRoom[];
  amenities: DbAmenity[];
  images: DbPropertyImage[];
  proximities: UniversityProximityItem[];
  primary_image: string;
}

export interface PropertyFilterState {
  searchQuery: string;
  citySlug: string;
  neighborhood: string;
  universityId: string;
  maxPrice: number;
  minPrice: number;
  propertyType: string;
  roomType: string;
  roomCount: string;
  amenities: string[];
  moveInDate?: string;
  sortBy: 'price_asc' | 'price_desc' | 'proximity' | 'featured';
  page?: number;
  limit?: number;
}

export interface CityOption {
  id: string;
  name: string;
  slug: string;
  availableCount: number;
}

export interface UniversityOption {
  id: string;
  name: string;
  shortName: string;
  cityName: string;
}

export * from './database';
export * from './error';
