import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Scale,
  Lock,
  Server,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mentions Légales & CGU — StudRoom Maroc',
  description: 'Informations légales, conditions générales d’utilisation et cadre réglementaire de la plateforme StudRoom.',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center sm:text-left mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80 shadow-2xs mb-4">
            <Scale className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            Cadre Réglementaire & Transparence
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Mentions Légales & <br />
            <span className="bg-gradient-to-r from-primary-600 via-teal-600 to-accent-orange bg-clip-text text-transparent">
              Conditions Générales d'Utilisation
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Conformément aux lois et réglementations en vigueur au Royaume du Maroc régissant le commerce électronique, l'édition de services numériques et le droit du bail d'habitation.
          </p>
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Dernière mise à jour : Septembre 2026
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8">
          {/* Section 1: Éditeur du site */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 border border-primary-200/80 dark:border-primary-800/80 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  1. Éditeur de la Plateforme
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Identification légale de la marque et exploitant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Siège social</strong>
                  Al Omrane, Selouane, Province de Nador, Région de l'Oriental, Royaume du Maroc.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Ligne d'assistance</strong>
                  <a href="tel:+212634536286" className="text-primary-600 dark:text-primary-400 hover:underline">
                    +212 634 536 286
                  </a> (Disponible 7j/7)
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Email officiel</strong>
                  <a href="mailto:studroom50@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                    studroom50@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">Statut & Activité</strong>
                  Plateforme technologique de mise en relation et de gestion locative d'espaces étudiants meublés.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Hébergement et infrastructure */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200/80 dark:border-cyan-800/80 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  2. Hébergement & Sécurité Technique
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Infrastructures serveurs et données</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Le site <strong>studroom.ma</strong> est propulsé par une infrastructure cloud moderne et hautement sécurisée :
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span><strong>Hébergement Frontend & CDN :</strong> Déploiement Next.js sur réseau de diffusion mondial sécurisé avec chiffrement SSL/TLS (HTTPS).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span><strong>Base de données & Authentification :</strong> Infrastructure cloud gérée avec Row Level Security (RLS), certificats cryptographiques et stockage sécurisé des données applicatives.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: CGU et Conditions Locatives */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/80 border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  3. Conditions Générales d'Utilisation (CGU)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Règles applicables aux étudiants et aux bailleurs</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">3.1. Objet du Service</h3>
                <p>
                  StudRoom met à disposition des étudiants inscrits ou en cours d'inscription dans les établissements d'enseignement supérieur (FPN, FSAN, FEGN, ESTN, ISTA, etc.) une sélection de logements vérifiés, meublés et équipés. StudRoom permet la consultation des fiches techniques, la réservation en ligne et l'assistance contractuelle.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">3.2. Bail étudiant officiel & 0 DH de frais cachés</h3>
                <p>
                  Chaque location donne lieu à l'établissement d'un bail de location écrit, en conformité avec la législation marocaine régissant les baux d'habitation (Loi n° 67-12). StudRoom applique une politique stricte de <strong>0 DH de frais d'agence cachés</strong> pour l'étudiant.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">3.3. Engagements du Locataire</h3>
                <p>
                  L'étudiant locataire s'engage à utiliser le logement en bon père de famille, à respecter le règlement intérieur de l'immeuble ou de la résidence, à préserver le calme propice aux études, et à s'acquitter ponctuellement des loyers convenus.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">3.4. Engagements du Propriétaire / Bailleur</h3>
                <p>
                  Les bailleurs partenaires s'engagent à fournir des logements conformes aux descriptions, décents, sécurisés, avec accès opérationnel aux équipements promis (mobilier complet, installations sanitaires, connexion Internet haut débit).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Propriété Intellectuelle */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  4. Propriété Intellectuelle
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Protection de la marque et des contenus</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              L'ensemble des éléments constituant le site <strong>StudRoom</strong> (textes, graphismes, logos, images, icônes, animations, vidéos, arborescence, système de design et code source) est la propriété exclusive de StudRoom Maroc ou fait l'objet d'une autorisation d'utilisation régulière. Toute reproduction, représentation, modification ou diffusion, intégrale ou partielle, est strictement interdite sans accord préalable écrit.
            </p>
          </div>

          {/* Section 5: Droit Applicable et Juridiction */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200/80 dark:border-purple-800/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  5. Droit Applicable & Résolution des Litiges
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Compétence juridictionnelle</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Les présentes mentions légales et conditions d'utilisation sont soumises au <strong>droit marocain</strong>. En cas de réclamation ou de désaccord, les parties s'engagent à privilégier une solution amiable auprès de notre service d'assistance. À défaut d'accord amiable, compétence expresse est attribuée aux <strong>tribunaux compétents de la Province de Nador</strong>.
            </p>
          </div>

          {/* Need help box */}
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-teal-600 text-white p-6 sm:p-8 shadow-glow-primary flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Une question sur les conditions ?</h3>
                <p className="text-sm text-primary-100">Notre équipe est à votre écoute 7j/7 pour vous orienter.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-primary-700 font-bold text-sm hover:bg-primary-50 transition-colors shadow-md whitespace-nowrap"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
