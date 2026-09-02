import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, errorResponse } from '../lib/response';
import { env } from '../config/env';

/**
 * Global Express error handler.
 * All errors thrown in route handlers flow here.
 * Never expose internal stack traces or DB errors in production.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // ZodError — validation failure
  if (err instanceof ZodError) {
    res.status(422).json(
      errorResponse('VALIDATION_ERROR', 'Veuillez vérifier les informations renseignées.', err.errors)
    );
    return;
  }

  // AppError — known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.code, err.message));
    return;
  }

  // Unknown errors
  if (env.isDev()) {
    console.error('[ERROR]', err);
  }

  res.status(500).json(
    errorResponse('INTERNAL_ERROR', 'Une erreur interne est survenue. Veuillez réessayer.')
  );
}
