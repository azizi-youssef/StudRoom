import React from 'react';
import Link from 'next/link';
import { Search, Eye, Send, Key, HelpCircle, ArrowRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { FAQS_DATA } from '@/data/faqs';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Comment ça marche — Processus & FAQ StudRoom',
  description: 'Découvrez comment réserver votre logement étudiant à Selouane en 4 étapes simples et consultez les questions fréquentes.',
};

export default function CommentCaMarchePage() {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choisis',
      desc: 'Explore notre catalogue et trouve le logement meublé qui correspond à ton budget et à tes critères de proximité avec ton université (FPN, EST, ISTA).',
    },
    {
      num: '02',
      icon: Eye,
      title: 'Découvre',
      desc: 'Consulte les photos HD, les équipements inclus (Wi-Fi, bureau, lit), la carte et planifie une visite physique sur place ou une visite virtuelle guidée.',
    },
    {
      num: '03',
      icon: Send,
      title: 'Réserve',
      desc: 'Envoie ta demande de réservation en ligne. Notre équipe te recontacte sous 24h pour valider tes dates et finaliser ton contrat en toute sérénité.',
    },
    {
      num: '04',
      icon: Key,
      title: 'Installe-toi',
      desc: 'Récupère tes clés à ton arrivée à Selouane et commence immédiatement ta nouvelle vie étudiante dans un appartement prêt à vivre.',
    },
  ];

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary-600 uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-100">
            Guide Étudiant
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Comment ça marche ?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Une expérience de location transparente et sans stress, de la première recherche jusqu'à la remise des clés.
          </p>
        </div>

        {/* 4 Steps Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col gap-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-soft">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-black text-slate-200 group-hover:text-primary-400 transition-colors">
                    {s.num}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">{s.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-card max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Foire Aux Questions (FAQ)
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Retrouvez toutes les réponses aux questions fréquemment posées par les étudiants et leurs parents.
            </p>
          </div>

          <Accordion items={FAQS_DATA} />

          {/* CTA Box */}
          <div className="mt-12 p-6 rounded-2xl bg-primary-50 border border-primary-100 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-extrabold text-slate-900 text-base">Vous avez encore des questions ?</h4>
              <p className="text-xs text-slate-600">Notre équipe est disponible 7j/7 pour vous accompagner.</p>
            </div>
            <Link href="/contact">
              <Button variant="primary" size="md">
                Nous contacter
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
