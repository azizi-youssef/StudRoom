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
          ? "bg-white/90 backdrop-blur-md shadow-soft border-b border-slate-100 py-2.5"
          : "bg-white/70 backdrop-blur-sm py-3 border-b border-slate-100/50"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo with Icon & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 sm:h-14 w-52 sm:w-64 flex items-center">
            <Image
              src="/images/logo_studroom.png"
              alt="StudRoom Logo"
              width={350}
              height={140}
              priority
              className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-white text-brand-600 shadow-soft"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA & Auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-brand-50 border border-brand-100 text-slate-800">
                <div className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight">{user.full_name}</span>
                  <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wide">
                    {user.role === 'admin' ? '🛡️ Admin' : user.role === 'student' ? '🎓 Étudiant' : '🏠 Propriétaire'}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                title="Se déconnecter"
                className="text-xs border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => openAuthModal('login')}
                className="text-xs font-bold border-slate-200 hover:border-brand-300"
              >
                <LogIn className="w-4 h-4 mr-1.5 text-brand-600" />
                Se connecter
              </Button>
              <Link href="/logements">
                <Button size="md" variant="primary" className="shadow-soft text-xs font-bold">
                  Trouver mon logement
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {isAuthenticated ? (
            <Button size="sm" variant="outline" onClick={logout} className="text-xs px-2.5">
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => openAuthModal('login')} className="text-xs px-2.5">
              <User className="w-3.5 h-3.5" />
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-white border-b border-slate-200 shadow-2xl p-6 flex flex-col gap-4 animate-fade-in z-50">
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
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-brand-50 text-brand-600"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-5 h-5 text-brand-500" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/logements" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Trouver mon logement →
              </Button>
            </Link>
            <Link href="/proprietaires" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center text-slate-700">
                Proposer mon logement
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
