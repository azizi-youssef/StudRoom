# StudRoom — Plateforme de Logement Étudiant à Selouane / Nador

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%20(Bleu%20Canard)-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

**StudRoom** est la plateforme moderne de réservation de logements étudiants meublés et ultra-connectés à proximité immédiate des universités (FPN, EST, ISTA) de Selouane / Nador.

Ce dépôt adopte une **architecture monorepo découplée** séparant physiquement le **Frontend Next.js**, le **Backend REST API Node.js/Express**, et les **Contrats partagés (TypeScript & Zod)**.

---

## 🎨 Identité Visuelle & Thème

- **Couleur Principale** : **Bleu Canard Signature** (`#046c7a` / `#0891b2`)
- **Branding Logo** : `/images/logo_studroom.png`
- **Design System** : Clean, moderne, responsive et optimisé mobile.

---

## 📞 Coordonnées de Contact Officielles

- 📞 **Téléphone / WhatsApp** : `+212 634 536 286`
- ✉️ **Adresse Email** : `studroom50@gmail.com`
- 📍 **Localisation Agence** : Secteur 3, Résidence Al Omrane, Selouane, Nador, Maroc

---

## 🏗️ Architecture du Projet

```text
studroom/
│
├── src/                          # FRONTEND (Next.js 14 App Router)
│   ├── app/                      # Pages & Routes (Home, Logements, Contact, etc.)
│   ├── client/services/          # Couche d'appel HTTP centralisée (ApiClient)
│   ├── components/               # Composants UI (Header, Footer, Formulaires, Cards)
│   ├── data/                     # Données de repli client
│   └── shared/                   # Types & Schémas Zod partagés
│
├── backend/                      # BACKEND (Node.js / Express / TypeScript)
│   ├── src/
│   │   ├── config/               # Variables d'environnement & CORS strict
│   │   ├── controllers/          # Contrôleurs HTTP REST API
│   │   ├── services/             # Logique Métier & Disponibilité des chambres
│   │   ├── repositories/         # Couche d'Accès aux Données (Repository Pattern)
│   │   ├── routes/               # Endpoints REST Versionnés (/api/v1/...)
│   │   ├── middleware/           # Validation Zod, Rate Limiting, Helmet, Error Handler
│   │   └── server.ts             # Point d'entrée serveur Express
│   ├── sql/                      # Schéma PostgreSQL / Supabase de Production
│   │   └── schema.sql
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   └── API.md                    # Documentation détaillée de l'API REST v1
│
├── .env.local                    # Variables d'environnement Frontend (NEXT_PUBLIC_API_URL)
├── package.json                  # Orchestration Monorepo (concurrently)
└── README.md
```

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances

À la racine du monorepo :
```bash
npm install
cd backend && npm install && cd ..
```

---

### 2. Démarrage Simultané (Recommandé)

Lancez les deux applications avec une seule commande :
```bash
npm run dev
```

Cette commande exécute simultanément via `concurrently` :
- 🟢 **Frontend Next.js** : [http://localhost:3000](http://localhost:3000)
- 🔵 **Backend Express REST API** : [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

### 3. Démarrage Individuel

#### Frontend uniquement
```bash
npm run dev:frontend
```

#### Backend uniquement
```bash
npm run dev:backend
```

---

## 🔒 Sécurité & Isolation Base de Données

```text
Frontend ❌ → Direct Database / Supabase access
Frontend ✅ → Backend REST API (/api/v1) → Service / Repository → Database
```

- **Seul le backend** possède les identifiants de base de données (`DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
- **Validation stricte** : Le backend vérifie la disponibilité réelle de la chambre avant de valider une réservation.
- **CORS restreint** : Seul le domaine frontend configuré dans `FRONTEND_URL` est autorisé.
- **Rate limiting** : Protection active contre les abus et les attaques par déni de service.

---

## 📡 Endpoints REST API v1

Consultez [docs/API.md](file:///c:/Users/pc/Desktop/site/StudRoom/docs/API.md) pour les spécifications complètes.

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Vérification de l'état de l'API |
| `GET` | `/api/v1/properties` | Liste des logements avec filtres & pagination |
| `GET` | `/api/v1/properties/featured` | Logements à la une pour la home |
| `GET` | `/api/v1/properties/:slug` | Détail d'un logement par son slug |
| `GET` | `/api/v1/rooms` | Recherche de chambres individuelles |
| `GET` | `/api/v1/rooms/:id` | Détail d'une chambre |
| `POST` | `/api/v1/booking-requests` | Soumission d'une demande de réservation |
| `POST` | `/api/v1/landlord-properties` | Proposition de logement propriétaire |
| `POST` | `/api/v1/contact` | Ticket de contact support |
| `GET` | `/api/v1/cities` | Villes référencées |
| `GET` | `/api/v1/universities` | Universités partenaires |
| `GET` | `/api/v1/amenities` | Équipements & services |

---

## 🛠️ Build de Production

```bash
# Compilation complète (Frontend + Backend)
npm run build
```

---

## 📝 Licence & Propriété

© 2026 **StudRoom Maroc**. Tous droits réservés. *Student living, made simple.*
# StudRoom
