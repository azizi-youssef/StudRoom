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
// Jest définit NODE_ENV=test : secrets factices autorisés uniquement dans ce cas (jamais en production/staging)
const usesDevSecrets = isDev || process.env.NODE_ENV === 'test';

if (!process.env.NODE_ENV) {
  console.warn("[ENV] NODE_ENV n'est pas défini : mode 'development' appliqué. Définissez NODE_ENV=production en déploiement.");
}

export const env = {
  PORT: parseInt(getEnv('PORT', '4000'), 10),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),

  // JWT — no fallback in production, must be explicitly set
  JWT_SECRET: usesDevSecrets
    ? getEnv('JWT_SECRET', 'studroom_dev_only_secret_change_in_prod')
    : getEnvRequired('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN', '7d'),
  // Origines supplémentaires autorisées par CORS (séparées par des virgules)
  CORS_EXTRA_ORIGINS: getEnv('CORS_EXTRA_ORIGINS', '').split(',').map((o) => o.trim()).filter(Boolean),

  // Cookie signing secret
  COOKIE_SECRET: usesDevSecrets
    ? getEnv('COOKIE_SECRET', 'studroom_cookie_dev_secret_change_in_prod')
    : getEnvRequired('COOKIE_SECRET'),

  // Supabase
  SUPABASE_URL: getEnv('SUPABASE_URL', ''),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY', getEnv('SUPABASE_KEY', '')),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY', getEnv('SUPABASE_SERVICE_KEY', '')),

  // Opt-in explicite pour accepter un login OAuth sans jeton vérifié (développement local uniquement)
  ALLOW_INSECURE_OAUTH: process.env.ALLOW_INSECURE_OAUTH === 'true',

  isDev: () => isDev,
  isProd: () => process.env.NODE_ENV === 'production',
  /** Les jeux de données en mémoire ne sont autorisés qu'en développement local et en test. */
  allowMockFallback: () => isDev || process.env.NODE_ENV === 'test',
};


