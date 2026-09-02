import { Request, Response, NextFunction } from 'express';
import { propertyService } from '../services/property.service';
import { PropertyFilterState } from '../shared/types';
import { successResponse } from '../lib/response';
import { AppError } from '../lib/response';

export class PropertyController {
  async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query;
      const filters: Partial<PropertyFilterState> = {
        searchQuery: (q.q as string) || '',
        citySlug: (q.city as string) || 'all',
        universityId: (q.university as string) || 'all',
        maxPrice: q.maxPrice ? Number(q.maxPrice) : 0,
        propertyType: (q.type as string) || 'all',
        sortBy: (q.sort as PropertyFilterState['sortBy']) || 'featured',
        page: q.page ? Number(q.page) : 1,
        limit: q.limit ? Number(q.limit) : 12,
      };

      const properties = await propertyService.searchProperties(filters);
      res.json(successResponse(properties));
    } catch (err) {
      next(err);
    }
  }

  async getPropertyBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const property = await propertyService.getPropertyBySlug(slug);
      if (!property) {
        throw new AppError(404, 'NOT_FOUND', `Logement '${slug}' introuvable.`);
      }
      res.json(successResponse(property));
    } catch (err) {
      next(err);
    }
  }

  async getFeaturedProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const properties = await propertyService.getFeaturedProperties();
      res.json(successResponse(properties));
    } catch (err) {
      next(err);
    }
  }
}

export const propertyController = new PropertyController();
