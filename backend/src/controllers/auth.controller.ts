import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, AppError } from '../lib/response';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json(
        successResponse({
          token: result.token,
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
}

export const authController = new AuthController();
