-- ====================================================================
-- Migration 006: Comprehensive Row Level Security (RLS) Hardening
-- ====================================================================
-- Description:
--   1. Enables RLS on ALL public tables (including junction and media tables).
--   2. Enforces strict principle of least privilege:
--      - PUBLIC: Read-only access to available properties, rooms, images, amenities, proximities, cities, universities.
--      - STUDENT: Isolated access to their own user profile, student record, booking requests, and reservations.
--      - LANDLORD: Isolated access to their own profile, their owned properties, and the rooms within them.
--      - SERVICE ROLE: Full administrative access for the Express backend API.
--   3. Guarantees that frontend anon clients cannot access unauthorized tenant data.
-- ====================================================================

-- 1. Enable RLS on all tables
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

-- 2. Service Role Policies (Express Backend Full Access)
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

-- 3. Public Catalog Policies (Read-Only)
DROP POLICY IF EXISTS "Public can view active cities" ON public.cities;
CREATE POLICY "Public can view active cities" ON public.cities
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view universities" ON public.universities;
CREATE POLICY "Public can view universities" ON public.universities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active properties" ON public.properties;
CREATE POLICY "Public can view active properties" ON public.properties
  FOR SELECT USING (status IN ('AVAILABLE', 'PARTIALLY_OCCUPIED'));

DROP POLICY IF EXISTS "Public can view available rooms" ON public.rooms;
CREATE POLICY "Public can view available rooms" ON public.rooms
  FOR SELECT USING (status = 'AVAILABLE');

DROP POLICY IF EXISTS "Public can view property images" ON public.property_images;
CREATE POLICY "Public can view property images" ON public.property_images
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view amenities" ON public.amenities;
CREATE POLICY "Public can view amenities" ON public.amenities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view property amenities" ON public.property_amenities;
CREATE POLICY "Public can view property amenities" ON public.property_amenities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view room amenities" ON public.room_amenities;
CREATE POLICY "Public can view room amenities" ON public.room_amenities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view university proximities" ON public.university_proximities;
CREATE POLICY "Public can view university proximities" ON public.university_proximities
  FOR SELECT USING (true);

-- 4. User Profiles Isolation
DROP POLICY IF EXISTS "Users can view own account" ON public.users;
CREATE POLICY "Users can view own account" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own account" ON public.users;
CREATE POLICY "Users can update own account" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Students can view own profile" ON public.students;
CREATE POLICY "Students can view own profile" ON public.students
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can update own profile" ON public.students;
CREATE POLICY "Students can update own profile" ON public.students
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Landlords can view own profile" ON public.landlords;
CREATE POLICY "Landlords can view own profile" ON public.landlords
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Landlords can update own profile" ON public.landlords;
CREATE POLICY "Landlords can update own profile" ON public.landlords
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Landlord Properties & Rooms Isolation
DROP POLICY IF EXISTS "Landlords can view own properties" ON public.properties;
CREATE POLICY "Landlords can view own properties" ON public.properties
  FOR SELECT USING (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Landlords can update own properties" ON public.properties;
CREATE POLICY "Landlords can update own properties" ON public.properties
  FOR UPDATE USING (
    landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Landlords can view own rooms" ON public.rooms;
CREATE POLICY "Landlords can view own rooms" ON public.rooms
  FOR SELECT USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Landlords can update own rooms" ON public.rooms;
CREATE POLICY "Landlords can update own rooms" ON public.rooms
  FOR UPDATE USING (
    property_id IN (
      SELECT id FROM public.properties 
      WHERE landlord_id IN (SELECT id FROM public.landlords WHERE user_id = auth.uid())
    )
  );

-- 6. Student Booking Requests & Reservations Isolation
DROP POLICY IF EXISTS "Students can view own booking requests" ON public.booking_requests;
CREATE POLICY "Students can view own booking requests" ON public.booking_requests
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR student_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Students can view own reservations" ON public.reservations;
CREATE POLICY "Students can view own reservations" ON public.reservations
  FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
  );

-- Public can submit booking requests via form (validated server-side)
DROP POLICY IF EXISTS "Public can submit booking requests" ON public.booking_requests;
CREATE POLICY "Public can submit booking requests" ON public.booking_requests
  FOR INSERT WITH CHECK (true);

-- Public can submit contact requests
DROP POLICY IF EXISTS "Public can submit contact requests" ON public.contact_requests;
CREATE POLICY "Public can submit contact requests" ON public.contact_requests
  FOR INSERT WITH CHECK (true);

-- Public can submit landlord proposals
DROP POLICY IF EXISTS "Public can submit landlord proposals" ON public.landlord_submissions;
CREATE POLICY "Public can submit landlord proposals" ON public.landlord_submissions
  FOR INSERT WITH CHECK (true);
