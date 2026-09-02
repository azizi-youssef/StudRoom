# StudRoom — Spécification API REST v1

- **Base URL** : `http://localhost:4000/api/v1`
- **Format** : JSON
- **Headers requis pour les requêtes POST/PUT** : `Content-Type: application/json`

---

## Format Standard des Réponses

### Succès
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 12,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Erreur
```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_AVAILABLE",
    "message": "Cette chambre n'est plus disponible."
  },
  "errors": [ ... ]
}
```

---

## 0. Authentification & Compte (`/auth`)

### `POST /api/v1/auth/login`
Connexion utilisateur (étudiant ou propriétaire) par email & mot de passe. Renseigne un jeton JWT valide 7 jours.

**Corps de la requête :**
```json
{
  "email": "etudiant@studroom.ma",
  "password": "password123"
}
```

### `POST /api/v1/auth/register`
Création d'un compte membre StudRoom.

**Corps de la requête :**
```json
{
  "fullName": "Karim El Amrani",
  "email": "karim@studroom.ma",
  "phone": "+212634536286",
  "password": "password123",
  "role": "student"
}
```

### `GET /api/v1/auth/me`
Récupère le profil de l'utilisateur actuellement connecté.

**Headers :**
`Authorization: Bearer <token_jwt>`

---

## 1. Endpoints Logements (`/properties`)

### `GET /api/v1/properties`
Retourne la liste des logements avec filtres serveur.

**Paramètres Query (Optionnels) :**
- `q` : Recherche textuelle (titre, quartier, ville)
- `city` : Slug de la ville (ex: `selouane`, `nador`)
- `university` : ID de l'université (ex: `uni-fsp-selouane`)
- `maxPrice` : Budget maximum en DH
- `type` : Type de bien (`apartment`, `studio`, `house`)
- `sort` : Tri (`featured`, `price_asc`, `price_desc`)
- `page` : Numéro de page (défaut `1`)
- `limit` : Éléments par page (défaut `12`)

### `GET /api/v1/properties/featured`
Retourne les logements mis en avant pour la page d'accueil.

### `GET /api/v1/properties/:slug`
Retourne le détail complet d'un logement par son slug (incluant chambres, équipements, proximités campus).

---

## 2. Endpoints Chambres (`/rooms`)

### `GET /api/v1/rooms`
Recherche de chambres individuelles (unité locative primaire).

**Paramètres Query :**
- `q`, `city`, `university`, `maxPrice`, `roomType` (`PRIVATE`, `SHARED`, `MASTER`, `STUDIO`), `sort`, `page`, `limit`.

### `GET /api/v1/rooms/:id`
Retourne le détail d'une chambre spécifique.

---

## 3. Demande de Réservation (`/booking-requests`)

### `POST /api/v1/booking-requests`
Enregistre une demande de réservation avec validation de disponibilité côté serveur.

**Corps de la requête :**
```json
{
  "firstName": "Karim",
  "lastName": "El Amrani",
  "email": "karim.amrani@gmail.com",
  "phone": "+212612345678",
  "university": "Faculté Pluridisciplinaire de Nador (FSP Selouane)",
  "studyLevel": "Licence 1ère année",
  "desiredArrivalDate": "2026-09-01",
  "durationMonths": 10,
  "propertySlug": "studroom-al-omrane-01",
  "roomId": "room-1-a",
  "roomName": "Chambre A — Executive Balcon",
  "message": "Bonjour, je souhaite réserver cette chambre pour la rentrée."
}
```

**Réponse (201 Created) :**
```json
{
  "success": true,
  "data": {
    "bookingId": "SR-BOOK-482910",
    "message": "Demande de réservation enregistrée avec succès.",
    "data": { ... }
  }
}
```

---

## 4. Espace Propriétaires (`/landlord-properties`)

### `POST /api/v1/landlord-properties`
Soumission d'un bien à confier à la gestion StudRoom.

**Corps de la requête :**
```json
{
  "fullName": "Mohamed Bennani",
  "phone": "0661234567",
  "email": "m.bennani@gmail.com",
  "city": "Selouane",
  "neighborhood": "Al Omrane",
  "propertyType": "apartment",
  "roomsCount": 3,
  "surfaceSqm": 90,
  "expectedRentDh": 4500,
  "availabilityDate": "2026-09-01",
  "message": "Appartement refait à neuf."
}
```

---

## 5. Contact (`/contact`)

### `POST /api/v1/contact`
Envoi d'un message / demande d'assistance.

**Corps de la requête :**
```json
{
  "fullName": "Fatima Zahra",
  "email": "fz.etudiante@gmail.com",
  "phone": "0701234567",
  "subject": "Renseignement visite",
  "message": "Est-il possible d'organiser une visite virtuelle samedi ?"
}
```

---

## 6. Métadonnées & Référentiels

- `GET /api/v1/cities` — Liste des villes
- `GET /api/v1/universities` — Liste des universités
- `GET /api/v1/amenities` — Catalogue des équipements
