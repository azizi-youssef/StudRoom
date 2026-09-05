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
    'bg-brand-600 text-white',
    'shadow-sm',
    'hover:bg-brand-700 hover:shadow-md',
    'active:bg-brand-800'
  ),

  secondary: cn(
    'bg-brand-50 text-brand-700',
    'border border-brand-100',
    'hover:bg-brand-100 hover:border-brand-200',
    'active:bg-brand-100'
  ),

  accent: cn(
    'bg-accent-orange text-white',
    'shadow-sm',
    'hover:bg-orange-600 hover:shadow-md',
    'active:bg-orange-700'
  ),

  outline: cn(
    'bg-white text-slate-700',
    'border border-slate-200',
    'hover:bg-slate-50',
    'hover:border-slate-300',
    'hover:text-slate-900',
    'active:bg-slate-100'
  ),

  ghost: cn(
    'bg-transparent text-slate-600',
    'hover:bg-slate-100 hover:text-slate-900',
    'active:bg-slate-200'
  ),

  danger: cn(
    'bg-red-600 text-white',
    'shadow-sm',
    'hover:bg-red-700 hover:shadow-md',
    'active:bg-red-800'
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