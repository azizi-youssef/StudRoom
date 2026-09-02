'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DbUser } from '@/shared/types/database';
import { LoginValues, RegisterValues } from '@/shared/validation/auth.schema';
import { clientAuthService } from '@/client/services/auth.service';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: DbUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginValues) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterValues) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<void>;
  setSession: (token: string, user: DbUser) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'studroom_auth_token';
const USER_KEY = 'studroom_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        // Re-validate token in background
        clientAuthService.getMe(savedToken).then((res) => {
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
          } else {
            // Invalid/expired token
            logout();
          }
        }).catch(() => {
          // Keep offline session if server temporarily down
        });
      }
    } catch (e) {
      console.error('Error restoring auth state:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    try {
      const supabase = getSupabaseBrowserClient();
      supabase.auth.signOut().catch(() => {});
    } catch (e) {}
  }, []);

  const login = React.useCallback(async (credentials: LoginValues) => {
    const res = await clientAuthService.login(credentials);
    if (res.success && res.data) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser as DbUser);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
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
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser as DbUser);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return { success: true, message: res.data.message };
    }
    return {
      success: false,
      message: res.error?.message || 'Erreur lors de l’inscription. Veuillez réessayer.',
    };
  }, []);

  const setSession = React.useCallback((newToken: string, newUser: DbUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
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
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
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
