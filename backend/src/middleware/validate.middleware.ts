import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { errorResponse } from '../lib/response';

/**
 * Zod validation middleware factory.
 * Usage: router.post('/path', validate(mySchema), controller.handler)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(422).json(
          errorResponse(
            'VALIDATION_ERROR',
            'Veuillez vérifier les informations renseignées.',
            err.errors
          )
        );
        return;
      }
      next(err);
    }
  };
}
