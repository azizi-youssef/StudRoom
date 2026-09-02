import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { successResponse } from '../lib/response';

export class LandlordController {
  async getSubmissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const submissions = await bookingService.getAllLandlordSubmissions();
      res.json(successResponse(submissions));
    } catch (err) {
      next(err);
    }
  }

  async submitProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { proposalId, data } = await bookingService.processLandlordSubmission(req.body);
      res.status(201).json(
        successResponse({
          proposalId,
          message:
            'Votre proposition de logement a été reçue. Notre équipe vous recontactera rapidement.',
          data,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await bookingService.updateLandlordSubmissionStatus(id, status);
      res.json(successResponse(updated));
    } catch (err) {
      next(err);
    }
  }
}

export const landlordController = new LandlordController();
