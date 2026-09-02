import { Request, Response } from 'express';
import { errorResponse } from '../lib/response';

/**
 * 404 handler for unmatched routes.
 * Must be registered AFTER all other routes.
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json(
    errorResponse('NOT_FOUND', `Route '${req.method} ${req.originalUrl}' not found.`)
  );
}
