import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New semantic tokens ──────────────────────────────────────
        primary: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0891b2',
          600: '#046c7a',
          700: '#055864',
          800: '#07454f',
          900: '#042a30',
          950: '#01171b',
        },
        secondary: {
          orange:   '#f97316',
          amber:    '#d97706',
          emerald:  '#059669',
          teal:     '#0d9488',
        },
        // ── Backward-compat aliases (keep until full migration done) ─
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0891b2',
          600: '#046c7a',
          700: '#055864',
          800: '#07454f',
          900: '#042a30',
          950: '#01171b',
        },
        accent: {
          orange:  '#f97316',
          amber:   '#d97706',
          emerald: '#059669',
          teal:    '#0d9488',
        },
        surface: {
          light:  '#f8fafc',
          card:   '#ffffff',
          muted:  '#f1f5f9',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':        '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card':        '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'hover':       '0 20px 40px -8px rgba(4, 108, 122, 0.18)',
        'glass':       '0 8px 32px 0 rgba(4, 108, 122, 0.08)',
        'glow-brand':  '0 0 40px -10px rgba(8, 145, 178, 0.35)',
        'glow-accent': '0 0 35px -8px rgba(249, 115, 22, 0.30)',
        'premium':     '0 20px 50px -12px rgba(15, 23, 42, 0.12)',
        'inner-light': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float-slow':    'float 6s ease-in-out infinite',
        'pulse-subtle':  'pulseSubtle 3s ease-in-out infinite',
        'marquee':       'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.85' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
