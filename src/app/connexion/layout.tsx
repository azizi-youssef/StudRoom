import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion — StudRoom',
  description: 'Connectez-vous à votre espace StudRoom pour suivre vos réservations et vos demandes de visite.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
