'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, Theme } from '@/context/theme-context';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'segmented';
}

export function ThemeToggle({ className, variant = 'button' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    // Avoid hydration mismatch by rendering placeholder with matching dimensions
    return (
      <div className={cn("w-9 h-9 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60", className)} />
    );
  }

  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
      { value: 'light', label: 'Clair', icon: Sun },
      { value: 'dark', label: 'Sombre', icon: Moon },
      { value: 'system', label: 'Auto', icon: Laptop },
    ];

    return (
      <div className={cn("inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80", className)}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200",
                isSelected
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleTheme();
        }}
        aria-label="Changer de thème (Mode clair / sombre)"
        title={`Thème actuel : ${theme === 'dark' ? 'Sombre' : theme === 'light' ? 'Clair' : 'Automatique'}. Cliquez pour choisir.`}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 shadow-xs active:scale-95",
          resolvedTheme === 'dark'
            ? "border-slate-800 bg-slate-900/90 text-amber-400 hover:border-amber-400/50 hover:bg-slate-800 hover:shadow-amber-500/10 hover:shadow-md"
            : "border-slate-200/90 bg-white/90 text-slate-700 hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-600 hover:shadow-md",
          className
        )}
      >
        <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
          <Sun
            className={cn(
              "w-4 h-4 transition-all duration-300 absolute",
              resolvedTheme === 'dark'
                ? "scale-100 rotate-0 opacity-100"
                : "scale-0 rotate-90 opacity-0"
            )}
          />
          <Moon
            className={cn(
              "w-4 h-4 transition-all duration-300 absolute text-slate-700",
              resolvedTheme === 'dark'
                ? "scale-0 -rotate-90 opacity-0"
                : "scale-100 rotate-0 opacity-100"
            )}
          />
        </div>
      </button>

      {/* Theme Selection Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl p-1.5 z-50 animate-fade-in text-xs font-medium">
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Mode d'affichage
          </div>
          
          <button
            type="button"
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors",
              theme === 'light'
                ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-950/60 dark:text-brand-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Mode clair</span>
            </div>
            {theme === 'light' && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors",
              theme === 'dark'
                ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-950/60 dark:text-brand-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mode sombre</span>
            </div>
            {theme === 'dark' && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors",
              theme === 'system'
                ? "bg-brand-50 text-brand-700 font-bold dark:bg-brand-950/60 dark:text-brand-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              <span>Système (Auto)</span>
            </div>
            {theme === 'system' && <Check className="w-3.5 h-3.5 text-brand-600" />}
          </button>
        </div>
      )}
    </div>
  );
}
