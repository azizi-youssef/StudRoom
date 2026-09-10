import { PROPERTIES_DATA } from '../data/properties';
import { UNIVERSITIES_DATA } from '../data/universities';
import { CITIES_DATA } from '../data/cities';
import { PropertyDetail, RoomDetail, PropertyFilterState, PaginationMeta } from '../shared/types';
import { DbUniversity, DbCity } from '../shared/types/database';
import { getSupabaseAdmin } from '../config/supabase';


export class PropertyRepository {
  async findAllProperties(
    page = 1,
    limit = 50
  ): Promise<PropertyDetail[]> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error } = await supabase
          .from('properties')
          .select('*, city:cities(*), rooms(*), amenities:property_amenities(amenity:amenities(*)), images:property_images(*), proximities:university_proximities(*, university:universities(*))')
          .eq('is_available', true)
          .range(from, to);
        if (!error && data && data.length > 0) {
          return data as unknown as PropertyDetail[];
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA;
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
          return data as unknown as PropertyDetail;
        }
      } catch {
        // Fallback transparent to local dataset
      }
    }
    return PROPERTIES_DATA.find((p) => p.slug === slug) ?? null;
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
          return data as unknown as PropertyDetail[];
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
          return {
            rooms: data as unknown as RoomDetail[],
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
}

export const propertyRepository = new PropertyRepository();
