import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos — StudRoom, logement étudiant à Selouane',
  description: "Découvrez la mission, l'équipe et les valeurs de StudRoom, le logement étudiant meublé et connecté à Selouane et Nador.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
