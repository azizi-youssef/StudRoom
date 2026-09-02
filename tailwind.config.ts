import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0891b2', // Bleu canard vibrant
          600: '#046c7a', // Bleu canard signature StudRoom
          700: '#055864',
          800: '#07454f',
          900: '#042a30',
          950: '#01171b',
        },
        accent: {
          orange: '#f97316',
          amber: '#d97706',
          emerald: '#059669',
          teal: '#0d9488',
        },
        surface: {
          light: '#f8fafc',
          card: '#ffffff',
          muted: '#f1f5f9',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'card': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'hover': '0 20px 40px -8px rgba(4, 108, 122, 0.18)',
        'glass': '0 8px 32px 0 rgba(4, 108, 122, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
export default config;
