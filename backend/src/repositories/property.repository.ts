import { PROPERTIES_DATA } from '../data/properties';
import { UNIVERSITIES_DATA } from '../data/universities';
import { CITIES_DATA } from '../data/cities';
import { PropertyDetail, RoomDetail, PropertyFilterState, PaginationMeta } from '../shared/types';
import { DbUniversity, DbCity } from '../shared/types/database';
import { getSupabaseAdmin } from '../config/supabase';


export class PropertyRepository {
  async findAllProperties(): Promise<PropertyDetail[]> {
    return PROPERTIES_DATA;
  }

  async findPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
    return PROPERTIES_DATA.find((p) => p.slug === slug) ?? null;
  }

  async findFeaturedProperties(): Promise<PropertyDetail[]> {
    return PROPERTIES_DATA.filter((p) => p.featured);
  }

  async findRooms(
    filters?: Partial<PropertyFilterState>
  ): Promise<{ rooms: RoomDetail[]; meta: PaginationMeta }> {
    let allRooms: RoomDetail[] = [];

    // Flatten all rooms with their parent property and city
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

      // Status filter — only AVAILABLE by default unless specified
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
