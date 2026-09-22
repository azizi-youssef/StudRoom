export type UserRole = 'student' | 'landlord' | 'admin';

export type PropertyStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'AVAILABLE' 
  | 'PARTIALLY_OCCUPIED' 
  | 'FULLY_OCCUPIED' 
  | 'UNAVAILABLE';

export type RoomStatus = 
  | 'AVAILABLE' 
  | 'RESERVED' 
  | 'OCCUPIED' 
  | 'MAINTENANCE' 
  | 'UNAVAILABLE';

export type RoomType = 
  | 'PRIVATE' 
  | 'SHARED' 
  | 'MASTER' 
  | 'STUDIO';

export type BookingStatus = 
  | 'PENDING' 
  | 'CONTACTED' 
  | 'VISIT_SCHEDULED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';

export interface DbUser {
  id: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  full_name: string;
  phone: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface DbStudent {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  university_id: string;
  study_level: string;
  field_of_study?: string;
  preferred_move_in_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DbLandlord {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  company_name?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbCity {
  id: string;
  name: string;
  slug: string;
  region: string;
  country?: string;
  is_active: boolean;
}

export interface DbUniversity {
  id: string;
  city_id: string;
  name: string;
  slug?: string;
  short_name: string;
  address: string;
  location_lat: number;
  location_lng: number;
  website?: string;
}

export type PropertyType = 'apartment' | 'house' | 'residence' | 'studio' | 'building';

export interface DbProperty {
  id: string;
  landlord_id?: string;
  city_id: string;
  title: string;
  slug: string;
  description: string;
  address: string;
  neighborhood: string;
  property_type: PropertyType;
  min_price_dh: number;
  max_price_dh: number;
  total_rooms: number;
  available_rooms: number;
  surface_sqm: number;
  status: PropertyStatus;
  featured: boolean;
  is_available: boolean;
  location_lat: number;
  location_lng: number;
  created_at: string;
  updated_at: string;
}

export interface DbRoom {
  id: string;
  property_id: string;
  name: string;
  slug: string;
  description?: string;
  room_type: RoomType;
  price_monthly: number;
  deposit_dh: number;
  surface_sqm: number;
  furnished: boolean;
  floor?: number;
  available_from: string;
  status: RoomStatus;
  images?: string[];
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface DbAmenity {
  id: string;
  code?: string;
  name: string;
  icon_name: string;
  category: 'essential' | 'comfort' | 'security' | 'services';
}

export interface DbPropertyAmenity {
  property_id: string;
  amenity_id: string;
}

export interface DbRoomAmenity {
  room_id: string;
  amenity_id: string;
}

export interface DbPropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
  created_at?: string;
}

export interface DbUniversityProximity {
  id: string;
  property_id: string;
  university_id: string;
  distance_km: number;
  walking_time_min: number;
  transit_time_min: number;
}

export interface DbBookingRequest {
  id: string;
  room_id: string;
  student_id?: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  university_name: string;
  study_level: string;
  preferred_move_in_date: string;
  preferred_duration_months: number;
  property_id?: string;
  status: BookingStatus;
  notes?: string;
  message?: string;
  visit_date?: string;
  visit_notes?: string;
  requested_at: string;
  created_at: string;
  updated_at: string;
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface DbReservation {
  id: string;
  room_id: string;
  student_id: string;
  booking_request_id?: string;
  start_date: string;
  end_date?: string;
  monthly_price_dh: number;
  deposit_dh: number;
  status: ReservationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbContactRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status?: 'new' | 'in_progress' | 'resolved' | 'closed';
  read_at?: string;
  handled_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface DbLandlordSubmission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  neighborhood: string;
  property_type: PropertyType;
  rooms_count: number;
  surface_sqm: number;
  expected_rent_dh: number;
  availability_date: string;
  message?: string;
  status: 'new' | 'contacted' | 'approved' | 'declined';
  created_at: string;
}

export interface DbAuditLog {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: Record<string, unknown> | null;
  new_value?: Record<string, unknown> | null;
  ip_address?: string | null;
  created_at: string;
}

