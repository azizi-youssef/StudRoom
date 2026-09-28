import {
  DbProperty,
  DbRoom,
  DbAmenity,
  DbPropertyImage,
  DbUniversityProximity,
  DbUniversity,
  DbCity,
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
  is_verified?: boolean;
  landlord_verified?: boolean;
  photos_verified?: boolean;
  verified_at?: string;
  rating?: number;
  review_count?: number;
  reviews?: StudentReview[];
  availability_type?: 'AVAILABLE_NOW' | 'AVAILABLE_OCTOBER' | 'FULLY_BOOKED';
  available_from_date?: string;
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

export * from './database';
export * from './error';
