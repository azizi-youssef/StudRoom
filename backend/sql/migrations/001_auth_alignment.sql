-- ====================================================================
-- Migration 001: Supabase Auth Alignment & Automatic Profile Creation
-- ====================================================================
-- Description:
--   1. Harmonizes public.users.id with Supabase auth.users.id (1:1 relation).
--   2. Ensures public.users has proper foreign key to auth.users in Supabase.
--   3. Sets up a PostgreSQL trigger to automatically create public.users and
--      a corresponding student/landlord record whenever a user signs up via
--      Supabase Auth / Google OAuth.
-- ====================================================================

-- 1. Ensure public.users table exists with appropriate constraints
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

-- 2. Safely add foreign key to auth.users if auth schema exists (Supabase environment)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    -- A. Synchronize existing users where email matches an existing auth.users account
    -- Update dependent profiles first if needed
    UPDATE public.students s
    SET user_id = a.id
    FROM public.users u
    JOIN auth.users a ON LOWER(TRIM(u.email)) = LOWER(TRIM(a.email))
    WHERE s.user_id = u.id AND u.id <> a.id;

    UPDATE public.landlords l
    SET user_id = a.id
    FROM public.users u
    JOIN auth.users a ON LOWER(TRIM(u.email)) = LOWER(TRIM(a.email))
    WHERE l.user_id = u.id AND u.id <> a.id;

    UPDATE public.users u
    SET id = a.id
    FROM auth.users a
    WHERE LOWER(TRIM(u.email)) = LOWER(TRIM(a.email))
      AND u.id <> a.id;

    -- B. Add foreign key constraint with NOT VALID
    -- This guarantees future data integrity without failing on existing legacy/test rows
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


-- 3. Ensure students table references public.users(id)
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

-- 4. Ensure landlords table references public.users(id)
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

-- 5. Trigger Function: Sync auth.users to public.users & students on signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role VARCHAR(20);
  v_full_name VARCHAR(255);
  v_phone VARCHAR(50);
  v_first_name VARCHAR(100);
  v_last_name VARCHAR(100);
  v_parts TEXT[];
BEGIN
  -- Extract metadata or defaults
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  IF v_role NOT IN ('student', 'landlord', 'admin') THEN
    v_role := 'student';
  END IF;

  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  v_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+212 600 000 000');

  -- Insert or update public.users
  INSERT INTO public.users (id, email, role, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_role,
    v_full_name,
    v_phone,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = CURRENT_TIMESTAMP;

  -- Create role-specific profile
  IF v_role = 'student' THEN
    v_parts := REGEXP_SPLIT_TO_ARRAY(TRIM(v_full_name), '\s+');
    v_first_name := COALESCE(v_parts[1], 'Étudiant');
    IF ARRAY_LENGTH(v_parts, 1) > 1 THEN
      v_last_name := ARRAY_TO_STRING(v_parts[2:], ' ');
    ELSE
      v_last_name := 'StudRoom';
    END IF;

    INSERT INTO public.students (user_id, first_name, last_name, phone, email)
    VALUES (NEW.id, v_first_name, v_last_name, v_phone, NEW.email)
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      updated_at = CURRENT_TIMESTAMP;

  ELSIF v_role = 'landlord' THEN
    INSERT INTO public.landlords (user_id, name, phone, email)
    VALUES (NEW.id, v_full_name, v_phone, NEW.email)
    ON CONFLICT (user_id) DO UPDATE SET
      email = EXCLUDED.email,
      updated_at = CURRENT_TIMESTAMP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach trigger to auth.users if auth schema exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
  END IF;
END $$;
