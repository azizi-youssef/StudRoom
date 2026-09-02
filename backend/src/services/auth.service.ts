import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository';
import { LoginValues, RegisterValues } from '../shared/schemas/auth.schema';
import { env } from '../config/env';
import { AppError } from '../lib/response';
import { DbUser } from '../shared/types/database';

export interface AuthResult {
  token: string;
  user: Omit<DbUser, 'password_hash'>;
}

export class AuthService {
  async login(credentials: LoginValues): Promise<AuthResult> {
    const { email, password } = credentials;
    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.password_hash) {
      throw new AppError(401, 'UNAUTHORIZED', 'Identifiants incorrects (email ou mot de passe).');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError(401, 'UNAUTHORIZED', 'Identifiants incorrects (email ou mot de passe).');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async register(data: RegisterValues): Promise<AuthResult> {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) {
      throw new AppError(409, 'VALIDATION_ERROR', 'Un compte existe déjà avec cette adresse email.');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const user = await authRepository.createUser({
      email: data.email,
      role: data.role,
      full_name: data.fullName,
      phone: data.phone,
      password_hash,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async oauthLoginOrRegister(data: {
    email: string;
    fullName?: string;
    avatarUrl?: string;
    phone?: string;
  }): Promise<AuthResult> {
    if (!data.email) {
      throw new AppError(400, 'VALIDATION_ERROR', 'Adresse email requise pour l’authentification OAuth.');
    }

    let user = await authRepository.findUserByEmail(data.email);

    if (!user) {
      user = await authRepository.createOAuthUser({
        email: data.email,
        full_name: data.fullName || data.email.split('@')[0],
        phone: data.phone,
        role: 'student',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...safeUser } = user;
    return { token, user: safeUser };
  }

  async getProfile(userId: string): Promise<Omit<DbUser, 'password_hash'>> {
    const user = await authRepository.findUserById(userId);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Utilisateur introuvable.');
    }
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
