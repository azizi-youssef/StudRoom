-- ====================================================================
-- Migration 004: Business Constraints, Denormalization Integrity & Timestamps
-- ====================================================================
-- Description:
--   1. Installs robust CHECK constraints on prices, surfaces, floors, and dates.
--   2. Ensures strict 1-primary-image-per-property via a partial unique index.
--   3. Restricts room slugs to be unique per property (UNIQUE (property_id, slug)).
--   4. Installs automatic set_updated_at() triggers across all core tables.
--   5. Implements Option B: Automated trigger maintenance of properties denormalized
--      fields (min_price_dh, max_price_dh, total_rooms, available_rooms, status, is_available).
-- ====================================================================

-- 1. Universal updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DO $$
DECLARE
  t TEXT;
  tbls TEXT[] := ARRAY['users', 'students', 'landlords', 'properties', 'rooms', 'booking_requests', 'reservations'];
BEGIN
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE FORMAT('DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.%I;', t);
    EXECUTE FORMAT('CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();', t);
  END LOOP;
END $$;

-- 2. CHECK Constraints on rooms
ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS chk_rooms_price_monthly,
  ADD CONSTRAINT chk_rooms_price_monthly CHECK (price_monthly >= 0) NOT VALID;

ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS chk_rooms_deposit_dh,
  ADD CONSTRAINT chk_rooms_deposit_dh CHECK (deposit_dh >= 0) NOT VALID;

ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS chk_rooms_surface_sqm,
  ADD CONSTRAINT chk_rooms_surface_sqm CHECK (surface_sqm >= 0) NOT VALID;

ALTER TABLE public.rooms 
  DROP CONSTRAINT IF EXISTS chk_rooms_floor,
  ADD CONSTRAINT chk_rooms_floor CHECK (floor >= -2) NOT VALID;

-- 3. CHECK Constraints on properties
ALTER TABLE public.properties 
  DROP CONSTRAINT IF EXISTS chk_properties_min_price,
  ADD CONSTRAINT chk_properties_min_price CHECK (min_price_dh >= 0) NOT VALID;

ALTER TABLE public.properties 
  DROP CONSTRAINT IF EXISTS chk_properties_max_price,
  ADD CONSTRAINT chk_properties_max_price CHECK (max_price_dh >= 0) NOT VALID;

ALTER TABLE public.properties 
  DROP CONSTRAINT IF EXISTS chk_properties_price_range,
  ADD CONSTRAINT chk_properties_price_range CHECK (max_price_dh >= min_price_dh) NOT VALID;

ALTER TABLE public.properties 
  DROP CONSTRAINT IF EXISTS chk_properties_surface_sqm,
  ADD CONSTRAINT chk_properties_surface_sqm CHECK (surface_sqm >= 0) NOT VALID;

ALTER TABLE public.properties 
  DROP CONSTRAINT IF EXISTS chk_properties_rooms_count,
  ADD CONSTRAINT chk_properties_rooms_count CHECK (total_rooms >= 0 AND available_rooms >= 0 AND available_rooms <= total_rooms) NOT VALID;

-- 4. CHECK Constraints on booking_requests
ALTER TABLE public.booking_requests
  DROP CONSTRAINT IF EXISTS chk_booking_duration,
  ADD CONSTRAINT chk_booking_duration CHECK (preferred_duration_months > 0) NOT VALID;


-- 5. Enforce single primary image per property via partial unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_property_images_unique_primary
  ON public.property_images(property_id)
  WHERE (is_primary = true);

-- Add timestamps to property_images if missing
ALTER TABLE public.property_images ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 6. Enforce room slug uniqueness per property
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_rooms_property_slug'
  ) THEN
    ALTER TABLE public.rooms ADD CONSTRAINT uq_rooms_property_slug UNIQUE (property_id, slug);
  END IF;
END $$;

-- 7. Automated maintenance of properties denormalized stats from rooms
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

  -- Aggregate room stats for this property
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

  -- Determine appropriate property status based on room availability
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

  -- Update property record safely
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
