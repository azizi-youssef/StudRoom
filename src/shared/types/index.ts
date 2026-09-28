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

export type AvailabilityType = 'all' | 'now' | 'october' | 'occupied';

export interface StudentReview {
  id: string;
  student_name: string;
  university_short: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface PropertyDetail extends DbProperty {
  city: DbCity;
  rooms: DbRoom[];
  amenities: DbAmenity[];
  images: DbPropertyImage[];
  proximities: UniversityProximityItem[];
  primary_image: string;
  // Trust & Verification (Priorité 3)
  is_verified?: boolean;
  landlord_verified?: boolean;
  photos_verified?: boolean;
  verified_at?: string;
  rating?: number;
  review_count?: number;
  reviews?: StudentReview[];
  // Availability status (Priorité 4)
  availability_type?: 'AVAILABLE_NOW' | 'AVAILABLE_OCTOBER' | 'FULLY_BOOKED';
  available_from_date?: string; // ex: "1er Octobre 2026"
  // Landlord profile
  landlord_name?: string;
  landlord_phone?: string;
  landlord_response_time?: string;
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
  availability: AvailabilityType;
  onlyVerified: boolean;
  moveInDate?: string;
  sortBy: 'featured' | 'price_asc' | 'price_desc' | 'proximity' | 'rating';
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
