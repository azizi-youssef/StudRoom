import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`[ENV] Missing required environment variable: ${key}`);
  }
  return value;
}

function getEnvRequired(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[ENV] Required environment variable "${key}" is not set. ` +
      'Please copy .env.example to .env and fill in the values.'
    );
  }
  return value;
}

const isDev = (process.env.NODE_ENV ?? 'development') === 'development';

export const env = {
  PORT: parseInt(getEnv('PORT', '4000'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),

  // JWT — no fallback in production, must be explicitly set
  JWT_SECRET: isDev
    ? getEnv('JWT_SECRET', 'studroom_dev_only_secret_change_in_prod')
    : getEnvRequired('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),

  // Supabase
  SUPABASE_URL: getEnv('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY', getEnv('SUPABASE_KEY', '')),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY', getEnv('SUPABASE_SERVICE_KEY', '')),

  isDev: () => isDev,
  isProd: () => process.env.NODE_ENV === 'production',
};

