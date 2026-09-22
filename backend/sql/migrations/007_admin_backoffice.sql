-- ====================================================================
-- StudRoom Migration 007 : Admin Back-Office, Audit Logs & Enhanced Tracking
-- Safe & Idempotent Migration
-- ====================================================================

-- 1. ADD STATUS COLUMN TO USERS (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.users 
      ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' 
      CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BLOCKED'));
  END IF;
END $$;

-- 2. ADD VISIT DETAILS TO BOOKING REQUESTS (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'booking_requests' AND column_name = 'visit_date'
  ) THEN
    ALTER TABLE public.booking_requests 
      ADD COLUMN visit_date TIMESTAMP WITH TIME ZONE,
      ADD COLUMN visit_notes TEXT;
  END IF;
END $$;

-- 3. CREATE AUDIT LOGS TABLE
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

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_user_id);

-- 4. RLS POLICIES FOR AUDIT LOGS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'p_audit_logs_admin_all'
  ) THEN
    CREATE POLICY p_audit_logs_admin_all ON public.audit_logs
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );
  END IF;
END $$;

-- 5. ADD IMAGES ARRAY TO ROOMS (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'images'
  ) THEN
    ALTER TABLE public.rooms ADD COLUMN images TEXT[] DEFAULT '{}';
  END IF;
END $$;

