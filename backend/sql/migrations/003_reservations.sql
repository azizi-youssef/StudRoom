-- ====================================================================
-- Migration 003: Official Reservations Table & Concurrency Protection
-- ====================================================================
-- Description:
--   1. Separates booking requests (inquiries/applications) from official reservations (leases).
--   2. Freezes monthly rent (monthly_price_dh) and security deposit (deposit_dh) at lease creation.
--   3. Enables btree_gist extension and installs a strict EXCLUDE GiST constraint
--      to prevent concurrent overlapping reservations for the same room.
--   4. Manages room status transitions (AVAILABLE <-> RESERVED / OCCUPIED).
-- ====================================================================

-- 1. Enable btree_gist extension for composite GiST exclusion constraints
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Create reservations table
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

-- 3. Concurrency Protection: Prevent overlapping active/confirmed reservations for the same room
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

-- 4. Trigger Function: Automatically update room status when reservations change
CREATE OR REPLACE FUNCTION public.sync_room_status_on_reservation()
RETURNS TRIGGER AS $$
DECLARE
  v_active_count INT;
  v_target_room_id UUID;
BEGIN
  v_target_room_id := COALESCE(NEW.room_id, OLD.room_id);

  -- Count active/confirmed reservations for this room
  SELECT COUNT(*) INTO v_active_count
  FROM public.reservations
  WHERE room_id = v_target_room_id
    AND status IN ('CONFIRMED', 'ACTIVE');

  IF v_active_count > 0 THEN
    UPDATE public.rooms
    SET status = 'RESERVED', updated_at = CURRENT_TIMESTAMP
    WHERE id = v_target_room_id AND status = 'AVAILABLE';
  ELSE
    -- If no more active reservations and room was marked RESERVED, set back to AVAILABLE
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
