import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let supabaseAnonClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

const baseOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

/**
 * Returns a Supabase client using the ANON key.
 * Use for read queries that respect Row Level Security.
 * Returns null if Supabase is not configured (fallback to mock in dev).
 */
export function getSupabase(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    if (env.isDev()) {
      console.warn('[SUPABASE] URL or ANON_KEY missing — falling back to static data.');
    }
    return null;
  }

  if (!supabaseAnonClient) {
    supabaseAnonClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, baseOptions);
    console.log('[SUPABASE] Anon client initialized.');
  }

  return supabaseAnonClient;
}

/**
 * Returns a Supabase client using the SERVICE ROLE key.
 * Use for admin operations that bypass RLS (dashboard queries, seeding).
 * NEVER expose this client to the frontend.
 * Throws in production if SERVICE_ROLE_KEY is missing.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    if (env.isProd()) {
      throw new Error('[SUPABASE] SUPABASE_SERVICE_ROLE_KEY is required in production.');
    }
    console.warn('[SUPABASE] SERVICE_ROLE_KEY missing — admin operations will use anon key or mock.');
    return getSupabase();
  }

  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, baseOptions);
    console.log('[SUPABASE] Admin client initialized.');
  }

  return supabaseAdminClient;
}

