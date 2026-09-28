import { z } from 'zod';

// ====================================================================
// PROPERTY SCHEMAS
// ====================================================================

export const adminCreatePropertySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  slug: z.string().optional(),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères.'),
  city_id: z.string().min(1, 'La ville est obligatoire.'),
  neighborhood: z.string().min(2, 'Le quartier est obligatoire.'),
  address: z.string().min(3, "L'adresse est obligatoire."),
  property_type: z.enum(['apartment', 'house', 'residence', 'studio', 'building'], {
    errorMap: () => ({ message: 'Type de bien non valide.' }),
  }).default('apartment'),
  surface_sqm: z.coerce.number().min(0, 'La superficie doit être positive.').default(0),
  min_price_dh: z.coerce.number().min(0, 'Le loyer doit être positif.').optional().default(0),
  max_price_dh: z.coerce.number().min(0).optional().default(0),
  total_rooms: z.coerce.number().min(0).optional().default(1),
  available_rooms: z.coerce.number().min(0).optional().default(1),
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'AVAILABLE', 'PARTIALLY_OCCUPIED', 'FULLY_OCCUPIED', 'UNAVAILABLE']).default('AVAILABLE'),
  featured: z.boolean().default(false),
  is_available: z.boolean().default(true),
  location_lat: z.coerce.number().optional().nullable(),
  location_lng: z.coerce.number().optional().nullable(),
  landlord_id: z.string().optional().nullable(),
  amenity_ids: z.array(z.string()).optional().default([]),
  image_urls: z.array(z.string()).optional().default([]),
});

export const adminUpdatePropertySchema = adminCreatePropertySchema.partial();

export type AdminCreatePropertyValues = z.infer<typeof adminCreatePropertySchema>;
export type AdminUpdatePropertyValues = z.infer<typeof adminUpdatePropertySchema>;

// ====================================================================
// ROOM SCHEMAS
// ====================================================================

export const adminCreateRoomSchema = z.object({
  name: z.string().min(2, 'Le nom de la chambre doit contenir au moins 2 caractères.'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  room_type: z.enum(['PRIVATE', 'SHARED', 'MASTER', 'STUDIO']).default('PRIVATE'),
  price_monthly: z.coerce.number().min(0, 'Le loyer doit être positif ou nul.'),
  deposit_dh: z.coerce.number().min(0, 'La caution doit être positive ou nulle.').default(0),
  surface_sqm: z.coerce.number().min(0, 'La superficie doit être positive.').default(12),
  furnished: z.boolean().default(true),
  floor: z.coerce.number().default(1),
  available_from: z.string().optional().nullable(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE']).default('AVAILABLE'),
  images: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
});

export const adminUpdateRoomSchema = adminCreateRoomSchema.partial();

export const adminUpdateRoomStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE']),
});

export type AdminCreateRoomValues = z.infer<typeof adminCreateRoomSchema>;
export type AdminUpdateRoomValues = z.infer<typeof adminUpdateRoomSchema>;

// ====================================================================
// USER SCHEMAS
// ====================================================================

export const adminUpdateUserStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BLOCKED']),
});

export const adminUpdateUserRoleSchema = z.object({
  role: z.enum(['student', 'landlord', 'admin']),
});

// ====================================================================
// VISIT SCHEMAS
// ====================================================================

export const adminScheduleVisitSchema = z.object({
  visit_date: z.string().min(1, 'La date et heure de la visite sont obligatoires.'),
  visit_notes: z.string().optional().nullable(),
});

// ====================================================================
// CONVERSION BAILLEUR SCHEMAS
// ====================================================================

export const adminConvertSubmissionSchema = z.object({
  title: z.string().min(3, 'Le titre du logement doit contenir au moins 3 caractères.').optional(),
  city_id: z.string().optional(),
  rooms_count: z.coerce.number().int().min(1).optional(),
  monthly_price_dh: z.coerce.number().min(0).optional(),
  surface_sqm: z.coerce.number().min(0).optional(),
});
