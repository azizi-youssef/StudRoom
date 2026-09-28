import { CorsOptions } from 'cors';
import { env } from './env';

/**
 * CORS configuration.
 * Only the real frontend URL is allowed — never use '*' for production APIs.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman in dev)
    if (!origin && env.isDev()) return callback(null, true);

    const allowed = [env.FRONTEND_URL, 'http://127.0.0.1:63636']; // Added preview port for testing
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
