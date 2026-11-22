import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Espace propriétaires — Proposer votre logement | StudRoom',
  description: 'Propriétaires à Selouane et Nador : confiez votre bien à StudRoom et louez à des étudiants vérifiés, sans tracas de gestion.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
