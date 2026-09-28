'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { AccessDenied } from './_components/access-denied';
import { clientAdminService, DashboardMetrics } from '@/client/services/admin.service';
import { Avatar } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
  Bell,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  User,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

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
  const { resolvedTheme } = useTheme();

  const getAvatarUrl = () => {
    if (!user) return null;
    if (user.avatar_url) return user.avatar_url;
    return null;
  };

  const getInitials = () => {
    if (!user?.full_name) return 'AD';
    const parts = user.full_name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navMetrics, setNavMetrics] = useState<Pick<DashboardMetrics, 'pendingBookings' | 'unresolvedContacts' | 'newProposals'> | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Breadcrumb label from pathname
  const getBreadcrumb = () => {
    const map: Record<string, string> = {
      '/dashboard': "Vue d'ensemble",
      '/dashboard/reservations': 'Réservations',
      '/dashboard/visites': 'Visites programmées',
      '/dashboard/logements': 'Logements',
      '/dashboard/logements/nouveau': 'Nouveau logement',
      '/dashboard/bailleurs': 'Propositions propriétaires',
      '/dashboard/utilisateurs': 'Gestion des comptes',
      '/dashboard/support': 'Support & Messages',
      '/dashboard/audit': "Journal d'audit",
      '/dashboard/parametres': 'Paramètres',
    };
    return map[pathname] ?? 'Tableau de bord';
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isAuthenticated) return;
    clientAdminService.getDashboardData().then((res) => {
      if (res.success && res.data?.metrics) {
        setNavMetrics({
          pendingBookings: res.data.metrics.pendingBookings,
          unresolvedContacts: res.data.metrics.unresolvedContacts,
          newProposals: res.data.metrics.newProposals,
        });
      }
    }).catch(() => { /* silent */ });
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-[3px] border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-[var(--text-secondary)] tracking-wide">
            Vérification des accès…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <AccessDenied reason="unauthenticated" />;
  if (user?.role !== 'admin') return <AccessDenied reason="forbidden" />;

  const navSections: NavSection[] = [
    {
      title: 'VUE GLOBALE',
      items: [
        { label: "Vue d'ensemble", href: '/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      title: 'GESTION LOCATIVE',
      items: [
        { label: 'Réservations', href: '/dashboard/reservations', icon: <Calendar className="w-[18px] h-[18px]" />, badge: navMetrics?.pendingBookings },
        { label: 'Visites programmées', href: '/dashboard/visites', icon: <Clock className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      title: 'PARC IMMOBILIER',
      items: [
        { label: 'Tous les logements', href: '/dashboard/logements', icon: <Building2 className="w-[18px] h-[18px]" /> },
        { label: 'Ajouter un logement', href: '/dashboard/logements/nouveau', icon: <PlusCircle className="w-[18px] h-[18px]" /> },
      ],
    },
    {
      title: 'RELATION PROPRIÉTAIRES',
      items: [
        { label: 'Propositions', href: '/dashboard/bailleurs', icon: <UserCheck className="w-[18px] h-[18px]" />, badge: navMetrics?.newProposals },
      ],
    },
    {
      title: 'UTILISATEURS & SUPPORT',
      items: [
        { label: 'Gestion des comptes', href: '/dashboard/utilisateurs', icon: <Users className="w-[18px] h-[18px]" /> },
        { label: 'Messages support', href: '/dashboard/support', icon: <Mail className="w-[18px] h-[18px]" />, badge: navMetrics?.unresolvedContacts },
      ],
    },
    {
      title: 'SYSTÈME',
      items: [
        { label: "Journal d'audit", href: '/dashboard/audit', icon: <ShieldAlert className="w-[18px] h-[18px]" /> },
        { label: 'Paramètres', href: '/dashboard/parametres', icon: <Settings className="w-[18px] h-[18px]" /> },
      ],
    },
  ];

  return (
    <div className={`dashboard-theme min-h-screen flex antialiased ${resolvedTheme === 'light' ? 'light' : ''}`}
      style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>

      {/* ── Sidebar ── */}
      <aside
        id="admin-sidebar"
        role="navigation"
        aria-label="Menu principal"
        className={`sidebar fixed md:sticky top-0 self-start left-0 h-screen flex flex-col z-40 transition-transform duration-200 ease-in-out shrink-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ width: '248px' }}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-default)' }}>
          <Link href="/dashboard" className="flex items-center group">
            <div className="relative h-10 w-40">
              <Image
                src="/images/logo_StudRoom1.png"
                alt="StudRoom"
                width={400}
                height={140}
                priority
                className="h-10 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </div>
          </Link>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
            style={{
              background: 'var(--brand-bg)',
              color: 'var(--brand-primary)',
              border: '1px solid rgba(14,165,198,0.2)',
            }}>
            v2.0
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto scrollbar-none px-3 py-4 flex flex-col gap-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}>
                {section.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150 group
                        ${isActive ? 'sidebar-active' : 'sidebar-hover text-[var(--text-secondary)]'}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`flex items-center justify-center shrink-0 transition-colors
                          ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums
                          ${isActive
                            ? 'bg-[var(--brand-primary)] text-white'
                            : 'badge-warning'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3" style={{ borderTop: '1px solid var(--border-default)' }}>
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg" style={{ background: 'var(--bg-surface-hover)' }}>
            <Avatar
              src={getAvatarUrl()}
              alt={user?.full_name || 'Admin'}
              fallback={getInitials()}
              size="sm"
              className="shrink-0"
              fallbackBgClass="bg-[var(--brand-bg)]"
              fallbackClassName="text-[var(--brand-primary)] font-bold"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {user?.full_name || 'Administrateur'}
              </p>
              <p className="text-[10px] truncate font-mono" style={{ color: 'var(--text-muted)' }}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={() => setLogoutConfirmOpen(true)}
              title="Déconnexion"
              aria-label="Déconnexion"
              className="p-1.5 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Header ── */}
        <header className="admin-header sticky top-0 z-30 h-[60px] w-full px-6 flex items-center justify-between shrink-0">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-sidebar"
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-hover)' }}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-[13px]">
              <span style={{ color: 'var(--text-muted)' }}>StudRoom</span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {getBreadcrumb()}
              </span>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="border-0 bg-transparent" />

            {/* Site public */}
            <Link
              href="/"
              target="_blank"
              title="Voir le site public"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors"
              style={{
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface-hover)',
                border: '1px solid var(--border-default)',
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Site public
            </Link>

            {/* Help */}
            <button
              title="Aide"
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)' }}
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                title="Notifications"
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-hover)', border: '1px solid var(--border-default)' }}
              >
                <Bell className="w-4 h-4" />
              </button>
              {(navMetrics?.pendingBookings ?? 0) + (navMetrics?.unresolvedContacts ?? 0) + (navMetrics?.newProposals ?? 0) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--warning)]" />
              )}
            </div>

            <div className="w-px h-5 mx-1" style={{ background: 'var(--border-default)' }} />

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[var(--bg-subtle)] transition-all cursor-pointer"
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="rounded-full border-2" style={{ borderColor: 'var(--brand-bg-strong)' }}>
                  <Avatar
                    src={getAvatarUrl()}
                    alt={user?.full_name || 'Admin'}
                    fallback={getInitials()}
                    size="sm"
                    fallbackBgClass="bg-[var(--brand-bg)]"
                    fallbackClassName="text-[var(--brand-primary)] font-bold"
                  />
                </div>
                <span className="hidden md:block text-[13px] font-semibold truncate max-w-[140px]"
                  style={{ color: 'var(--text-primary)' }}>
                  {user?.full_name || 'Admin'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 hidden md:block ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                  style={{ color: 'var(--text-muted)' }}
                />
              </button>

              {/* Dropdown Menu Panel */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 dash-card rounded-2xl shadow-xl border overflow-hidden animate-fade-in z-50"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  {/* User Info Header */}
                  <div
                    className="p-3.5 border-b"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {user?.full_name || 'Administrateur'}
                    </p>
                    <p className="text-[11px] truncate font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {user?.email}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider badge-primary">
                      {user?.role === 'admin' ? '🛡️ Administrateur' : user?.role === 'landlord' ? '🏠 Bailleur' : '🎓 Étudiant'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <Link
                      href="/dashboard/parametres"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-2 text-xs font-medium rounded-xl hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Settings className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      Paramètres & Données
                    </Link>

                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setUserDropdownOpen(false)}
                      className="px-3 py-2 text-xs font-medium rounded-xl hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--brand-primary)' }} />
                      Voir le site public
                    </Link>

                    <div className="my-1 border-t" style={{ borderColor: 'var(--border-subtle)' }} />

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setLogoutConfirmOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-2"
                      style={{ color: 'var(--error-fg)' }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 bg-mesh-dashboard overflow-y-auto"
          style={{ padding: '32px 40px' }}>
          <div className="w-full max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Confirmation Dialog pour la Déconnexion */}
      <ConfirmDialog
        open={logoutConfirmOpen}
        title="Confirmer la déconnexion"
        description="Êtes-vous sûr de vouloir vous déconnecter de votre session d'administration StudRoom ?"
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
    </div>
  );
}
