import { propertyRepository } from '../repositories/property.repository';
import { DbUniversity, DbCity, DbAmenity } from '../shared/types/database';
import { AMENITIES_DATA } from '../data/amenities';

export class MetaService {
  async getCities(): Promise<DbCity[]> {
    return propertyRepository.findAllCities();
  }

  async getUniversities(): Promise<DbUniversity[]> {
    return propertyRepository.findAllUniversities();
  }

  async getAmenities(): Promise<DbAmenity[]> {
    return AMENITIES_DATA;
  }
}

export const metaService = new MetaService();
