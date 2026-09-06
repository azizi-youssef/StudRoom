import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const baseStyles = cn(
  'inline-flex items-center justify-center',
  'font-semibold whitespace-nowrap',
  'rounded-xl',
  'transition-all duration-200 ease-out',
  'select-none',
  'focus-visible:outline-none',
  'focus-visible:ring-2',
  'focus-visible:ring-brand-500',
  'focus-visible:ring-offset-2',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  'active:scale-[0.98]'
);

const variants = {
  primary: cn(
    'bg-gradient-to-r from-brand-600 via-brand-600 to-brand-500 text-white',
    'shadow-sm shadow-brand-600/25',
    'hover:shadow-md hover:shadow-brand-600/35 hover:-translate-y-0.5 hover:brightness-105',
    'active:translate-y-0 active:scale-[0.98]'
  ),

  secondary: cn(
    'bg-brand-50/90 text-brand-700',
    'border border-brand-200/80',
    'hover:bg-brand-100 hover:border-brand-300 hover:text-brand-800 hover:shadow-xs',
    'active:bg-brand-100 active:scale-[0.98]'
  ),

  accent: cn(
    'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    'shadow-sm shadow-orange-500/25',
    'hover:from-orange-600 hover:to-amber-600 hover:shadow-md hover:shadow-orange-500/35 hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98]'
  ),

  outline: cn(
    'bg-white text-slate-700',
    'border border-slate-200/90 shadow-2xs',
    'hover:bg-slate-50/80 hover:border-slate-300 hover:text-slate-900 hover:shadow-xs hover:-translate-y-0.5',
    'active:bg-slate-100 active:translate-y-0 active:scale-[0.98]'
  ),

  ghost: cn(
    'bg-transparent text-slate-600',
    'hover:bg-slate-100 hover:text-slate-900',
    'active:bg-slate-200 active:scale-[0.98]'
  ),

  danger: cn(
    'bg-red-600 text-white',
    'shadow-sm shadow-red-600/20',
    'hover:bg-red-700 hover:shadow-md hover:shadow-red-600/30 hover:-translate-y-0.5',
    'active:translate-y-0 active:scale-[0.98]'
  ),
};

const sizes = {
  sm: 'h-9 px-3 text-xs gap-1.5 rounded-lg',

  md: 'h-11 px-5 text-sm gap-2',

  lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',

  icon: 'h-10 w-10 p-0 rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';