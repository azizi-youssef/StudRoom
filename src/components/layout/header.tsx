'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, HelpCircle, Info, Key, ArrowRight, User, LogOut, LogIn, Calendar, LayoutDashboard, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = useCallback(() => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 200);
  }, []);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  // Déterminer l'URL de l'avatar selon la priorité spécifiée
  const getAvatarUrl = () => {
    if (!user) return null;
    
    // 1. Photo personnalisée enregistrée dans le profil utilisateur
    if (user.avatar_url) return user.avatar_url;
    
    // 2-3. Pour les utilisateurs Google, on pourrait vérifier les métadonnées Supabase
    // mais cette logique est déjà gérée dans le contexte d'authentification
    // qui synchronise avatar_url depuis user_metadata lors de la restauration de session
    
    return null; // Fallback vers l'initiale
  };

  const getInitials = () => {
    if (!user?.full_name) return 'U';
    return user.full_name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation principale affichée dans la pill desktop (max 5 items)
  const mainNavItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Logements', href: '/logements', icon: Building2 },
    ...(isAuthenticated && user?.role === 'admin'
      ? [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
      : []),
    { label: 'Propriétaires', href: '/proprietaires', icon: Key },
    { label: 'À propos', href: '/a-propos', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  // Navigation complète affichée dans le menu mobile (tous les liens)
  const allNavItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Logements', href: '/logements', icon: Building2 },
    { label: 'Réservations', href: '/reservations', icon: Calendar },
    ...(isAuthenticated && user?.role === 'admin'
      ? [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
      : []),
    { label: 'Propriétaires', href: '/proprietaires', icon: Key },
    { label: 'À propos', href: '/a-propos', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "glass-nav py-2.5 shadow-soft"
          : "bg-white/75 dark:bg-slate-950/80 backdrop-blur-md py-3.5 border-b border-slate-200/40 dark:border-slate-800/70"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Icon & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 sm:h-13 w-48 sm:w-56 flex items-center">
            <Image
              src="/images/logo_StudRoom1.png"
              alt="StudRoom Logo"
              width={350}
              height={140}
              priority
              className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105 dark:brightness-110"
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/70 dark:border-slate-800/80 shadow-inner-light">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5",
                  isActive
                    ? "bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60"
                )}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA, Theme & Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Theme Switcher */}
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' ? (
                <Link
                  href="/dashboard"
                  title="Accéder au tableau de bord administrateur"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary-50/90 dark:bg-primary-950/60 hover:bg-primary-100/90 dark:hover:bg-primary-900/60 border border-primary-200/90 dark:border-primary-800/80 text-slate-800 dark:text-slate-100 shadow-xs transition-colors"
                >
                  <Avatar
                    src={getAvatarUrl()}
                    alt={user.full_name}
                    fallback={getInitials()}
                    size="md"
                  />
                  <div className="flex flex-col text-left pr-1">
                    <span className="text-xs font-bold leading-tight">{user.full_name}</span>
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider">
                      🛡️ Admin (Dashboard)
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary-50/90 dark:bg-primary-950/60 border border-primary-100/90 dark:border-primary-800/80 text-slate-800 dark:text-slate-100 shadow-xs">
                  <Avatar
                    src={getAvatarUrl()}
                    alt={user.full_name}
                    fallback={getInitials()}
                    size="md"
                  />
                  <div className="flex flex-col text-left pr-1">
                    <span className="text-xs font-bold leading-tight">{user.full_name}</span>
                    <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold uppercase tracking-wider">
                      {user.role === 'student' ? '🎓 Étudiant' : '🏠 Propriétaire'}
                    </span>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLogoutConfirmOpen(true)}
                title="Se déconnecter"
                className="text-xs rounded-full border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200/90 px-3 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal('login')}
                className="text-xs font-bold rounded-full border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-primary-50/40 dark:hover:bg-primary-950/40 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-300 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all px-3.5 py-2"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5 text-primary-600 dark:text-primary-400" />
                Se connecter
              </Button>
              <Link href="/logements">
                <Button
                  size="sm"
                  variant="primary"
                  className="group rounded-full shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/35 text-xs font-bold gap-1.5 px-4 py-2 hover:-translate-y-0.5 active:scale-95 transition-all"
                >
                  <span>Trouver un logement</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              title="Se déconnecter"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 shadow-xs hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 active:scale-95 transition-all"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              title="Se connecter"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs hover:border-primary-300 hover:bg-primary-50/50 active:scale-95 transition-all"
            >
              <User className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-xs hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-600 active:scale-95 transition-all"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-primary-600 dark:text-primary-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {(mobileMenuOpen || isMenuClosing) && (
        <div
          className={cn(
            "md:hidden fixed inset-x-0 top-[60px] glass-card dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-4 z-50 transition-all duration-200",
            isMenuClosing
              ? "opacity-0 -translate-y-2 pointer-events-none"
              : "opacity-100 translate-y-0 animate-fade-in"
          )}
        >
          <div className="flex flex-col gap-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMobileMenu()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-primary-50/90 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-bold border border-primary-100 dark:border-primary-800/60 shadow-2xs"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                  )}
                >
                  <Icon className="w-4 h-4 text-primary-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Theme Mode Option in Mobile Menu */}
          <div className="py-2 px-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Thème d'affichage
            </span>
            <ThemeToggle variant="segmented" />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <Link href="/logements" onClick={() => closeMobileMenu()} className="w-full">
              <Button
                variant="primary"
                className="group w-full h-11 justify-center rounded-xl text-sm font-bold shadow-md shadow-primary-600/25 gap-2"
              >
                <span>Trouver un logement</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/proprietaires" onClick={() => closeMobileMenu()} className="w-full">
              <Button
                variant="outline"
                className="w-full h-11 justify-center rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-primary-300 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 shadow-2xs"
              >
                <Key className="w-4 h-4 text-amber-500" />
                Proposer mon logement
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button
                variant="secondary"
                onClick={() => {
                  closeMobileMenu();
                  openAuthModal('login');
                }}
                className="w-full h-11 justify-center rounded-xl text-sm font-semibold gap-2 mt-0.5 shadow-2xs dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              >
                <LogIn className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                Se connecter / Créer un compte
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Dialog Déconnexion */}
      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter de votre compte StudRoom ?"
        confirmLabel="Se déconnecter"
        cancelLabel="Rester connecté"
        variant="danger"
        icon="logout"
        onConfirm={() => {
          setLogoutConfirmOpen(false);
          logout();
        }}
        onCancel={() => setLogoutConfirmOpen(false)}
      />
    </header>
  );
}
