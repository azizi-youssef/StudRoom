-- ====================================================================
-- StudRoom Platform — Initial Seed Data (Cities, Universities, Amenities & Properties)
-- Idempotent script: Safe to run multiple times in Supabase SQL Editor
-- (All UUIDs strictly conform to RFC 4122 hexadecimal format: [0-9, a-f])
-- ====================================================================

-- 1. SEED CITIES
INSERT INTO public.cities (id, name, slug, region, country, is_active)
VALUES 
  ('c0000000-0000-0000-0000-000000000001', 'Selouane', 'selouane', 'Nador / Oriental', 'Maroc', true),
  ('c0000000-0000-0000-0000-000000000002', 'Nador Ville', 'nador', 'Oriental', 'Maroc', true),
  ('c0000000-0000-0000-0000-000000000003', 'Oujda', 'oujda', 'Oriental', 'Maroc', false),
  ('c0000000-0000-0000-0000-000000000004', 'Tanger', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'Maroc', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  is_active = EXCLUDED.is_active;

-- 2. SEED UNIVERSITIES
INSERT INTO public.universities (id, city_id, name, slug, short_name, address, location_lat, location_lng)
VALUES 
  (
    'e0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
    'Faculté des Sciences Appliquées de Nador (FSAN Selouane)',
    'fsan-selouane',
    'FSAN Selouane',
    'Route Nationale 19, Selouane, Nador',
    35.0741, -2.9125
  ),
  (
    'e0000000-0000-0000-0000-000000000002',
    (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
    'Faculté des Économiques et de Gestion de Nador (FEG Nador)',
    'feg-nador',
    'FEG Nador',
    'Quartier Universitaire, Selouane',
    35.0758, -2.9110
  ),
  (
    'e0000000-0000-0000-0000-000000000003',
    (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
    'Faculté des Lettres et des Sciences Humaines de Nador (FLSH)',
    'flsh-nador',
    'FLSH Nador',
    'Quartier Universitaire, Selouane',
    35.0758, -2.9110
  ),
  (
    'e0000000-0000-0000-0000-000000000004',
    (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
    'École Supérieure de Technologie de Nador (EST Nador)',
    'est-nador',
    'EST Nador',
    'Quartier Universitaire, Selouane',
    35.0758, -2.9110
  ),
  (
    'e0000000-0000-0000-0000-000000000005',
    (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
    'Institut Spécialisé de Technologie Appliquée (ISTA Selouane)',
    'ista-selouane',
    'ISTA Selouane',
    'Al Omrane, Selouane',
    35.0780, -2.9050
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  address = EXCLUDED.address;

-- 3. SEED AMENITIES
INSERT INTO public.amenities (id, code, name, icon_name, category)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'wifi', 'Wi-Fi Fibre 100 Mbps', 'Wifi', 'essential'),
  ('a0000000-0000-0000-0000-000000000002', 'desk', 'Bureau de travail individuel', 'Laptop', 'essential'),
  ('a0000000-0000-0000-0000-000000000003', 'bed', 'Lit meublé avec matelas orthopédique', 'Bed', 'essential'),
  ('a0000000-0000-0000-0000-000000000004', 'wardrobe', 'Armoire de rangement', 'Folder', 'essential'),
  ('a0000000-0000-0000-0000-000000000005', 'kitchen', 'Cuisine équipée (Plaque, Frigo, Micro-ondes)', 'Utensils', 'comfort'),
  ('a0000000-0000-0000-0000-000000000006', 'washing', 'Machine à laver automatique', 'Shirt', 'comfort'),
  ('a0000000-0000-0000-0000-000000000007', 'ac', 'Climatisation / Chauffage', 'Wind', 'comfort'),
  ('a0000000-0000-0000-0000-000000000008', 'water-heater', 'Chauffe-eau électrique', 'Flame', 'essential'),
  ('a0000000-0000-0000-0000-000000000009', 'security', 'Accès sécurisé & Gardiennage', 'ShieldCheck', 'security'),
  ('a0000000-0000-0000-0000-000000000010', 'balcony', 'Balcon privatif', 'Sun', 'comfort')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  icon_name = EXCLUDED.icon_name,
  category = EXCLUDED.category;

-- ====================================================================
-- 4. SEED SAMPLE PROPERTIES & ROOMS
-- ====================================================================

-- Propriété 1 : StudRoom Al Omrane 01
INSERT INTO public.properties (
  id, city_id, title, slug, description, address, neighborhood, 
  property_type, min_price_dh, max_price_dh, total_rooms, available_rooms, surface_sqm,
  status, featured, is_available
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
  'StudRoom Al Omrane 01',
  'studroom-al-omrane-01',
  'Appartement étudiant neuf de standing situé au cœur du quartier Al Omrane à Selouane. Équipé de la fibre optique très haut débit, idéal pour réviser au calme à 7 minutes à pied du campus universitaire.',
  'Boulevard Hassan II, Immeuble Al Omrane 4',
  'Al Omrane Centre',
  'apartment',
  1900, 2500, 3, 3, 95.00,
  'AVAILABLE', true, true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Chambres Propriété 1
INSERT INTO public.rooms (
  id, property_id, name, slug, room_type, price_monthly, deposit_dh, surface_sqm, furnished, floor, status
) VALUES 
(
  'f0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Chambre A — Balcon Privatif',
  'chambre-a-balcon',
  'PRIVATE',
  2400.00, 2400.00, 16.00, true, 2, 'AVAILABLE'
),
(
  'f0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'Chambre B — Grande baie vitrée',
  'chambre-b-lumineuse',
  'PRIVATE',
  2100.00, 2100.00, 14.00, true, 2, 'AVAILABLE'
),
(
  'f0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'Chambre C — Bureau ergonomique',
  'chambre-c-confort',
  'PRIVATE',
  1900.00, 1900.00, 13.00, true, 2, 'AVAILABLE'
)
ON CONFLICT (property_id, slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  status = EXCLUDED.status;

-- Image Propriété 1
INSERT INTO public.property_images (property_id, image_url, alt_text, is_primary, display_order)
VALUES 
  ('b0000000-0000-0000-0000-000000000001', '/images/studroom_hero.jpg', 'Salon et espace commun StudRoom Al Omrane', true, 1)
ON CONFLICT DO NOTHING;

-- Proximités Universités Propriété 1
INSERT INTO public.university_proximities (property_id, university_id, distance_km, walking_time_min, transit_time_min)
VALUES 
  (
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.universities WHERE slug = 'fsan-selouane' LIMIT 1),
    0.6, 7, 2
  ),
  (
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM public.universities WHERE slug = 'est-nador' LIMIT 1),
    0.8, 9, 3
  )
ON CONFLICT (property_id, university_id) DO NOTHING;

-- Propriété 2 : StudRoom Résidence Facultaire
INSERT INTO public.properties (
  id, city_id, title, slug, description, address, neighborhood, 
  property_type, min_price_dh, max_price_dh, total_rooms, available_rooms, surface_sqm,
  status, featured, is_available
) VALUES (
  'b0000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.cities WHERE slug = 'selouane' LIMIT 1),
  'StudRoom Résidence Facultaire',
  'studroom-residence-facultaire',
  'Résidence sécurisée haut de gamme à 200m de l entrée principale des facultés de Selouane. Gardiennage 24/7, caméras de surveillance et buanderie collective.',
  'Rue des Écoles, Face Faculté Pluridisciplinaire',
  'Quartier Facultés',
  'residence',
  1600, 2200, 2, 2, 80.00,
  'AVAILABLE', true, true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Chambres Propriété 2
INSERT INTO public.rooms (
  id, property_id, name, slug, room_type, price_monthly, deposit_dh, surface_sqm, furnished, floor, status
) VALUES 
(
  'f0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000002',
  'Studio Privatif 101',
  'studio-privatif-101',
  'STUDIO',
  2200.00, 2200.00, 22.00, true, 1, 'AVAILABLE'
),
(
  'f0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'Chambre Simple 102',
  'chambre-simple-102',
  'PRIVATE',
  1600.00, 1600.00, 14.00, true, 1, 'AVAILABLE'
)
ON CONFLICT (property_id, slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  status = EXCLUDED.status;

-- Image Propriété 2
INSERT INTO public.property_images (property_id, image_url, alt_text, is_primary, display_order)
VALUES 
  ('b0000000-0000-0000-0000-000000000002', '/images/studroom_hero.jpg', 'Chambre studio StudRoom Résidence', true, 1)
ON CONFLICT DO NOTHING;
