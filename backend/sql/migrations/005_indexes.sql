-- ====================================================================
-- Migration 005: Query-Optimized PostgreSQL Performance Indexes
-- ====================================================================
-- Description:
--   1. Creates targeted composite and single-column indexes matching actual repository queries.
--   2. Optimizes catalog search, price range filtering, university proximity lookups,
--      and booking/reservation management.
--   3. Adds workflow status tracking columns to contact_requests (status, read_at, handled_by).
-- ====================================================================

-- 1. Enhance contact_requests with administrative tracking columns
ALTER TABLE public.contact_requests
  ADD COLUMN IF NOT EXISTS status VARCHAR(30) CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')) DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS handled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 2. Performance Indexes: properties
CREATE INDEX IF NOT EXISTS idx_properties_city_status ON public.properties(city_id, status);
CREATE INDEX IF NOT EXISTS idx_properties_status_minprice ON public.properties(status, min_price_dh);
CREATE INDEX IF NOT EXISTS idx_properties_featured_available ON public.properties(featured, is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_properties_landlord ON public.properties(landlord_id);

-- 3. Performance Indexes: rooms
CREATE INDEX IF NOT EXISTS idx_rooms_property_status ON public.rooms(property_id, status);
CREATE INDEX IF NOT EXISTS idx_rooms_status_price ON public.rooms(status, price_monthly);
CREATE INDEX IF NOT EXISTS idx_rooms_available_from ON public.rooms(available_from);

-- 4. Performance Indexes: university proximities
CREATE INDEX IF NOT EXISTS idx_proximities_uni_prop ON public.university_proximities(university_id, property_id);
CREATE INDEX IF NOT EXISTS idx_proximities_prop_distance ON public.university_proximities(property_id, distance_km);

-- 5. Performance Indexes: booking_requests & reservations
CREATE INDEX IF NOT EXISTS idx_booking_room_status ON public.booking_requests(room_id, status);
CREATE INDEX IF NOT EXISTS idx_booking_student ON public.booking_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_booking_created_at ON public.booking_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reservations_room_status ON public.reservations(room_id, status);
CREATE INDEX IF NOT EXISTS idx_reservations_student ON public.reservations(student_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON public.reservations(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);

-- 6. Performance Indexes: landlord submissions & contacts
CREATE INDEX IF NOT EXISTS idx_landlord_submissions_status ON public.landlord_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON public.contact_requests(status, created_at DESC);
