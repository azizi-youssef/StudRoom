-- ====================================================================
-- StudRoom Platform — PostgreSQL / Supabase Room-Centric Production Schema
-- Consolidated Master Schema (Hardened, Idempotent, Production-Ready)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ====================================================================
-- 1. REFERENCE TABLES (Cities & Universities)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Maroc',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  address TEXT,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. USER & PROFILE ARCHITECTURE (1:1 with Supabase Auth)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('student', 'landlord', 'admin')) DEFAULT 'student',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL DEFAULT '+212 600 000 000',
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conditionally attach foreign key to auth.users if auth schema is present (Supabase)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'fk_public_users_auth_users'
    ) THEN
      ALTER TABLE public.users 
        ADD CONSTRAINT fk_public_users_auth_users 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
    END IF;

  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
  study_level VARCHAR(100),
  field_of_study VARCHAR(150),
  preferred_move_in_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.landlords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  tax_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. PROPERTIES & ROOMS (Central Reservable Unit)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  landlord_id UUID REFERENCES public.landlords(id) ON DELETE SET NULL,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  neighborhood VARCHAR(150) NOT NULL,
  property_type VARCHAR(50) CHECK (property_type IN ('apartment', 'house', 'residence', 'studio', 'building')) DEFAULT 'apartment',
  min_price_dh NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_price_dh >= 0),
  max_price_dh NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (max_price_dh >= 0),
  total_rooms INT DEFAULT 1 CHECK (total_rooms >= 0),
  available_rooms INT DEFAULT 1 CHECK (available_rooms >= 0 AND available_rooms <= total_rooms),
  surface_sqm NUMERIC(6, 2) DEFAULT 0 CHECK (surface_sqm >= 0),
  status VARCHAR(30) CHECK (status IN ('DRAFT', 'UNDER_REVIEW', 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULLY_OCCUPIED', 'UNAVAILABLE')) DEFAULT 'AVAILABLE',
  featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  location_lat NUMERIC(10, 7),
  location_lng NUMERIC(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_properties_price_range CHECK (max_price_dh >= min_price_dh)
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  description TEXT,
  room_type VARCHAR(30) CHECK (room_type IN ('PRIVATE', 'SHARED', 'MASTER', 'STUDIO')) DEFAULT 'PRIVATE',
  price_monthly NUMERIC(10, 2) NOT NULL CHECK (price_monthly >= 0),
  deposit_dh NUMERIC(10, 2) DEFAULT 0 CHECK (deposit_dh >= 0),
  surface_sqm NUMERIC(6, 2) DEFAULT 0 CHECK (surface_sqm >= 0),
  furnished BOOLEAN DEFAULT true,
  floor INT DEFAULT 1 CHECK (floor >= -2),
  available_from DATE DEFAULT CURRENT_DATE,
  status VARCHAR(30) CHECK (status IN ('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE')) DEFAULT 'AVAILABLE',
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_rooms_property_slug UNIQUE (property_id, slug)
);

-- ====================================================================
-- 4. AMENITIES, IMAGES & PROXIMITIES
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('essential', 'comfort', 'security', 'services')) DEFAULT 'essential'
);

CREATE TABLE IF NOT EXISTS public.property_amenities (
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (property_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS public.room_amenities (
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS public.property_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  is_primary BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_property_images_unique_primary
  ON public.property_images(property_id)
  WHERE (is_primary = true);

CREATE TABLE IF NOT EXISTS public.university_proximities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  distance_km NUMERIC(5, 2) NOT NULL,
  walking_time_min INT NOT NULL,
  transit_time_min INT NOT NULL,
  UNIQUE(property_id, university_id)
);

-- ====================================================================
-- 5. BOOKING REQUESTS (Inquiries) & RESERVATIONS (Confirmed Leases)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255) NOT NULL,
  student_phone VARCHAR(50) NOT NULL,
  university_name VARCHAR(255) NOT NULL,
  study_level VARCHAR(100) NOT NULL,
  preferred_move_in_date DATE NOT NULL,
  preferred_duration_months INT NOT NULL CHECK (preferred_duration_months > 0),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  status VARCHAR(30) CHECK (status IN ('PENDING', 'CONTACTED', 'VISIT_SCHEDULED', 'APPROVED', 'REJECTED', 'CANCELLED')) DEFAULT 'PENDING',
  notes TEXT,
  message TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE RESTRICT,
  booking_request_id UUID UNIQUE REFERENCES public.booking_requests(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  monthly_price_dh NUMERIC(10, 2) NOT NULL CHECK (monthly_price_dh >= 0),
  deposit_dh NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (deposit_dh >= 0),
  status VARCHAR(30) CHECK (status IN ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')) DEFAULT 'CONFIRMED',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reservation_dates CHECK (end_date IS NULL OR end_date >= start_date)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'no_overlapping_active_reservations'
  ) THEN
    ALTER TABLE public.reservations
      ADD CONSTRAINT no_overlapping_active_reservations
      EXCLUDE USING gist (
        room_id WITH =,
        daterange(start_date, COALESCE(end_date, 'infinity'::date), '[]') WITH &&
      )
      WHERE (status IN ('CONFIRMED', 'ACTIVE'));
  END IF;
END $$;

-- ====================================================================
-- 6. CONTACT REQUESTS & LANDLORD SUBMISSIONS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')) DEFAULT 'new',
  read_at TIMESTAMP WITH TIME ZONE,
  handled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.landlord_submissions (
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

-- ====================================================================
-- 7. PERFORMANCE INDEXES
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_properties_city_status ON public.properties(city_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_status_minprice ON public.properties(status, min_price_dh);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON public.properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_featured_available ON public.properties(featured, is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON public.properties(landlord_id);

CREATE INDEX IF NOT EXISTS idx_rooms_property_status ON public.rooms(property_id, status);
CREATE INDEX IF NOT EXISTS idx_rooms_status_price ON public.rooms(status, price_monthly);
CREATE INDEX IF NOT EXISTS idx_rooms_available_from ON public.rooms(available_from);

CREATE INDEX IF NOT EXISTS idx_proximities_uni_prop ON public.university_proximities(university_id, property_id);
CREATE INDEX IF NOT EXISTS idx_proximities_prop_distance ON public.university_proximities(property_id, distance_km);

CREATE INDEX IF NOT EXISTS idx_booking_room_status ON public.booking_requests(room_id, status);
CREATE INDEX IF NOT EXISTS idx_booking_student ON public.booking_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_booking_created_at ON public.booking_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_room_status ON public.reservations(room_id, status);
CREATE INDEX IF NOT EXISTS idx_reservations_student ON public.reservations(student_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON public.reservations(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_landlord_submissions_status ON public.landlord_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status, created_at DESC);

-- ====================================================================
-- 8. TRIGGERS & BUSINESS LOGIC FUNCTIONS
-- ====================================================================

-- 8.1 Universal updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
  tbls TEXT[] := ARRAY['users', 'students', 'landlords', 'properties', 'rooms', 'booking_requests', 'reservations', 'contact_requests'];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE FORMAT('DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.%I;', t);
    EXECUTE FORMAT('CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

-- 8.2 Booking Request property_id sync trigger
CREATE OR REPLACE FUNCTION public.sync_booking_request_property_id()
RETURNS TRIGGER AS $$
DECLARE
  v_property_id UUID;
BEGIN
  IF NEW.room_id IS NOT NULL THEN
    SELECT property_id INTO v_property_id
    FROM public.rooms
    WHERE id = NEW.room_id;

    IF v_property_id IS NOT NULL THEN
      NEW.property_id := v_property_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_booking_request_property ON public.booking_requests;
CREATE TRIGGER trigger_sync_booking_request_property
  BEFORE INSERT OR UPDATE OF room_id ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.sync_booking_request_property_id();

-- 8.3 Property room metrics & price sync trigger (Option B)
CREATE OR REPLACE FUNCTION public.sync_property_room_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_property_id UUID;
  v_min_price NUMERIC(10, 2);
  v_max_price NUMERIC(10, 2);
  v_total INT;
  v_available INT;
  v_new_status VARCHAR(30);
  v_is_available BOOLEAN;
BEGIN
  v_property_id := COALESCE(NEW.property_id, OLD.property_id);
  IF v_property_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT 
    COALESCE(MIN(price_monthly), 0),
    COALESCE(MAX(price_monthly), 0),
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'AVAILABLE')
  INTO
    v_min_price,
    v_max_price,
    v_total,
    v_available
  FROM public.rooms
  WHERE property_id = v_property_id;

  IF v_total = 0 THEN
    v_new_status := 'UNAVAILABLE';
    v_is_available := false;
  ELSIF v_available = 0 THEN
    v_new_status := 'FULLY_OCCUPIED';
    v_is_available := false;
  ELSIF v_available < v_total THEN
    v_new_status := 'PARTIALLY_OCCUPIED';
    v_is_available := true;
  ELSE
    v_new_status := 'AVAILABLE';
    v_is_available := true;
  END IF;

  UPDATE public.properties
  SET 
    min_price_dh = v_min_price,
    max_price_dh = v_max_price,
    total_rooms = v_total,
    available_rooms = v_available,
    status = CASE 
      WHEN status IN ('DRAFT', 'UNDER_REVIEW') THEN status 
      ELSE v_new_status 
    END,
    is_available = v_is_available,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = v_property_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_property_room_stats ON public.rooms;
CREATE TRIGGER trigger_sync_property_room_stats
  AFTER INSERT OR UPDATE OF price_monthly, status, property_id OR DELETE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.sync_property_room_stats();

-- 8.4 Room status sync on reservation changes
CREATE OR REPLACE FUNCTION public.sync_room_status_on_reservation()
RETURNS TRIGGER AS $$
DECLARE
  v_active_count INT;
  v_target_room_id UUID;
BEGIN
  v_target_room_id := COALESCE(NEW.room_id, OLD.room_id);

  SELECT COUNT(*) INTO v_active_count
  FROM public.reservations
  WHERE room_id = v_target_room_id
    AND status IN ('CONFIRMED', 'ACTIVE');

  IF v_active_count > 0 THEN
    UPDATE public.rooms
    SET status = 'RESERVED', updated_at = CURRENT_TIMESTAMP
    WHERE id = v_target_room_id AND status = 'AVAILABLE';
  ELSE
    UPDATE public.rooms
    SET status = 'AVAILABLE', updated_at = CURRENT_TIMESTAMP
    WHERE id = v_target_room_id AND status = 'RESERVED';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_room_reservation ON public.reservations;
CREATE TRIGGER trigger_sync_room_reservation
  AFTER INSERT OR UPDATE OR DELETE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.sync_room_status_on_reservation();

-- ====================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.university_proximities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_submissions ENABLE ROW LEVEL SECURITY;

-- Service Role Full Access
DO $$
DECLARE
  t TEXT;
  tbls TEXT[] := ARRAY[
    'users', 'students', 'landlords', 'cities', 'universities',
    'properties', 'rooms', 'property_images', 'amenities',
    'property_amenities', 'room_amenities', 'university_proximities',
    'booking_requests', 'reservations', 'contact_requests', 'landlord_submissions'
  ];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE FORMAT('DROP POLICY IF EXISTS "Service role full access on %I" ON public.%I;', t, t);
    EXECUTE FORMAT('CREATE POLICY "Service role full access on %I" ON public.%I FOR ALL USING (auth.role() = ''service_role'');', t, t);
  END LOOP;
END $$;

-- Public Catalog Policies
DROP POLICY IF EXISTS "Public can view active cities" ON public.cities;
CREATE POLICY "Public can view active cities" ON public.cities FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view universities" ON public.universities;
CREATE POLICY "Public can view universities" ON public.universities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active properties" ON public.properties;
CREATE POLICY "Public can view active properties" ON public.properties FOR SELECT USING (status IN ('AVAILABLE', 'PARTIALLY_OCCUPIED'));

DROP POLICY IF EXISTS "Public can view available rooms" ON public.rooms;
CREATE POLICY "Public can view available rooms" ON public.rooms FOR SELECT USING (status = 'AVAILABLE');

DROP POLICY IF EXISTS "Public can view property images" ON public.property_images;
CREATE POLICY "Public can view property images" ON public.property_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view amenities" ON public.amenities;
CREATE POLICY "Public can view amenities" ON public.amenities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view property amenities" ON public.property_amenities;
CREATE POLICY "Public can view property amenities" ON public.property_amenities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view room amenities" ON public.room_amenities;
CREATE POLICY "Public can view room amenities" ON public.room_amenities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view university proximities" ON public.university_proximities;
CREATE POLICY "Public can view university proximities" ON public.university_proximities FOR SELECT USING (true);

-- User Profile Policies
DROP POLICY IF EXISTS "Users can view own account" ON public.users;
CREATE POLICY "Users can view own account" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own account" ON public.users;
CREATE POLICY "Users can update own account" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
CREATE POLICY "Students can view own profile" ON public.students FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own profile" ON public.students;
CREATE POLICY "Students can update own profile" ON public.students FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Landlords can view own profile" ON public.landlords;
CREATE POLICY "Landlords can view own profile" ON public.landlords FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Landlords can update own profile" ON public.landlords;
CREATE POLICY "Landlords can update own profile" ON public.landlords FOR UPDATE USING (auth.uid() = user_id);

-- Landlord Ownership Isolation
DROP POLICY IF EXISTS "Landlords can view own properties" ON public.properties;
CREATE POLICY "Landlords can view own properties" ON public.properties
  FOR SELECT USING (landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Landlords can update own properties" ON public.properties;
CREATE POLICY "Landlords can update own properties" ON public.properties
  FOR UPDATE USING (landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Landlords can view own rooms" ON public.rooms;
CREATE POLICY "Landlords can view own rooms" ON public.rooms
  FOR SELECT USING (
    property_id IN (SELECT id FROM public.properties WHERE landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Landlords can update own rooms" ON public.rooms;
CREATE POLICY "Landlords can update own rooms" ON public.rooms
  FOR UPDATE USING (
    property_id IN (SELECT id FROM public.properties WHERE landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid()))
  );

-- Student Booking & Reservation Policies
DROP POLICY IF EXISTS "Students can view own booking requests" ON public.booking_requests;
CREATE POLICY "Students can view own booking requests" ON public.booking_requests
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR student_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can view own reservations" ON public.reservations;
CREATE POLICY "Students can view own reservations" ON public.reservations
  FOR SELECT USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Public Form Submissions
DROP POLICY IF EXISTS "Public can submit booking requests" ON public.booking_requests;
CREATE POLICY "Public can submit booking requests" ON public.booking_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;
CREATE POLICY "Public can submit contact requests" ON public.contact_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit landlord proposals" ON public.landlord_submissions;
CREATE POLICY "Public can submit landlord proposals" ON public.landlord_submissions FOR INSERT WITH CHECK (true);

-- ====================================================================
-- 10. AUDIT LOGS (Admin Back-Office)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p_audit_logs_admin_all ON public.audit_logs;
CREATE POLICY p_audit_logs_admin_all ON public.audit_logs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));

