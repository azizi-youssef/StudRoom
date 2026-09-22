'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { AccessDenied } from './_components/access-denied';
import { clientAdminService, DashboardMetrics } from '@/client/services/admin.service';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  PlusCircle,
  Users,
  UserCheck,
  Mail,
  ShieldAlert,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Clock,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navMetrics, setNavMetrics] = useState<Pick<DashboardMetrics, 'pendingBookings' | 'unresolvedContacts'> | null>(null);

  // Fetch lightweight metrics for sidebar badges
  useEffect(() => {
    if (!isAuthenticated) return;
    clientAdminService.getDashboardData().then((res) => {
      if (res.success && res.data?.metrics) {
        setNavMetrics({
          pendingBookings: res.data.metrics.pendingBookings,
          unresolvedContacts: res.data.metrics.unresolvedContacts,
        });
      }
    }).catch(() => { /* silent — badges are non-critical */ });
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold tracking-wide">Vérification des accès administrateur…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDenied reason="unauthenticated" />;
  }

  if (user?.role !== 'admin') {
    return <AccessDenied reason="forbidden" />;
  }

  const navSections: NavSection[] = [
    {
      title: 'VUE GLOBALE',
      items: [
        { label: "Vue d'ensemble", href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'GESTION LOCATIVE',
      items: [
        { label: 'Réservations', href: '/dashboard/reservations', icon: <Calendar className="w-4 h-4" />, badge: navMetrics?.pendingBookings },
        { label: 'Visites programmées', href: '/dashboard/visites', icon: <Clock className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PARC IMMOBILIER',
      items: [
        { label: 'Tous les logements', href: '/dashboard/logements', icon: <Building2 className="w-4 h-4" /> },
        { label: 'Ajouter un logement', href: '/dashboard/logements/nouveau', icon: <PlusCircle className="w-4 h-4" /> },
      ],
    },
    {
      title: 'RELATION BAILLEURS',
      items: [
        { label: 'Propositions reçues', href: '/dashboard/bailleurs', icon: <UserCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'UTILISATEURS & SUPPORT',
      items: [
        { label: 'Gestion des comptes', href: '/dashboard/utilisateurs', icon: <Users className="w-4 h-4" /> },
        { label: 'Messages support', href: '/dashboard/support', icon: <Mail className="w-4 h-4" />, badge: navMetrics?.unresolvedContacts },
      ],
    },
    {
      title: 'SYSTÈME',
      items: [
        { label: "Journal d'audit", href: '/dashboard/audit', icon: <ShieldAlert className="w-4 h-4" /> },
        { label: 'Paramètres & Villes', href: '/dashboard/parametres', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="dashboard-theme min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] flex antialiased selection:bg-[var(--action-primary)] selection:text-white">
      {/* ── Sidebar Navigation ── */}
      <aside
        className={`fixed md:sticky top-0 self-start left-0 h-screen w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col justify-between z-40 transition-transform duration-200 ease-in-out shrink-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 overflow-y-auto scrollbar-none flex-grow">
          {/* Logo & Platform Info */}
          <div className="flex items-center justify-between mb-7 pb-4 border-b border-[var(--border-subtle)]">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] shadow-[0_0_10px_#0891b2] transition-transform group-hover:scale-125" />
              <span className="font-bold text-lg text-white tracking-tight">
                StudRoom
              </span>
            </Link>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border-default)]">
              v2.0
            </span>
          </div>

          {/* Navigation Sections */}
          <nav className="flex flex-col gap-5">
            {navSections.map((section, idx) => (
              <div key={idx}>
                <p className="text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase mb-2 px-3">
                  {section.title}
                </p>
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 group ${
                          isActive
                            ? 'bg-[var(--action-primary)] text-white shadow-[0_0_20px_rgba(109,74,255,0.20)]'
                            : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface-hover)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-[18px] h-[18px] flex items-center justify-center shrink-0 ${
                            isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                          }`}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[var(--border-default)] text-[var(--text-secondary)]'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Compact Account Preview */}
        <div className="p-3.5 mx-3 mb-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[var(--action-primary)]/20 border border-[var(--action-primary)]/40 text-[var(--action-hover)] flex items-center justify-center font-bold text-xs shrink-0">
              {user?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Administrateur'}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            title="Déconnexion"
            aria-label="Déconnexion"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Main Layout Column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Sticky Top Header ── */}
        <header className="sticky top-0 z-30 h-16 w-full admin-glass-float border-b border-[var(--border-subtle)] px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu de navigation"
              className="md:hidden p-2 rounded-xl bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Context breadcrumb / status indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider hidden sm:inline">
                StudRoom Back-Office · Selouane / Nador
              </span>
              <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider sm:hidden">
                Admin StudRoom
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-strong)] text-xs font-medium text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-muted)] transition-colors"
            >
              <span>Site public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-[var(--border-default)] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[var(--action-primary)] text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-[0_0_10px_rgba(109,74,255,0.30)]">
                {user?.full_name?.slice(0, 2).toUpperCase() || 'AD'}
              </div>
              <span className="text-xs font-semibold text-white hidden md:inline truncate max-w-[140px]">
                {user?.full_name || 'Admin'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              title="Déconnexion"
              aria-label="Déconnexion"
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ── Main Workspace Content ── */}
        <main className="flex-1 min-w-0 bg-mesh-dashboard flex flex-col pt-6 sm:pt-8 pb-16 px-4 sm:px-8 lg:px-10 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* ── Backdrop for Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}
    </div>
  );
}
