import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/forms/auth-modal';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://studroom.ma'),
  title: 'StudRoom — Ton logement étudiant à Selouane / Nador',
  description: 'StudRoom est la marque de logement étudiant au Maroc. Des studios et appartements meublés, ultra-connectés, proches de FPN, EST et ISTA Selouane.',
  keywords: [
    'logement étudiant Nador',
    'logement étudiant Selouane',
    'chambre étudiant Selouane',
    'appartement meublé Al Omrane',
    'FPN Selouane logement',
    'EST Nador logement',
    'StudRoom Maroc',
  ],
  icons: {
    icon: '/images/StudRoom_icon.png',
    shortcut: '/images/StudRoom_icon.png',
    apple: '/images/StudRoom_icon.png',
  },
  openGraph: {
    title: 'StudRoom — Student living, made simple.',
    description: 'Logements étudiants meublés et ultra-connectés à Selouane / Nador.',
    url: 'https://studroom.ma',
    siteName: 'StudRoom',
    images: [
      {
        url: '/images/logo_studroom.png',
        width: 800,
        height: 600,
        alt: 'StudRoom Logo',
      },
    ],
    locale: 'fr_MA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="font-sans bg-surface-light text-slate-900 flex flex-col min-h-screen antialiased">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
