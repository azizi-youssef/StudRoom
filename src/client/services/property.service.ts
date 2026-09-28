import { ApiClient } from './api-client';
import { PropertyDetail, PropertyFilterState, PaginationMeta } from '@/shared/types';
import { PROPERTIES_DATA } from '@/data/properties';

export interface PropertySearchResult {
  properties: PropertyDetail[];
  meta: PaginationMeta;
}

export interface PropertySearchResponse {
  success: boolean;
  data: PropertySearchResult;
  pagination?: PaginationMeta;
}

export interface RoomSearchResponse {
  success: boolean;
  data: any[];
  pagination?: PaginationMeta;
}

export class ClientPropertyService {
  async searchProperties(
    filters?: Partial<PropertyFilterState>
  ): Promise<PropertySearchResponse> {
    const params: Record<string, string | number | undefined> = {};
    if (filters?.searchQuery) params.q = filters.searchQuery;
    if (filters?.citySlug && filters.citySlug !== 'all') params.city = filters.citySlug;
    if (filters?.universityId && filters.universityId !== 'all') params.university = filters.universityId;
    if (filters?.maxPrice && filters.maxPrice > 0) params.maxPrice = filters.maxPrice;
    if (filters?.minPrice && filters.minPrice > 0) params.minPrice = filters.minPrice;
    if (filters?.propertyType && filters.propertyType !== 'all') params.type = filters.propertyType;
    if (filters?.availability && filters.availability !== 'all') params.availability = filters.availability;
    if (filters?.onlyVerified) params.verified = 'true';
    if (filters?.sortBy) params.sort = filters.sortBy;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    try {
      const response = await ApiClient.get<PropertySearchResponse>('/properties', params);
      if (response && response.data && Array.isArray(response.data.properties)) {
        return response;
      }
    } catch {
      // Backend non joignable ou erreur — fallback transparent sur les données enrichies locales
    }

    return this.filterLocally(filters);
  }

  private filterLocally(filters?: Partial<PropertyFilterState>): PropertySearchResponse {
    let list = [...PROPERTIES_DATA];

    if (filters?.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.city.name.toLowerCase().includes(q)
      );
    }

    if (filters?.citySlug && filters.citySlug !== 'all') {
      list = list.filter((p) => p.city.slug === filters.citySlug);
    }

    if (filters?.universityId && filters.universityId !== 'all') {
      list = list.filter((p) =>
        p.proximities.some((prox) => prox.university_id === filters.universityId)
      );
    }

    if (filters?.propertyType && filters.propertyType !== 'all') {
      list = list.filter((p) => p.property_type === filters.propertyType);
    }

    if (filters?.maxPrice && filters.maxPrice > 0) {
      list = list.filter((p) => p.min_price_dh <= filters.maxPrice!);
    }

    if (filters?.minPrice && filters.minPrice > 0) {
      list = list.filter((p) => p.min_price_dh >= filters.minPrice!);
    }

    if (filters?.onlyVerified) {
      list = list.filter((p) => p.is_verified);
    }

    if (filters?.availability && filters.availability !== 'all') {
      if (filters.availability === 'now') {
        list = list.filter((p) => p.availability_type === 'AVAILABLE_NOW');
      } else if (filters.availability === 'october') {
        list = list.filter((p) => p.availability_type === 'AVAILABLE_OCTOBER');
      } else if (filters.availability === 'occupied') {
        list = list.filter((p) => p.availability_type === 'FULLY_BOOKED');
      }
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      list = list.filter((p) =>
        filters.amenities!.every((aId) => p.amenities.some((a) => a.id === aId))
      );
    }

    // Tri
    if (filters?.sortBy === 'price_asc') {
      list.sort((a, b) => a.min_price_dh - b.min_price_dh);
    } else if (filters?.sortBy === 'price_desc') {
      list.sort((a, b) => b.min_price_dh - a.min_price_dh);
    } else if (filters?.sortBy === 'rating') {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (filters?.sortBy === 'proximity' && filters?.universityId && filters.universityId !== 'all') {
      list.sort((a, b) => {
        const proxA = a.proximities.find((p) => p.university_id === filters.universityId)?.distance_km ?? 999;
        const proxB = b.proximities.find((p) => p.university_id === filters.universityId)?.distance_km ?? 999;
        return proxA - proxB;
      });
    }

    return {
      success: true,
      data: {
        properties: list,
        meta: {
          total: list.length,
          page: 1,
          limit: 50,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }

  async getFeaturedProperties(): Promise<PropertySearchResponse> {
    try {
      const response = await ApiClient.get<PropertySearchResponse>('/properties/featured');
      if (response && response.data) return response;
    } catch {
      // Fallback
    }

    const featured = PROPERTIES_DATA.filter((p) => p.featured);
    return {
      success: true,
      data: {
        properties: featured,
        meta: {
          total: featured.length,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    };
  }

  async getPropertyBySlug(slug: string): Promise<{ success: boolean; data: PropertyDetail }> {
    try {
      const res = await ApiClient.get<{ success: boolean; data: PropertyDetail }>(`/properties/${slug}`);
      if (res && res.data) return res;
    } catch {
      // Fallback
    }

    const found = PROPERTIES_DATA.find((p) => p.slug === slug);
    if (found) {
      return { success: true, data: found };
    }
    throw new Error('Logement non trouvé');
  }
}

export const clientPropertyService = new ClientPropertyService();
