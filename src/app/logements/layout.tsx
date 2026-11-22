import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logements étudiants à Selouane et Nador — Catalogue StudRoom',
  description: 'Parcourez les studios, chambres et colocations meublés vérifiés près de FSAN, FEGN, FSJPN, FLLAN, EST et ISTA. Filtres par budget, campus et disponibilité.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
