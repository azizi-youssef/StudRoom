import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { successResponse } from '../lib/response';

export class ContactController {
  async getContacts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contacts = await bookingService.getAllContactRequests();
      res.json(successResponse(contacts));
    } catch (err) {
      next(err);
    }
  }

  async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticketId, data } = await bookingService.processContactRequest(req.body);
      res.status(201).json(
        successResponse({
          ticketId,
          message: 'Message transmis avec succès. Notre équipe vous répondra sous 24h.',
          data,
        })
      );
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
