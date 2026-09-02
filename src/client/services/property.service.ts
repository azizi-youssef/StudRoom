import { ApiClient } from './api-client';
import { PropertyDetail, PropertyFilterState, PaginationMeta } from '@/shared/types';

export interface PropertySearchResponse {
  success: boolean;
  data: PropertyDetail[];
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
    if (filters?.propertyType && filters.propertyType !== 'all') params.type = filters.propertyType;
    if (filters?.sortBy) params.sort = filters.sortBy;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return ApiClient.get<PropertySearchResponse>('/properties', params);
  }

  async getFeaturedProperties(): Promise<PropertySearchResponse> {
    return ApiClient.get<PropertySearchResponse>('/properties/featured');
  }

  async getPropertyBySlug(slug: string): Promise<{ success: boolean; data: PropertyDetail }> {
    return ApiClient.get(`/properties/${slug}`);
  }
}

export const clientPropertyService = new ClientPropertyService();
