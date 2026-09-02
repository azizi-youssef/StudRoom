import { Request, Response, NextFunction } from 'express';
import { metaService } from '../services/meta.service';
import { successResponse } from '../lib/response';

export class MetaController {
  async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cities = await metaService.getCities();
      res.json(successResponse(cities));
    } catch (err) {
      next(err);
    }
  }

  async getUniversities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const universities = await metaService.getUniversities();
      res.json(successResponse(universities));
    } catch (err) {
      next(err);
    }
  }

  async getAmenities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const amenities = await metaService.getAmenities();
      res.json(successResponse(amenities));
    } catch (err) {
      next(err);
    }
  }
}

export const metaController = new MetaController();
