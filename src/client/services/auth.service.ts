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

  async oauthLogin(data: { email: string; fullName?: string; avatarUrl?: string; phone?: string }): Promise<AuthApiResponse> {
    return ApiClient.post<AuthApiResponse>('/auth/google', data);
  }

  /**
   * Re-validates the current JWT token against the server.
   * Called on app load to check if the saved session is still valid.
   */
  async getMe(token: string): Promise<MeApiResponse> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}

export const clientAuthService = new ClientAuthService();
