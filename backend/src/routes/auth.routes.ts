import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { loginSchema, registerSchema } from '../shared/schemas/auth.schema';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), authController.login.bind(authController));

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), authController.register.bind(authController));

// POST /api/v1/auth/google & /oauth
router.post('/google', authController.googleOAuth.bind(authController));
router.post('/oauth', authController.googleOAuth.bind(authController));

// GET /api/v1/auth/me
router.get('/me', requireAuth, authController.me.bind(authController));

// POST /api/v1/auth/logout — Efface le cookie HttpOnly côté serveur
router.post('/logout', authController.logout.bind(authController));

export default router;
