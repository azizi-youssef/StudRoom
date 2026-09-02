-- ====================================================================
-- StudRoom Platform — PostgreSQL / Supabase Room-Centric Production Schema
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Cities
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Maroc',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Universities
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  address TEXT,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'landlord', 'admin')) DEFAULT 'student',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  study_level VARCHAR(100),
  field_of_study VARCHAR(150),
  preferred_move_in_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Landlords
CREATE TABLE landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  tax_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE SET NULL,
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood VARCHAR(150) NOT NULL,
  property_type VARCHAR(50) CHECK (property_type IN ('apartment', 'house', 'residence', 'studio', 'building')) DEFAULT 'apartment',
  min_price_dh NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_price_dh NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_rooms INT DEFAULT 1,
  available_rooms INT DEFAULT 1,
  surface_sqm NUMERIC(6, 2) DEFAULT 0,
  status VARCHAR(30) CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULLY_OCCUPIED', 'UNAVAILABLE')) DEFAULT 'AVAILABLE',
  featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Rooms (Central Reservable Unit)
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  description TEXT,
  room_type VARCHAR(30) CHECK (room_type IN ('PRIVATE', 'SHARED', 'MASTER', 'STUDIO')) DEFAULT 'PRIVATE',
  price_monthly NUMERIC(10, 2) NOT NULL,
  deposit_dh NUMERIC(10, 2) DEFAULT 0,
  surface_sqm NUMERIC(6, 2) DEFAULT 0,
  furnished BOOLEAN DEFAULT true,
  floor INT DEFAULT 1,
  available_from DATE DEFAULT CURRENT_DATE,
  status VARCHAR(30) CHECK (status IN ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE')) DEFAULT 'AVAILABLE',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Amenities
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('essential', 'comfort', 'security', 'services')) DEFAULT 'essential'
);

-- 9. Property Amenities Junction
CREATE TABLE property_amenities (
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

-- 10. Room Amenities Junction
CREATE TABLE room_amenities (
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, amenity_id)
);

-- 11. Property Images
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0
);

-- 12. University Proximities
CREATE TABLE university_proximities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  distance_km NUMERIC(5, 2) NOT NULL,
  walking_time_min INT NOT NULL,
  transit_time_min INT NOT NULL,
  UNIQUE(property_id, university_id)
);

-- 13. Booking Requests
CREATE TABLE booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(50) NOT NULL,
  university_name VARCHAR(255) NOT NULL,
  study_level VARCHAR(100) NOT NULL,
  preferred_move_in_date DATE NOT NULL,
  preferred_duration_months INT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  status VARCHAR(30) CHECK (status IN ('PENDING', 'CONTACTED', 'VISIT_SCHEDULED', 'APPROVED', 'REJECTED', 'CANCELLED')) DEFAULT 'PENDING',
  notes TEXT,
  message TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Contact Requests
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Landlord Submissions
CREATE TABLE landlord_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(150) NOT NULL,
  property_type VARCHAR(50) NOT NULL,
  rooms_count INT NOT NULL,
  surface_sqm NUMERIC(6,2),
  expected_rent_dh NUMERIC(10,2) NOT NULL,
  availability_date DATE NOT NULL,
  message TEXT,
  status VARCHAR(50) CHECK (status IN ('new', 'contacted', 'approved', 'declined')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX idx_properties_city ON properties(city_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_rooms_property ON rooms(property_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_price ON rooms(price_monthly);
CREATE INDEX idx_proximities_uni ON university_proximities(university_id);
CREATE INDEX idx_booking_room ON booking_requests(room_id);
CREATE INDEX idx_booking_status ON booking_requests(status);
