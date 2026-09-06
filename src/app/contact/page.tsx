'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/forms/contact-form';
import {
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  Building2,
  GraduationCap,
  MapPin,
  Calendar,
  Send,
  ChevronDown,
  Search,
  FileText,
  CreditCard,
  KeyRound,
  MessageCircle,
  PhoneCall,
  BadgeAlert,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FAQItem {
  id: string;
  category: 'visites' | 'dossier' | 'prix' | 'services';
  categoryLabel: string;
  q: string;
  a: string;
  tip?: string;
  badge?: string;
}

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // FAQ State
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'visites' | 'dossier' | 'prix' | 'services'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'Toutes les questions', icon: Sparkles },
    { id: 'visites', label: 'Visites & Réservation', icon: MapPin },
    { id: 'dossier', label: 'Dossier & Contrat', icon: FileText },
    { id: 'prix', label: 'Prix & Caution', icon: CreditCard },
    { id: 'services', label: 'Emplacement & Sécurité', icon: ShieldCheck },
  ];

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'visites',
      categoryLabel: 'Visites & Réservation',
      q: 'Comment planifier une visite sur place à Selouane ?',
      a: 'Envoyez-nous simplement un message sur WhatsApp ou via le formulaire. Notre conseiller local vous donne rendez-vous directement à la Résidence Al Omrane pour vous faire visiter les logements témoins, les espaces communs et les commodités du quartier.',
      tip: 'Les visites sont possibles du Lundi au Samedi de 09h à 19h (et le Dimanche sur rendez-vous express).',
      badge: 'Très demandé',
    },
    {
      id: 'faq-2',
      category: 'visites',
      categoryLabel: 'Visites & Réservation',
      q: 'Peut-on réserver à 100% à distance avant d’arriver à Nador ou Selouane ?',
      a: 'Oui, tout à fait ! Plus de 70% de nos étudiants réservent depuis d’autres villes (Fès, Rabat, Casablanca, Oujda, Tanger...). Nous organisons une visite vidéo en direct sur WhatsApp pour inspecter la chambre, puis nous préparons votre contrat de bail étudiant en ligne.',
      tip: 'Votre chambre est immédiatement bloquée à votre nom et vous recevez une attestation de réservation officielle.',
      badge: 'Réservation express',
    },
    {
      id: 'faq-3',
      category: 'dossier',
      categoryLabel: 'Dossier & Contrat',
      q: 'Quels documents obligatoires faut-il préparer pour le dossier ?',
      a: 'Pour valider votre réservation, seuls 3 éléments sont nécessaires : 1. Une copie de votre pièce d’identité (CIN ou Passeport valide). 2. Une attestation d’inscription ou pré-inscription universitaire (FPN Selouane, EST Nador...). 3. La pièce d’identité et les coordonnées du garant (parent ou tuteur).',
      tip: 'Aucun justificatif de salaire complexe n’est exigé : les formalités sont simplifiées pour les étudiants.',
    },
    {
      id: 'faq-4',
      category: 'dossier',
      categoryLabel: 'Dossier & Contrat',
      q: 'Le contrat de bail est-il légalisé et valable pour la carte de séjour ou la bourse ?',
      a: 'Oui, sans exception. Chaque bail étudiant fourni par StudRoom est un contrat individuel complet, conforme à la loi marocaine, légalisable auprès des autorités de la commune de Selouane. Il fait office de justificatif de domicile officiel.',
      tip: 'Idéal pour les étudiants internationaux sollicitant leur carte d’immatriculation marocaine.',
      badge: 'Conforme & Légal',
    },
    {
      id: 'faq-5',
      category: 'prix',
      categoryLabel: 'Prix & Caution',
      q: 'Qu’est-ce qui est inclus dans le loyer affiché sur le site ?',
      a: 'Tous les logements proposés sont 100% meublés (lit avec matelas, bureau, chaise de travail, placard, kitchenette équipée, chauffe-eau). L’accès au Wi-Fi haut débit fibre optique et les charges de copropriété sont inclus dans la majorité des biens.',
      tip: 'Zéro frais d’agence cachés ni commission surprise : transparence totale dès le premier jour.',
    },
    {
      id: 'faq-6',
      category: 'prix',
      categoryLabel: 'Prix & Caution',
      q: 'Comment fonctionne la caution et quand est-elle restituée ?',
      a: 'Le dépôt de garantie équivaut généralement à un mois de loyer. Il est consigné à la remise des clés et vous est restitué dans son intégralité le jour de votre départ après un état des lieux de sortie contradictoire.',
      tip: 'Un reçu officiel de caution vous est remis lors de la signature du bail.',
    },
    {
      id: 'faq-7',
      category: 'services',
      categoryLabel: 'Emplacement & Sécurité',
      q: 'À quelle distance se trouvent les facultés et grandes écoles ?',
      a: 'Nos résidences à Selouane sont situées à seulement 3 minutes à pied de la Faculté Polydisciplinaire de Nador (FPN) et à 4 minutes de l’École Supérieure de Technologie (EST). Vous évitez les frais de taxi quotidien et gagnez un temps précieux de révision.',
      tip: 'Des supérettes, pharmacies, boulangeries et restaurants étudiants sont situés au pied des immeubles.',
      badge: 'Campus 3 min',
    },
    {
      id: 'faq-8',
      category: 'services',
      categoryLabel: 'Emplacement & Sécurité',
      q: 'Comment sont assurés le calme et la sécurité dans les résidences ?',
      a: 'Toutes les résidences sélectionnées disposent d’entrées sécurisées (serrures renforcées / interphones) et d’un règlement intérieur strict interdisant le tapage nocturne afin de préserver la réussite scolaire de chacun. En cas de problème technique (eau, électricité), un concierge ou artisan référent intervient rapidement.',
      tip: 'Notre équipe locale reste joignable par téléphone et WhatsApp 6 jours sur 7.',
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="relative overflow-hidden pt-28 pb-24 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors">
      
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-brand-500/10 dark:bg-brand-600/15 rounded-full blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-60 right-0 w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 animate-pulse" />
            Support & Accueil Étudiant • Selouane & Nador
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Contactez l'Équipe <span className="text-brand-600 dark:text-brand-400">StudRoom</span>
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Une question sur une réservation, une visite ou un partenariat propriétaire ? Notre équipe locale est à votre écoute 6j/7 à Selouane.
          </p>

          {/* Quick Direct Actions Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* WhatsApp Quick Pill */}
            <a
              href="https://wa.me/212634536286?text=Bonjour%20StudRoom,%20je%20souhaite%20des%20informations%20sur%20les%20chambres%20%C3%A0%20Selouane"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-xs transition-all hover:scale-105"
            >
              <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/watsapp_icon.jpeg"
                  alt="WhatsApp"
                  fill
                  className="object-cover"
                />
              </div>
              <span>WhatsApp Direct (+212 634 536 286)</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </a>

            {/* Gmail Quick Pill */}
            <a
              href="mailto:studroom50@gmail.com?subject=Demande%20d'information%20StudRoom"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-bold text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-xs transition-all hover:scale-105"
            >
              <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/gmail_icon.jpeg"
                  alt="Gmail"
                  fill
                  className="object-cover"
                />
              </div>
              <span>studroom50@gmail.com</span>
            </a>

            {/* Bureau Quick Pill */}
            <a
              href="https://maps.google.com/?q=Selouane+Nador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all hover:scale-105"
            >
              <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-2xs shrink-0">
                <Image
                  src="/images/local_icon.jpeg"
                  alt="Localisation Selouane"
                  fill
                  className="object-cover"
                />
              </div>
              <span>Résidence Al Omrane, Selouane</span>
            </a>
          </div>
        </div>

        {/* Main Grid: Direct Channels Cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-24">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. WHATSAPP DIRECT CARD (VIP Featured) */}
            <div className="relative group overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/60 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 sm:p-7 border-2 border-emerald-500/30 dark:border-emerald-500/40 shadow-[0_8px_30px_-6px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_40px_-6px_rgba(16,185,129,0.25)] transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border-2 border-emerald-500/40 group-hover:scale-105 transition-transform">
                  <Image
                    src="/images/watsapp_icon.jpeg"
                    alt="WhatsApp StudRoom"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      WhatsApp Direct
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      En ligne
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Le moyen le plus rapide pour réserver, poser vos questions ou planifier une visite.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 bg-white/90 dark:bg-slate-800/90 px-3.5 py-2 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                      +212 634 536 286
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('+212634536286', 'phone')}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center gap-1 p-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded"
                      title="Copier le numéro"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px]">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center gap-2">
                <a
                  href="https://wa.me/212634536286?text=Bonjour%20StudRoom,%20je%20souhaite%20des%20informations%20sur%20les%20chambres%20%C3%A0%20Selouane"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all group-hover:translate-x-0.5"
                >
                  <span>Démarrer la discussion WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 2. GMAIL / EMAIL CARD */}
            <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-card hover:border-rose-200 dark:hover:border-rose-900/60 transition-all">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform bg-white">
                  <Image
                    src="/images/gmail_icon.jpeg"
                    alt="Gmail StudRoom"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Adresse Email Officielle
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Réponse &lt; 24h
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Idéal pour vos dossiers complets de candidature, conventions de stage et documents administratifs.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/70 px-3.5 py-2 rounded-xl border border-slate-200/70 dark:border-slate-700">
                    <span className="font-mono text-xs sm:text-sm font-bold text-brand-700 dark:text-brand-300 truncate">
                      studroom50@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('studroom50@gmail.com', 'email')}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 p-1 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors shrink-0"
                      title="Copier l'email"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[10px]">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="mailto:studroom50@gmail.com?subject=Demande%20d'information%20-%20StudRoom%20Selouane"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-rose-500" />
                  <span>Envoyer un email directement</span>
                </a>
              </div>
            </div>

            {/* 3. BUREAU LOCALISATION CARD */}
            <div className="relative group overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-card transition-all">
              <div className="flex items-start gap-4">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform bg-white">
                  <Image
                    src="/images/local_icon.jpeg"
                    alt="Bureau Local StudRoom"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Bureau Local & Accueil
                    </h3>
                    <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-full border border-brand-200/60 dark:border-brand-800/60">
                      Sur place
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 dark:text-white mt-1">
                    Secteur 3, Résidence Al Omrane, Selouane, Nador
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    À 3 minutes à pied de la Faculté Polydisciplinaire & EST.
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                    <span>Ouvert du Lundi au Samedi : 09h00 – 19h00</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a
                  href="https://maps.google.com/?q=Selouane+Nador"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                  <span>Ouvrir l'itinéraire Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                </a>
              </div>
            </div>

            {/* Selouane Proximity Campus Banner */}
            <div className="rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-brand-400" />
                <h4 className="font-extrabold text-sm sm:text-base">Au cœur de la vie étudiante de Selouane</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Tous nos appartements et résidences partenaires sont situés à proximité immédiate des établissements universitaires :
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                  <span>FPN Selouane : 3 min</span>
                </div>
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                  <span>EST Nador : 4 min</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

        {/* 🌟 ENHANCED FAQ SECTION: "Tout ce qu'il faut savoir avant de nous contacter" */}
        <section id="faq-section" className="border-t border-slate-200/80 dark:border-slate-800 pt-20">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/80 text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 shadow-xs mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Guide Étudiant & Réponses Immédiates
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Tout ce qu'il faut savoir avant de nous contacter
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Retrouvez toutes les réponses claires sur les visites, les documents requis, les modalités de paiement et la vie étudiante à Selouane.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="max-w-4xl mx-auto mb-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une question (ex: visite, caution, documents, distance...)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-xs scale-102'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-brand-500'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
                <Info className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Aucune question ne correspond à votre recherche</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Essayez avec un autre mot-clé ou contactez directement notre équipe sur WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 rounded-xl hover:bg-brand-100 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`group rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white dark:bg-slate-900 border-brand-300 dark:border-brand-700/80 shadow-[0_8px_25px_-5px_rgba(37,99,235,0.08)]'
                        : 'bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs'
                    }`}
                  >
                    {/* Header / Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-5 sm:px-7 py-5 flex items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-brand-600 text-white shadow-xs'
                              : 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:bg-brand-100'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                              {faq.categoryLabel}
                            </span>
                            {faq.badge && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                                {faq.badge}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                            {faq.q}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                          isOpen
                            ? 'rotate-180 bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-slate-700'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {/* Expandable Body */}
                    {isOpen && (
                      <div className="px-5 sm:px-7 pb-6 pt-1 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-0 sm:pl-12.5">
                          {faq.a}
                        </p>

                        {/* Highlight Tip / Bon à savoir */}
                        {faq.tip && (
                          <div className="mt-4 sm:ml-12.5 flex items-start gap-3 p-3.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/70 dark:border-brand-800/60">
                            <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                            <div className="text-xs text-brand-900 dark:text-brand-200 font-medium leading-relaxed">
                              <span className="font-bold text-brand-700 dark:text-brand-300 mr-1">Bon à savoir :</span>
                              {faq.tip}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 🚀 Bottom Assistance Box: "Toujours une question ?" */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950 p-7 sm:p-9 text-white relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center md:text-left max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-brand-300 border border-white/10 mb-2">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Support en direct
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Vous n'avez pas trouvé votre réponse ?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Notre équipe locale à Selouane vous répond directement sur WhatsApp en moins de 15 minutes ou par téléphone.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <a
                  href="https://wa.me/212634536286?text=Bonjour%20StudRoom,%20j'ai%20une%20question%20concernant%20les%20logements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-102"
                >
                  <div className="relative w-4.5 h-4.5 rounded-md overflow-hidden shrink-0">
                    <Image
                      src="/images/watsapp_icon.jpeg"
                      alt="WhatsApp"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span>Poser ma question sur WhatsApp</span>
                </a>

                <a
                  href="tel:+212634536286"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-300" />
                  <span>+212 634 536 286</span>
                </a>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
