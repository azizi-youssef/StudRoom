import { propertyRepository } from '../repositories/property.repository';
import { PropertyDetail, RoomDetail, PropertyFilterState, PaginationMeta } from '../shared/types';
import { PropertyStatus } from '../shared/types/database';

export class PropertyService {
  /**
   * Recherche de propriétés avec filtres SQL déportés.
   * Le statut dynamique (AVAILABLE / PARTIALLY_OCCUPIED / FULLY_OCCUPIED)
   * est calculé côté JS à partir du nombre de chambres disponibles.
   */
  async searchProperties(
    filters?: Partial<PropertyFilterState>
  ): Promise<{ properties: PropertyDetail[]; meta: PaginationMeta }> {
    const { properties, meta } = await propertyRepository.findPropertiesFiltered(filters ?? {});

    // Calcul du statut dynamique depuis les sous-chambres
    const enriched = properties.map((property) => {
      const availableCount = property.rooms.filter((r) => r.status === 'AVAILABLE').length;
      const totalCount     = property.rooms.length;

      let status: PropertyStatus = 'AVAILABLE';
      if (availableCount === 0) status = 'FULLY_OCCUPIED';
      else if (availableCount < totalCount) status = 'PARTIALLY_OCCUPIED';

      const prices   = property.rooms.map((r) => r.price_monthly);
      const minPrice = prices.length > 0 ? Math.min(...prices) : property.min_price_dh;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : property.max_price_dh;

      return {
        ...property,
        available_rooms: availableCount,
        total_rooms:     totalCount,
        min_price_dh:    minPrice,
        max_price_dh:    maxPrice,
        status,
        is_available:    availableCount > 0,
      };
    });

    return { properties: enriched, meta };
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

  /**
   * Vérifie formellement que le bien appartient au bailleur connecté
   */
  async verifyLandlordOwnership(propertyId: string, landlordUserId: string): Promise<boolean> {
    const property = await propertyRepository.findPropertyById(propertyId);
    if (!property) return false;

    let landlordId = landlordUserId;

    if (typeof fetch !== 'undefined') {
      const { getSupabaseAdmin } = await import('../config/supabase');
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000));
          const query = supabase
            .from('landlords')
            .select('id')
            .eq('user_id', landlordUserId)
            .maybeSingle();

          const result = await Promise.race([query, timeout]);
          if (result && 'data' in result && result.data?.id) {
            landlordId = result.data.id;
          }
        } catch {
          // Fallback transparent
        }
      }
    }

    return property.landlord_id === landlordId;
  }


  async getPropertiesByLandlord(landlordId: string): Promise<PropertyDetail[]> {
    return propertyRepository.findPropertiesByLandlord(landlordId);
  }
}

export const propertyService = new PropertyService();

