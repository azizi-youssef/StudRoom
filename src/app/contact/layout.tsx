import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — StudRoom, WhatsApp, email et bureau à Selouane',
  description: "Contactez l'équipe StudRoom par WhatsApp, email ou en visitant notre bureau d'accueil à Selouane. Réponse rapide, visites sur rendez-vous.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
