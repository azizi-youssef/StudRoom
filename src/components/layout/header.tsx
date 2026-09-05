'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building2, HelpCircle, Info, Key, ArrowRight, User, LogOut, LogIn, Calendar, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

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

  const navItems = [
    { label: 'Accueil', href: '/', icon: Home },
    { label: 'Logements', href: '/logements', icon: Building2 },
    { label: 'Réservations', href: '/reservations', icon: Calendar },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Propriétaires', href: '/proprietaires', icon: Key },
    { label: 'À propos', href: '/a-propos', icon: Info },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "glass-nav py-2.5 shadow-soft"
          : "bg-white/70 backdrop-blur-md py-3.5 border-b border-slate-200/40"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Icon & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 sm:h-13 w-48 sm:w-56 flex items-center">
            <Image
              src="/images/logo_studroom.png"
              alt="StudRoom Logo"
              width={350}
              height={140}
              priority
              className="h-11 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/70 shadow-inner-light">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5",
                  isActive
                    ? "bg-white text-brand-700 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                )}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-brand-50/90 border border-brand-100/90 text-slate-800 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left pr-1">
                  <span className="text-xs font-bold leading-tight">{user.full_name}</span>
                  <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider">
                    {user.role === 'admin' ? '🛡️ Admin' : user.role === 'student' ? '🎓 Étudiant' : '🏠 Propriétaire'}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                title="Se déconnecter"
                className="text-xs rounded-full border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 px-3"
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
                className="text-xs font-bold rounded-full border-slate-200/80 bg-white/80 hover:bg-white hover:border-brand-300 shadow-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5 mr-1 text-brand-600" />
                Se connecter
              </Button>
              <Link href="/logements">
                <Button size="sm" variant="primary" className="rounded-full shadow-soft hover:shadow-glow-brand text-xs font-bold gap-1 px-4 py-2 transition-all">
                  Trouver un logement
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <Button size="sm" variant="outline" onClick={logout} className="text-xs px-2.5 rounded-xl">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => openAuthModal('login')} className="text-xs px-2.5 rounded-xl">
              <User className="w-3.5 h-3.5" />
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 bg-slate-100/90 hover:bg-slate-200 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] glass-card border-b border-slate-200/80 shadow-2xl p-6 flex flex-col gap-4 animate-fade-in z-50">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                    isActive
                      ? "bg-brand-50/90 text-brand-700 font-bold border border-brand-100"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-4 h-4 text-brand-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/logements" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center rounded-2xl">
                Trouver un logement →
              </Button>
            </Link>
            <Link href="/proprietaires" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center rounded-2xl text-slate-700">
                Proposer mon logement
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
