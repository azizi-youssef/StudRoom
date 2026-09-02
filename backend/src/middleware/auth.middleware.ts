import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../lib/response';
import { UserRole } from '../shared/types/database';

export interface AuthJwtPayload {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches decoded payload to req.user.
 * Returns 401 if token is absent or invalid.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Session expirée ou non autorisée. Veuillez vous connecter.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthJwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, 'UNAUTHORIZED', "Jeton d'authentification invalide ou expiré."));
  }
}

/**
 * Role-based authorization guard.
 * Must be used AFTER requireAuth.
 * Returns 403 if the authenticated user's role is not in the allowed list.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'UNAUTHORIZED', 'Non authentifié.'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'FORBIDDEN',
          `Accès refusé. Cette ressource est réservée aux rôles : ${roles.join(', ')}.`
        )
      );
    }
    next();
  };
}

/** Shorthand — admin only */
export const requireAdmin = [requireAuth, requireRole('admin')];

/** Shorthand — student only */
export const requireStudent = [requireAuth, requireRole('student')];

/** Shorthand — landlord only */
export const requireLandlord = [requireAuth, requireRole('landlord')];

/** Shorthand — admin or landlord */
export const requireAdminOrLandlord = [requireAuth, requireRole('admin', 'landlord')];

