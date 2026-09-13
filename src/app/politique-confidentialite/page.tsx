import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck,
  Database,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — StudRoom Maroc',
  description: 'Protection des données personnelles, conformité CNDP Loi 09-08 et engagement de confidentialité StudRoom.',
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shadow-2xs mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Protection des Données Personnelles
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Politique de <br />
            <span className="bg-gradient-to-r from-emerald-600 via-primary-600 to-teal-500 bg-clip-text text-transparent">
              Confidentialité & Données
            </span>
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Chez StudRoom, la protection de votre vie privée et de vos données personnelles est une priorité absolue. Nous appliquons rigoureusement la <strong>Loi n° 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (CNDP Maroc).
          </p>
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Dernière mise à jour : Septembre 2026
          </div>
        </div>

        {/* Content Cards */}
        <div className="flex flex-col gap-8">
          {/* Section 1: Principes directeurs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  1. Nos Engagements Fondamentaux
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Transparence, sobriété et sécurité</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                <div className="text-primary-600 dark:text-primary-400 font-bold text-sm mb-1">0 Vente de données</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Vos coordonnées ne sont jamais vendues, cédées ou louées à des régies publicitaires tierces.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">Chiffrement SSL/TLS</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Toutes les transmissions sont sécurisées par chiffrement HTTPS de bout en bout et cookies HttpOnly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80">
                <div className="text-orange-600 dark:text-orange-400 font-bold text-sm mb-1">Droit d'accès & suppression</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Vous pouvez à tout moment solliciter la consultation, modification ou suppression de vos données.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Données collectées */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 border border-primary-200/80 dark:border-primary-800/80 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  2. Quelles Données Collectons-nous ?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Nature des données traitées par le service</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Nous recueillons uniquement les données strictement nécessaires au bon déroulement de votre parcours locatif :
              </p>
              <ul className="space-y-2 mt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Identité & contact :</strong> Nom, prénom, adresse email, numéro de téléphone WhatsApp ou appel.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Profil académique :</strong> Université ou école de rattachement (FPN, FSAN, ESTN, ISTA, etc.), cursus ou année d'étude.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Dossier de réservation :</strong> Date d'entrée souhaitée, type de logement (studio, colocation), pièces d'identité et justificatifs nécessaires à l'établissement du bail officiel légalisé.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Données techniques de connexion :</strong> Adresse IP, type de navigateur, logs applicatifs nécessaires à la prévention des fraudes et à la stabilité du service.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Finalités du traitement */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  3. Finalités des Traitements
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pourquoi utilisons-nous ces informations ?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Gestion des réservations</strong>
                Vérification de la disponibilité des logements, transmission des demandes aux propriétaires et préparation des contrats de bail.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Support & Assistance 7j/7</strong>
                Répondre à vos questions, organiser les visites physiques et intervenir rapidement en cas d'incident technique.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Sécurité & Authentification</strong>
                Gestion des sessions utilisateurs via cookies sécurisés HttpOnly et protection contre les abus ou usurpations.
              </div>
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-1">Respect des obligations légales</strong>
                Tenue des registres obligatoires et justification comptable et contractuelle des transactions locatives.
              </div>
            </div>
          </div>

          {/* Section 4: Cookies et Stockage Local */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/80 border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  4. Cookies & Préférences
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Utilisation exclusive de traceurs techniques</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              StudRoom n'utilise <strong>aucun cookie publicitaire intrusif</strong> ni pixel espion tiers. Les seuls cookies et stockages locaux exploités sont :
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span><strong>Cookie d'authentification (`token`) :</strong> HttpOnly, Secure, SameSite, indispensable pour maintenir votre session active en toute sécurité.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span><strong>Préférence de thème (`studroom-theme`) :</strong> Stocke localement votre choix (Clair / Sombre / Système) sans transmettre aucune donnée nominative.</span>
              </li>
            </ul>
          </div>

          {/* Section 5: Droits de l'Utilisateur & Contact */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 border border-primary-200/80 dark:border-primary-800/80 flex items-center justify-center text-primary-600 dark:text-primary-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  5. Vos Droits & Exercice (Loi 09-08 Maroc)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Comment faire valoir vos droits auprès de StudRoom</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Conformément à la loi n° 09-08 promulguée par le Dahir 1-09-15 du 22 safar 1430, vous bénéficiez d'un droit d'accès, de rectification et d'opposition pour motifs légitimes sur l'ensemble de vos données à caractère personnel.
            </p>

            <div className="mt-5 p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-800/60 text-sm text-slate-700 dark:text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Contact Délégué à la Protection des Données</div>
                  <a href="mailto:studroom50@gmail.com" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    studroom50@gmail.com
                  </a>
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Délai moyen de réponse : &lt; 24h</span>
            </div>
          </div>

          {/* Need help box */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-primary-600 text-white p-6 sm:p-8 shadow-glow-primary flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Des questions sur la sécurité de vos données ?</h3>
                <p className="text-sm text-emerald-100">Nous sommes disponibles pour vous expliquer nos processus.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-md whitespace-nowrap"
            >
              Écrire au Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
