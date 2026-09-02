import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { successResponse } from '../lib/response';

export class BookingController {
  async getBookings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await bookingService.getAllBookings();
      res.json(successResponse(bookings));
    } catch (err) {
      next(err);
    }
  }

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { bookingId, data } = await bookingService.processBooking(req.body);
      res.status(201).json(
        successResponse({
          bookingId,
          message: 'Demande de réservation enregistrée avec succès.',
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
      const updated = await bookingService.updateBookingStatus(id, status);
      res.json(successResponse(updated));
    } catch (err) {
      next(err);
    }
  }
}

export const bookingController = new BookingController();
