import { ApiClient } from './api-client';
import { LoginValues, RegisterValues } from '@/shared/validation/auth.schema';
import { DbUser } from '@/shared/types/database';
import { ApiResponse } from '@/shared/types/error';

export type AuthData = {
  token: string;
  user: Omit<DbUser, 'password_hash'>;
  message?: string;
};

export type AuthApiResponse = ApiResponse<AuthData>;
export type MeApiResponse = ApiResponse<Omit<DbUser, 'password_hash'>>;

export class ClientAuthService {
  async login(credentials: LoginValues): Promise<AuthApiResponse> {
    return ApiClient.post<AuthApiResponse>('/auth/login', credentials);
  }

  async register(data: RegisterValues): Promise<AuthApiResponse> {
    return ApiClient.post<AuthApiResponse>('/auth/register', data);
  }

  async oauthLogin(data: {
    accessToken?: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    phone?: string;
  }): Promise<AuthApiResponse> {
    return ApiClient.post<AuthApiResponse>('/auth/google', data);
  }

  /**
   * Re-valide la session courante via le cookie HttpOnly.
   * Aucun token n'est passé — le cookie est envoyé automatiquement par le navigateur
   * grâce à credentials: 'include' dans fetchWithTimeout.
   */
  async getMe(): Promise<MeApiResponse> {
    return ApiClient.authGet<MeApiResponse>('/auth/me');
  }

  /**
   * Demande au serveur d'effacer le cookie HttpOnly.
   * Doit être appelé lors de la déconnexion pour invalider la session côté serveur.
   */
  async logout(): Promise<void> {
    try {
      await ApiClient.post<void>('/auth/logout', {});
    } catch {
      // Ignorer les erreurs réseau lors du logout — on nettoie quand même côté client
    }
  }
}

export const clientAuthService = new ClientAuthService();
