import { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS configuration.
 * Only the real frontend URL is allowed — never use '*' for production APIs.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Pas d'en-tête Origin = requête non-navigateur ou same-origin : CORS ne s'applique pas.

    const allowed = [env.FRONTEND_URL, ...env.CORS_EXTRA_ORIGINS];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
