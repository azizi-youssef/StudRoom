import { PROPERTIES_DATA } from '../data/properties';
import { UNIVERSITIES_DATA } from '../data/universities';
import { CITIES_DATA } from '../data/cities';
import { PropertyDetail, RoomDetail, PropertyFilterState, PaginationMeta } from '../shared/types';
import { DbUniversity, DbCity, RoomStatus, DbPropertyImage } from '../shared/types/database';
import {
  AdminCreatePropertyValues,
  AdminUpdatePropertyValues,
  AdminCreateRoomValues,
  AdminUpdateRoomValues,
} from '../shared/schemas/admin.schema';
import { getSupabaseAdmin } from '../config/supabase';


/** Sélecteur de colonnes partagé pour les propriétés avec toutes leurs relations */
const PROPERTY_SELECT =
  '*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Nettoie une URL d'image en provenance de la base de données.
 * Empêche les chemins de fichiers locaux Windows (ex: C:/...) de faire crasher Next.js.
 */
function sanitizeBackendImageUrl(url?: string | null): string {
  const fallback = '/images/studroom_hero.jpg';
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Si un chemin absolu Windows / Linux contenant public/images a été injecté
  const match = trimmed.match(/[/\\]public([/\\]images[/\\].*)$/i);
  if (match && match[1]) {
    return match[1].replace(/\\/g, '/');
  }

  // Chemin système de fichiers local Windows ou protocole file://
  if (trimmed.match(/^[a-zA-Z]:[/\\]/i) || trimmed.startsWith('file:')) {
    return fallback;
  }

  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  if (trimmed.startsWith('images/')) {
    return '/' + trimmed;
  }

  return fallback;
}

/**
 * Transforme un enregistrement de propriété Supabase en PropertyDetail
 * en garantissant la présence et la validité de primary_image et de chaque image_url.
 */
function mapSupabaseProperty(raw: any): PropertyDetail {
  if (!raw) return raw;

  const rawImages = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages.map((img: any) => ({
    ...img,
    image_url: sanitizeBackendImageUrl(img.image_url),
  }));

  const primaryImage =
    raw.primary_image && !raw.primary_image.match(/^[a-zA-Z]:[/\\]/i)
      ? sanitizeBackendImageUrl(raw.primary_image)
      : images.find((i: any) => i.is_primary)?.image_url ||
        images[0]?.image_url ||
        '/images/studroom_hero.jpg';

  return {
    ...raw,
    images,
    primary_image: primaryImage,
  } as PropertyDetail;
}

export class PropertyRepository {
  /**
   * Charge toutes les propriétés (usage interne uniquement, sans filtres).
   * Utilisé par le service pour calculer les statuts dynamiques.
   */
  async findAllProperties(page = 1, limit = 50): Promise<PropertyDetail[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error } = await supabase
          .from('properties')
          .select(PROPERTY_SELECT)
          .eq('is_available', true)
          .range(from, to);
        if (!error && data && data.length > 0) {
          return data.map(mapSupabaseProperty);
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA;
  }

  /**
   * Recherche de propriétés avec filtres, tri et pagination déportés côté SQL.
   *
   * Tous les filtres sont appliqués directement dans la requête Supabase,
   * éliminant le chargement inutile de l'ensemble du catalogue en mémoire.
   *
   * @returns { properties, meta } — résultats paginés avec métadonnées
   */
  async findPropertiesFiltered(
    filters: Partial<PropertyFilterState>
  ): Promise<{ properties: PropertyDetail[]; meta: PaginationMeta }> {
    const supabase = getSupabaseAdmin();

    const page  = filters.page  ?? 1;
    const limit = filters.limit ?? 12;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    // ── Supabase path (SQL-level filtering) ───────────────────────────────────
    if (supabase) {
      try {
        let query = supabase
          .from('properties')
          .select(PROPERTY_SELECT, { count: 'exact' })
          .eq('is_available', true);

        // ── Filtre texte libre (titre, quartier, description) ─────────────────
        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.trim();
          // Supabase textSearch (full-text) sur la colonne titre + description
          query = query.or(
            `title.ilike.%${q}%,neighborhood.ilike.%${q}%,description.ilike.%${q}%`
          );
        }

        // ── Filtre type de propriété ──────────────────────────────────────────
        if (filters.propertyType && filters.propertyType !== 'all') {
          query = query.eq('property_type', filters.propertyType);
        }

        // ── Filtre prix maximum (prix minimum de la propriété ≤ maxPrice) ─────
        if (filters.maxPrice && filters.maxPrice > 0) {
          query = query.lte('min_price_dh', filters.maxPrice);
        }

        // ── Filtre prix minimum ───────────────────────────────────────────────
        if (filters.minPrice && filters.minPrice > 0) {
          query = query.gte('min_price_dh', filters.minPrice);
        }

        // ── Tri ───────────────────────────────────────────────────────────────
        if (filters.sortBy === 'price_asc') {
          query = query.order('min_price_dh', { ascending: true });
        } else if (filters.sortBy === 'price_desc') {
          query = query.order('min_price_dh', { ascending: false });
        } else {
          // Défaut : propriétés vedettes en premier, puis date de création
          query = query
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false });
        }

        // ── Pagination SQL ────────────────────────────────────────────────────
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (!error && data) {
          let properties = data.map(mapSupabaseProperty);

          // ── Post-filtres nécessitant des relations imbriquées ─────────────
          // (citySlug et universityId filtrent sur des champs de tables jointes
          //  — Supabase ne supporte pas encore le filtrage direct sur colonnes
          //  de relations imbriquées dans un .select() simple)

          if (filters.citySlug && filters.citySlug !== 'all') {
            properties = properties.filter((p) => p.city?.slug === filters.citySlug);
          }

          if (filters.universityId && filters.universityId !== 'all') {
            properties = properties.filter((p) =>
              p.proximities?.some((prox) => prox.university_id === filters.universityId)
            );
          }

          const total = count ?? properties.length;
          const totalPages = Math.ceil(total / limit) || 1;

          return {
            properties,
            meta: {
              total,
              page,
              limit,
              totalPages,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1,
            },
          };
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }

    // ── Fallback local (dev sans DB) ─────────────────────────────────────────
    let properties = [...PROPERTIES_DATA];

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      properties = properties.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.city.name.toLowerCase().includes(q)
      );
    }

    if (filters.citySlug && filters.citySlug !== 'all') {
      properties = properties.filter((p) => p.city.slug === filters.citySlug);
    }

    if (filters.universityId && filters.universityId !== 'all') {
      properties = properties.filter((p) =>
        p.proximities.some((prox) => prox.university_id === filters.universityId)
      );
    }

    if (filters.maxPrice && filters.maxPrice > 0) {
      properties = properties.filter((p) => p.min_price_dh <= filters.maxPrice!);
    }

    if (filters.minPrice && filters.minPrice > 0) {
      properties = properties.filter((p) => p.min_price_dh >= filters.minPrice!);
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      properties = properties.filter((p) => p.property_type === filters.propertyType);
    }

    if (filters.sortBy === 'price_asc') {
      properties.sort((a, b) => a.min_price_dh - b.min_price_dh);
    } else if (filters.sortBy === 'price_desc') {
      properties.sort((a, b) => b.min_price_dh - a.min_price_dh);
    } else {
      properties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const total      = properties.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paged      = properties.slice(from, from + limit);

    return {
      properties: paged,
      meta: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    };
  }

  async findPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))')
          .eq('slug', slug)
          .maybeSingle();
        if (!error && data) {
          return mapSupabaseProperty(data);
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA.find((p) => p.slug === slug) ?? null;
  }

  async findPropertyById(id: string): Promise<PropertyDetail | null> {


    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          return mapSupabaseProperty(data);
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA.find((p) => p.id === id) ?? null;
  }

  async findPropertiesByLandlord(landlordId: string): Promise<PropertyDetail[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))')
          .eq('landlord_id', landlordId);
        if (!error && data) {
          return data.map(mapSupabaseProperty);
        }
      } catch {
        // Fallback
      }
    }
    return PROPERTIES_DATA.filter((p) => p.landlord_id === landlordId);
  }

  async findFeaturedProperties(): Promise<PropertyDetail[]> {

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))')
          .eq('featured', true)
          .eq('is_available', true)
          .limit(12);
        if (!error && data && data.length > 0) {
          return data.map(mapSupabaseProperty);
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA.filter((p) => p.featured);
  }

  async findRooms(
    filters?: Partial<PropertyFilterState>
  ): Promise<{ rooms: RoomDetail[]; meta: PaginationMeta }> {
    const supabase = getSupabaseAdmin();

    // ── Supabase path ────────────────────────────────────────────────────────
    if (supabase) {
      try {
        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 12;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
          .from('rooms')
          .select('*, property:properties(*, city:cities(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*)))', { count: 'exact' });

        if (filters?.maxPrice && filters.maxPrice > 0) {
          query = query.lte('price_monthly', filters.maxPrice);
        }
        if (filters?.roomType && filters.roomType !== 'all') {
          query = query.eq('room_type', filters.roomType);
        }
        if (filters?.sortBy === 'price_asc') {
          query = query.order('price_monthly', { ascending: true });
        } else if (filters?.sortBy === 'price_desc') {
          query = query.order('price_monthly', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        query = query.range(from, to);

        const { data, error, count } = await query;
        if (!error && data) {
          const total = count ?? data.length;
          const totalPages = Math.ceil(total / limit) || 1;
          const rooms: RoomDetail[] = data.map((r: any) => ({
            ...r,
            property: r.property ? mapSupabaseProperty(r.property) : r.property,
          }));
          return {
            rooms,
            meta: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
          };
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }

    // ── Local static fallback ─────────────────────────────────────────────────
    let allRooms: RoomDetail[] = [];

    PROPERTIES_DATA.forEach((property) => {
      property.rooms.forEach((room) => {
        allRooms.push({
          ...room,
          property,
          city: property.city,
          amenities: property.amenities,
        });
      });
    });

    if (filters) {
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        allRooms = allRooms.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.property?.title.toLowerCase().includes(q) ||
            r.property?.neighborhood.toLowerCase().includes(q)
        );
      }

      if (filters.citySlug && filters.citySlug !== 'all') {
        allRooms = allRooms.filter((r) => r.city?.slug === filters.citySlug);
      }

      if (filters.universityId && filters.universityId !== 'all') {
        allRooms = allRooms.filter((r) =>
          r.property?.proximities.some((prox) => prox.university_id === filters.universityId)
        );
      }

      if (filters.maxPrice && filters.maxPrice > 0) {
        allRooms = allRooms.filter((r) => r.price_monthly <= filters.maxPrice!);
      }

      if (filters.roomType && filters.roomType !== 'all') {
        allRooms = allRooms.filter((r) => r.room_type === filters.roomType);
      }

      if (filters.sortBy === 'price_asc') {
        allRooms.sort((a, b) => a.price_monthly - b.price_monthly);
      } else if (filters.sortBy === 'price_desc') {
        allRooms.sort((a, b) => b.price_monthly - a.price_monthly);
      }
    }

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 12;
    const total = allRooms.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedRooms = allRooms.slice(startIndex, startIndex + limit);

    return {
      rooms: paginatedRooms,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findRoomById(id: string): Promise<RoomDetail | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*, property:properties(*, city:cities(*), amenities:property_amenities(amenity:amenities(*)), proximities:university_proximities(*, university:universities(*)))')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) return data as unknown as RoomDetail;
      } catch {
        // Fallback to local data
      }
    }
    for (const property of PROPERTIES_DATA) {
      const room = property.rooms.find((r) => r.id === id);
      if (room) {
        return { ...room, property, city: property.city, amenities: property.amenities };
      }
    }
    return null;
  }

  async findAllUniversities(): Promise<DbUniversity[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('universities').select('*');
      if (!error && data && data.length > 0) return data as DbUniversity[];
    }
    return UNIVERSITIES_DATA;
  }

  async findAllCities(): Promise<DbCity[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data && data.length > 0) return data as DbCity[];
    }
    return CITIES_DATA;
  }

  async updateRoomStatus(id: string, status: RoomStatus): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from('rooms')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (!error) return true;
    }

    for (const property of PROPERTIES_DATA) {
      const room = property.rooms.find((r) => r.id === id);
      if (room) {
        room.status = status;
        return true;
      }
    }
    return false;
  }

  // ─── ADMIN: PROPERTY MUTATIONS ──────────────────────────────────────────────

  async createProperty(data: AdminCreatePropertyValues): Promise<PropertyDetail> {
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const slug = data.slug?.trim() || `${slugify(data.title)}-${id.slice(0, 6)}`;
    const now = new Date().toISOString();

    const insertPayload = {
      id,
      city_id: data.city_id,
      title: data.title,
      slug,
      description: data.description,
      address: data.address,
      neighborhood: data.neighborhood,
      property_type: data.property_type,
      surface_sqm: data.surface_sqm || 0,
      status: data.status || 'AVAILABLE',
      featured: data.featured ?? false,
      is_available: data.is_available ?? true,
      location_lat: data.location_lat ?? 0,
      location_lng: data.location_lng ?? 0,
      landlord_id: data.landlord_id ?? null,
      min_price_dh: 0,
      max_price_dh: 0,
      total_rooms: 0,
      available_rooms: 0,
      created_at: now,
      updated_at: now,
    };

    if (supabase) {
      const { error } = await supabase.from('properties').insert(insertPayload);
      if (error) {
        throw new Error(`Database error creating property: ${error.message}`);
      }

      if (data.amenity_ids && data.amenity_ids.length > 0) {
        const relations = data.amenity_ids.map((amenity_id) => ({
          property_id: id,
          amenity_id,
        }));
        await supabase.from('property_amenities').insert(relations);
      }

      if (data.image_urls && data.image_urls.length > 0) {
        const imageRows = data.image_urls.map((url, idx) => ({
          id: crypto.randomUUID(),
          property_id: id,
          image_url: url.trim(),
          alt_text: data.title,
          is_primary: idx === 0,
          display_order: idx + 1,
          created_at: now,
        }));
        await supabase.from('property_images').insert(imageRows);
      }

      const created = await this.findPropertyById(id);
      if (created) return created;
    }

    // In-memory fallback
    const city = CITIES_DATA.find((c) => c.id === data.city_id) ?? CITIES_DATA[0];
    const initialImages = (data.image_urls || []).map((url, idx) => ({
      id: crypto.randomUUID(),
      property_id: id,
      image_url: url.trim(),
      alt_text: data.title,
      is_primary: idx === 0,
      display_order: idx + 1,
    }));
    const newProp: PropertyDetail = {
      ...insertPayload,
      landlord_id: data.landlord_id ?? undefined,
      city,
      rooms: [],
      amenities: [],
      images: initialImages,
      proximities: [],
      primary_image: data.image_urls?.[0] || '/images/studroom_hero.jpg',
    };
    PROPERTIES_DATA.unshift(newProp);
    return newProp;
  }

  async updateProperty(id: string, data: AdminUpdatePropertyValues): Promise<PropertyDetail> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const updatePayload: Record<string, unknown> = {
      updated_at: now,
    };

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.slug !== undefined) updatePayload.slug = data.slug;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.city_id !== undefined) updatePayload.city_id = data.city_id;
    if (data.neighborhood !== undefined) updatePayload.neighborhood = data.neighborhood;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.property_type !== undefined) updatePayload.property_type = data.property_type;
    if (data.surface_sqm !== undefined) updatePayload.surface_sqm = data.surface_sqm;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.featured !== undefined) updatePayload.featured = data.featured;
    if (data.is_available !== undefined) updatePayload.is_available = data.is_available;
    if (data.location_lat !== undefined) updatePayload.location_lat = data.location_lat;
    if (data.location_lng !== undefined) updatePayload.location_lng = data.location_lng;
    if (data.landlord_id !== undefined) updatePayload.landlord_id = data.landlord_id;

    if (supabase) {
      const { error } = await supabase.from('properties').update(updatePayload).eq('id', id);
      if (error) {
        throw new Error(`Database error updating property: ${error.message}`);
      }

      if (data.amenity_ids !== undefined) {
        await supabase.from('property_amenities').delete().eq('property_id', id);
        if (data.amenity_ids.length > 0) {
          const relations = data.amenity_ids.map((amenity_id) => ({
            property_id: id,
            amenity_id,
          }));
          await supabase.from('property_amenities').insert(relations);
        }
      }

      const updated = await this.findPropertyById(id);
      if (updated) return updated;
    }

    const localIndex = PROPERTIES_DATA.findIndex((p) => p.id === id);
    if (localIndex >= 0) {
      PROPERTIES_DATA[localIndex] = {
        ...PROPERTIES_DATA[localIndex],
        ...updatePayload,
      } as PropertyDetail;
      return PROPERTIES_DATA[localIndex];
    }

    throw new Error('Property not found');
  }

  async deleteProperty(id: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        throw new Error(`Database error deleting property: ${error.message}`);
      }
      return true;
    }

    const idx = PROPERTIES_DATA.findIndex((p) => p.id === id);
    if (idx >= 0) {
      PROPERTIES_DATA.splice(idx, 1);
      return true;
    }
    return false;
  }

  // ─── ADMIN: ROOM MUTATIONS ──────────────────────────────────────────────────

  async createRoom(propertyId: string, data: AdminCreateRoomValues): Promise<RoomDetail> {
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const slug = data.slug?.trim() || `${slugify(data.name)}-${id.slice(0, 6)}`;
    const now = new Date().toISOString();

    const insertPayload = {
      id,
      property_id: propertyId,
      name: data.name,
      slug,
      description: data.description ?? null,
      room_type: data.room_type,
      price_monthly: data.price_monthly,
      deposit_dh: data.deposit_dh ?? 0,
      surface_sqm: data.surface_sqm ?? 12,
      furnished: data.furnished ?? true,
      floor: data.floor ?? 1,
      available_from: data.available_from || now.split('T')[0],
      status: data.status || 'AVAILABLE',
      images: data.images ?? [],
      features: data.features ?? [],
      created_at: now,
      updated_at: now,
    };

    if (supabase) {
      const { error } = await supabase.from('rooms').insert(insertPayload);
      if (error) {
        throw new Error(`Database error creating room: ${error.message}`);
      }
      const room = await this.findRoomById(id);
      if (room) return room;
    }

    const property = await this.findPropertyById(propertyId);
    const newRoom: RoomDetail = {
      ...insertPayload,
      description: data.description ?? undefined,
      property: property ?? undefined,
      city: property?.city,
    };
    if (property) {
      property.rooms.push(newRoom);
    }
    return newRoom;
  }

  async updateRoom(roomId: string, data: AdminUpdateRoomValues): Promise<RoomDetail> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    const updatePayload: Record<string, unknown> = {
      updated_at: now,
    };

    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.slug !== undefined) updatePayload.slug = data.slug;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.room_type !== undefined) updatePayload.room_type = data.room_type;
    if (data.price_monthly !== undefined) updatePayload.price_monthly = data.price_monthly;
    if (data.deposit_dh !== undefined) updatePayload.deposit_dh = data.deposit_dh;
    if (data.surface_sqm !== undefined) updatePayload.surface_sqm = data.surface_sqm;
    if (data.furnished !== undefined) updatePayload.furnished = data.furnished;
    if (data.floor !== undefined) updatePayload.floor = data.floor;
    if (data.available_from !== undefined) updatePayload.available_from = data.available_from;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.images !== undefined) updatePayload.images = data.images;
    if (data.features !== undefined) updatePayload.features = data.features;

    if (supabase) {
      const { error } = await supabase.from('rooms').update(updatePayload).eq('id', roomId);
      if (error) {
        throw new Error(`Database error updating room: ${error.message}`);
      }
      const room = await this.findRoomById(roomId);
      if (room) return room;
    }

    const room = await this.findRoomById(roomId);
    if (room) {
      Object.assign(room, updatePayload);
      return room;
    }
    throw new Error('Room not found');
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('rooms').delete().eq('id', roomId);
      if (error) {
        throw new Error(`Database error deleting room: ${error.message}`);
      }
      return true;
    }

    for (const property of PROPERTIES_DATA) {
      const idx = property.rooms.findIndex((r) => r.id === roomId);
      if (idx >= 0) {
        property.rooms.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  // ─── ADMIN: IMAGE MUTATIONS ─────────────────────────────────────────────────

  async addPropertyImage(
    propertyId: string,
    imageUrl: string,
    altText = '',
    isPrimary = false,
    displayOrder = 0
  ): Promise<DbPropertyImage> {
    const supabase = getSupabaseAdmin();
    const id = crypto.randomUUID();
    const cleanUrl = sanitizeBackendImageUrl(imageUrl);

    if (supabase) {
      if (isPrimary) {
        await supabase
          .from('property_images')
          .update({ is_primary: false })
          .eq('property_id', propertyId);
      }

      const { data, error } = await supabase
        .from('property_images')
        .insert({
          id,
          property_id: propertyId,
          image_url: cleanUrl,
          alt_text: altText,
          is_primary: isPrimary,
          display_order: displayOrder,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error adding image: ${error.message}`);
      }
      return data as DbPropertyImage;
    }

    const newImg: DbPropertyImage = {
      id,
      property_id: propertyId,
      image_url: cleanUrl,
      alt_text: altText,
      is_primary: isPrimary,
      display_order: displayOrder,
      created_at: new Date().toISOString(),
    };

    const prop = PROPERTIES_DATA.find((p) => p.id === propertyId);
    if (prop) {
      if (isPrimary) {
        prop.images.forEach((img) => (img.is_primary = false));
        prop.primary_image = cleanUrl;
      }
      prop.images.push(newImg);
    }
    return newImg;
  }

  async deletePropertyImage(imageId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from('property_images').delete().eq('id', imageId);
      if (error) {
        throw new Error(`Database error deleting image: ${error.message}`);
      }
      return true;
    }

    for (const prop of PROPERTIES_DATA) {
      const idx = prop.images.findIndex((img) => img.id === imageId);
      if (idx >= 0) {
        prop.images.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  async setImageAsPrimary(propertyId: string, imageId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from('property_images')
        .update({ is_primary: false })
        .eq('property_id', propertyId);

      const { error } = await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) {
        throw new Error(`Database error setting primary image: ${error.message}`);
      }
      return true;
    }

    const prop = PROPERTIES_DATA.find((p) => p.id === propertyId);
    if (prop) {
      prop.images.forEach((img) => {
        img.is_primary = img.id === imageId;
        if (img.is_primary) prop.primary_image = img.image_url;
      });
      return true;
    }
    return false;
  }

  async reorderPropertyImages(
    propertyId: string,
    orders: { id: string; display_order: number }[]
  ): Promise<boolean> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      for (const item of orders) {
        await supabase
          .from('property_images')
          .update({ display_order: item.display_order })
          .eq('id', item.id)
          .eq('property_id', propertyId);
      }
      return true;
    }

    const prop = PROPERTIES_DATA.find((p) => p.id === propertyId);
    if (prop) {
      orders.forEach((o) => {
        const img = prop.images.find((i) => i.id === o.id);
        if (img) img.display_order = o.display_order;
      });
      prop.images.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
      return true;
    }
    return false;
  }
}


export const propertyRepository = new PropertyRepository();

