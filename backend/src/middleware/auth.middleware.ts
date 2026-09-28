import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../lib/response';
import { UserRole } from '../shared/types/database';
import { AUTH_COOKIE_NAME } from '../controllers/auth.controller';

export interface AuthJwtPayload {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}

/**
 * Extrait le JWT depuis :
 *  1. Le cookie signé `studroom_token` (HttpOnly — prioritaire, le plus sécurisé)
 *  2. L'en-tête `Authorization: Bearer <token>` (fallback pour clients non-navigateurs)
 */
function extractToken(req: Request): string | null {
  // 1. Cookie signé (req.signedCookies est peuplé par cookie-parser avec le secret)
  const cookieToken = req.signedCookies?.[AUTH_COOKIE_NAME];
  if (cookieToken && typeof cookieToken === 'string') {
    return cookieToken;
  }

  // 2. Header Authorization (compatibilité clients mobiles / API publique)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
}

/**
 * Vérifie le JWT (cookie ou header).
 * Attache le payload décodé à req.user.
 * Retourne 401 si le token est absent ou invalide.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Session expirée ou non autorisée. Veuillez vous connecter.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthJwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(new AppError(401, 'UNAUTHORIZED', "Jeton d'authentification invalide ou expiré."));
  }
}

/**
 * Garde d'autorisation basée sur le rôle.
 * Doit être utilisé APRÈS requireAuth.
 * Retourne 403 si le rôle de l'utilisateur n'est pas dans la liste autorisée.
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

/** Raccourci — admin uniquement */
export const requireAdmin = [requireAuth, requireRole('admin')];

/** Raccourci — étudiant uniquement */
export const requireStudent = [requireAuth, requireRole('student')];

/** Raccourci — propriétaire uniquement */
export const requireLandlord = [requireAuth, requireRole('landlord')];

/** Raccourci — admin ou propriétaire */
export const requireAdminOrLandlord = [requireAuth, requireRole('admin', 'landlord')];
