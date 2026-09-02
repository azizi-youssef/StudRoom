import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">

          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center group">
              <div className="relative h-16 sm:h-20 w-72 sm:w-80 flex items-center">
                <Image
                  src="/images/logo_studroom.png"
                  alt="StudRoom Logo"
                  width={420}
                  height={160}
                  className="h-16 sm:h-20 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              StudRoom transforme le logement étudiant au Maroc. Des appartements et studios meublés, ultra-connectés, proches des universités et pensés pour ta réussite.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-brand-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
              </li>
              <li>
                <Link href="/logements" className="hover:text-white transition-colors">Nos Logements</Link>
              </li>
              <li>
                <Link href="/comment-ca-marche" className="hover:text-white transition-colors">Comment ça marche</Link>
              </li>
              <li>
                <Link href="/proprietaires" className="hover:text-white transition-colors">Espace Propriétaires</Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">À propos</Link>
              </li>
            </ul>
          </div>

          {/* Cities Directory */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Villes & Campus</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-white font-medium">Selouane / Al Omrane</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-white font-medium">Nador Ville</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span>Oujda (Prochainement)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                <span>Tanger (Prochainement)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Direct</h4>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-1" />
                <span>Al Omrane, Selouane, Nador, Maroc</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:+212634536286" className="hover:text-white transition-colors">+212 634 536 286</a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:studroom50@gmail.com" className="hover:text-white transition-colors">studroom50@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} StudRoom. Tous droits réservés. Student living, made simple.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
            <Link href="/comment-ca-marche" className="hover:text-slate-400 transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
