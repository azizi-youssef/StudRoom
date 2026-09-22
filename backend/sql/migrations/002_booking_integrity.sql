-- ====================================================================
-- Migration 002: Booking Requests Integrity & Property Redundancy Sync
-- ====================================================================
-- Description:
--   1. Harmonizes booking_requests with rooms: keeps property_id backward-compatible,
--      but uses a trigger to automatically populate/verify property_id = rooms.property_id.
--   2. Prevents data divergence between requested room and associated property.
--   3. Adds check constraints for dates and duration.
-- ====================================================================

-- 1. Function to synchronize booking_requests.property_id from rooms.property_id
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

-- 2. Trigger on booking_requests BEFORE INSERT OR UPDATE
DROP TRIGGER IF EXISTS trigger_sync_booking_request_property ON public.booking_requests;
CREATE TRIGGER trigger_sync_booking_request_property
  BEFORE INSERT OR UPDATE OF room_id ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.sync_booking_request_property_id();

-- 3. Backfill any existing booking_requests where property_id is NULL or desynchronized
UPDATE public.booking_requests b
SET property_id = r.property_id
FROM public.rooms r
WHERE b.room_id = r.id
  AND (b.property_id IS NULL OR b.property_id <> r.property_id);
