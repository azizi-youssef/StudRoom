import { Request, Response, NextFunction } from 'express';
import { propertyService } from '../services/property.service';
import { PropertyFilterState } from '../shared/types';
import { successResponse, AppError } from '../lib/response';

export class RoomController {
  async getRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = req.query;
      const filters: Partial<PropertyFilterState> = {
        searchQuery: (q.q as string) || '',
        citySlug: (q.city as string) || 'all',
        universityId: (q.university as string) || 'all',
        maxPrice: q.maxPrice ? Number(q.maxPrice) : 0,
        roomType: (q.roomType as string) || 'all',
        sortBy: (q.sort as PropertyFilterState['sortBy']) || 'featured',
        page: q.page ? Number(q.page) : 1,
        limit: q.limit ? Number(q.limit) : 12,
      };

      const { rooms, meta } = await propertyService.searchRooms(filters);
      res.json(successResponse(rooms, meta));
    } catch (err) {
      next(err);
    }
  }

  async getRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const room = await propertyService.getRoomById(id);
      if (!room) {
        throw new AppError(404, 'NOT_FOUND', `Chambre '${id}' introuvable.`);
      }
      res.json(successResponse(room));
    } catch (err) {
      next(err);
    }
  }
}

export const roomController = new RoomController();
