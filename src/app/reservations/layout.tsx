import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mes réservations — StudRoom',
  description: "Suivez l'état de vos demandes de réservation et de visite StudRoom.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
