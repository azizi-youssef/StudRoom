import { propertyRepository } from '../repositories/property.repository';
import { PropertyDetail, RoomDetail, PropertyFilterState, PaginationMeta } from '../shared/types';
import { PropertyStatus } from '../shared/types/database';

export class PropertyService {
  async searchProperties(filters?: Partial<PropertyFilterState>): Promise<PropertyDetail[]> {
    let properties = await propertyRepository.findAllProperties();

    // Dynamically compute status from room statuses
    properties = properties.map((property) => {
      const availableCount = property.rooms.filter((r) => r.status === 'AVAILABLE').length;
      const totalCount = property.rooms.length;

      let status: PropertyStatus = 'AVAILABLE';
      if (availableCount === 0) status = 'FULLY_OCCUPIED';
      else if (availableCount < totalCount) status = 'PARTIALLY_OCCUPIED';

      const prices = property.rooms.map((r) => r.price_monthly);
      const minPrice = prices.length > 0 ? Math.min(...prices) : property.min_price_dh;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : property.max_price_dh;

      return {
        ...property,
        available_rooms: availableCount,
        total_rooms: totalCount,
        min_price_dh: minPrice,
        max_price_dh: maxPrice,
        status,
        is_available: availableCount > 0,
      };
    });

    if (!filters) return properties;

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

    if (filters.propertyType && filters.propertyType !== 'all') {
      properties = properties.filter((p) => p.property_type === filters.propertyType);
    }

    if (filters.sortBy === 'price_asc') {
      properties.sort((a, b) => a.min_price_dh - b.min_price_dh);
    } else if (filters.sortBy === 'price_desc') {
      properties.sort((a, b) => b.min_price_dh - a.min_price_dh);
    }

    // Pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 12;
    const total = properties.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;

    return properties.slice(startIndex, startIndex + limit);
  }

  async getPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
    const property = await propertyRepository.findPropertyBySlug(slug);
    if (!property) return null;

    const availableCount = property.rooms.filter((r) => r.status === 'AVAILABLE').length;
    const status: PropertyStatus =
      availableCount === 0
        ? 'FULLY_OCCUPIED'
        : availableCount < property.rooms.length
        ? 'PARTIALLY_OCCUPIED'
        : 'AVAILABLE';

    return { ...property, available_rooms: availableCount, status };
  }

  async getFeaturedProperties(): Promise<PropertyDetail[]> {
    const featured = await propertyRepository.findFeaturedProperties();
    return featured;
  }

  async searchRooms(
    filters?: Partial<PropertyFilterState>
  ): Promise<{ rooms: RoomDetail[]; meta: PaginationMeta }> {
    return propertyRepository.findRooms(filters);
  }

  async getRoomById(id: string): Promise<RoomDetail | null> {
    return propertyRepository.findRoomById(id);
  }
}

export const propertyService = new PropertyService();
