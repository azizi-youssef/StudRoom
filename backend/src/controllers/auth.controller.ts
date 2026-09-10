import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, AppError } from '../lib/response';
import { env } from '../config/env';

/** Durée de vie du cookie en ms (7 jours, identique au JWT) */
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Nom du cookie HttpOnly utilisé pour stocker le JWT */
export const AUTH_COOKIE_NAME = 'studroom_token';

/** Options communes pour les cookies d'authentification */
function cookieOptions(req: Request) {
  return {
    httpOnly: true,                          // Inaccessible depuis JavaScript côté client
    secure: env.isProd(),                    // HTTPS uniquement en production
    sameSite: 'lax' as const,               // Protection CSRF ; 'lax' permet les liens externes
    signed: true,                            // Signature HMAC via COOKIE_SECRET
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.cookie(AUTH_COOKIE_NAME, result.token, cookieOptions(req));
      res.json(
        successResponse({
          token: result.token,   // Conservé pour les clients non-navigateurs (apps mobiles, Postman)
          user: result.user,
          message: 'Connexion réussie. Bienvenue sur StudRoom !',
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      res.cookie(AUTH_COOKIE_NAME, result.token, cookieOptions(req));
      res.status(201).json(
        successResponse({
          token: result.token,
          user: result.user,
          message: 'Compte créé avec succès. Bienvenue sur StudRoom !',
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async googleOAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accessToken, email, fullName, avatarUrl, phone } = req.body;
      const result = await authService.oauthLoginOrRegister({
        accessToken,
        email,
        fullName,
        avatarUrl,
        phone,
      });
      res.cookie(AUTH_COOKIE_NAME, result.token, cookieOptions(req));
      res.json(
        successResponse({
          token: result.token,
          user: result.user,
          message: 'Connexion Google réussie. Bienvenue sur StudRoom !',
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'UNAUTHORIZED', 'Non authentifié.');
      }
      const user = await authService.getProfile(req.user.id);
      res.json(successResponse(user));
    } catch (err) {
      next(err);
    }
  }

  /**
   * Déconnexion : efface le cookie HttpOnly côté serveur.
   * Le client doit également supprimer les données en localStorage.
   */
  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: env.isProd(),
      sameSite: 'lax',
      signed: true,
      path: '/',
    });
    res.json(successResponse({ message: 'Déconnexion réussie.' }));
  }
}

export const authController = new AuthController();
