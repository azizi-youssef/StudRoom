import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer un compte — StudRoom',
  description: 'Créez votre compte étudiant ou propriétaire StudRoom pour réserver ou proposer un logement à Selouane et Nador.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
