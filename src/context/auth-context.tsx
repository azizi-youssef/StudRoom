'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DbUser } from '@/shared/types/database';
import { LoginValues, RegisterValues } from '@/shared/validation/auth.schema';
import { clientAuthService } from '@/client/services/auth.service';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { USER_STORAGE_KEY } from '@/client/services/api-client';

interface AuthContextType {
  user: DbUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginValues) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterValues) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<void>;
  setSession: (user: DbUser) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  /**
   * Au chargement de l'application :
   * 1. Récupération rapide de l'utilisateur depuis localStorage (affichage immédiat sans flash)
   * 2. Re-validation silencieuse de la session via le cookie HttpOnly (/auth/me)
   *    - Si valide → met à jour l'état utilisateur
   *    - Si invalide → logout propre (cookie expiré ou révoqué)
   *
   * Note : le JWT lui-même n'est JAMAIS lu depuis localStorage. Seul l'objet user
   * (données non sensibles) y est mis en cache pour l'affichage UI instantané.
   */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Affichage rapide depuis le cache local (données non sensibles uniquement)
        const cachedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        // Re-validation cryptographique via le cookie HttpOnly (envoyé automatiquement)
        const res = await clientAuthService.getMe();
        if (res.success && res.data) {
          setUser(res.data as DbUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
        } else {
          // Cookie expiré ou révoqué — nettoyer l'état
          clearLocalState();
        }
      } catch {
        // Serveur temporairement indisponible — garder la session locale affichée
        // sans déconnecter l'utilisateur (UX dégradée mais non cassée)
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const clearLocalState = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const logout = React.useCallback(async () => {
    // 1. Efface le cookie HttpOnly côté serveur
    await clientAuthService.logout();

    // 2. Nettoie l'état local et le cache
    clearLocalState();

    // 3. Déconnecte aussi Supabase (OAuth Google)
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.signOut().catch(() => {});
    } catch {}
  }, []);

  const login = React.useCallback(async (credentials: LoginValues) => {
    const res = await clientAuthService.login(credentials);
    if (res.success && res.data) {
      const { user: newUser } = res.data;
      setUser(newUser as DbUser);
      // Stocke uniquement les données user (non-sensibles) pour l'affichage rapide
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return { success: true, message: res.data.message };
    }
    return {
      success: false,
      message: res.error?.message || 'Identifiants incorrects. Veuillez réessayer.',
    };
  }, []);

  const register = React.useCallback(async (data: RegisterValues) => {
    const res = await clientAuthService.register(data);
    if (res.success && res.data) {
      const { user: newUser } = res.data;
      setUser(newUser as DbUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return { success: true, message: res.data.message };
    }
    return {
      success: false,
      message: res.error?.message || "Erreur lors de l'inscription. Veuillez réessayer.",
    };
  }, []);

  /**
   * Appelé après un callback OAuth réussi.
   * Permet à la page /auth/callback de mettre à jour l'état sans recharger la page.
   */
  const setSession = React.useCallback((newUser: DbUser) => {
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const loginWithGoogle = React.useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const redirectTo = `${origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Error during Google sign in:', err);
      throw err;
    }
  }, []);

  const openAuthModal = React.useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = React.useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        setSession,
        logout,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
