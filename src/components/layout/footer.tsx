import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

function Tiktok({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.25a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.28 8.28 0 0 0 4.91 1.45V6.72a4.88 4.88 0 0 1-1-.03z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 pt-20 pb-12 border-t border-slate-800/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/90">

          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center group">
              <div className="relative h-14 sm:h-16 w-60 sm:w-72 flex items-center">
                <Image
                  src="/images/logo_studroom.png"
                  alt="StudRoom Logo"
                  width={420}
                  height={160}
                  className="h-14 sm:h-16 w-auto object-contain brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              StudRoom redéfinit le logement étudiant au Maroc : des espaces meublés, ultra-connectés, proches des facultés de Selouane et Nador pour étudier en toute sérénité.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/studroom50/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram StudRoom"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61594133098558"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook StudRoom"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xs"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/@studroom50"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok StudRoom"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xs"
              >
                <Tiktok className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/student-room-146087434/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn StudRoom"
                className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-all shadow-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-white transition-colors">Accueil</Link>
              </li>
              <li>
                <Link href="/logements" className="text-slate-400 hover:text-white transition-colors">Nos Logements</Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="text-slate-400 hover:text-white transition-colors">Comment ça marche</Link>
              </li>
              <li>
                <Link href="/proprietaires" className="text-slate-400 hover:text-white transition-colors">Espace Propriétaires</Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-slate-400 hover:text-white transition-colors">À propos</Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-slate-400 hover:text-white transition-colors">Mentions Légales & CGU</Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-slate-400 hover:text-white transition-colors">Confidentialité</Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Cities Directory */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Villes & Campus</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none"></span>
                <span className="text-white font-semibold">Selouane / Al Omrane</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none"></span>
                <span className="text-white font-semibold">Nador Ville</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span>Oujda (Bientôt)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span>Tanger (Bientôt)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details & Support */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Contact & Support</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Al Omrane, Selouane, Nador, Maroc</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+212634536286" className="hover:text-white transition-colors font-medium">+212 634 536 286</a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:studroom50@gmail.com" className="hover:text-white transition-colors truncate font-medium">studroom50@gmail.com</a>
              </div>
            </div>

            <div className="mt-2 p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping motion-reduce:animate-none" />
              <span>Support réactif 7j/7 pour étudiants</span>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} StudRoom Maroc. Tous droits réservés. Student living, made simple.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/mentions-legales" className="hover:text-slate-300 transition-colors">Mentions Légales & CGU</Link>
            <Link href="/politique-confidentialite" className="hover:text-slate-300 transition-colors">Confidentialité</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Direct</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
