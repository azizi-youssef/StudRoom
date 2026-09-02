import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validate } from '../middleware/validate.middleware';
import { bookingFormSchema } from '../shared/schemas/booking.schema';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/booking-requests — Admin only
router.get('/', ...requireAdmin, bookingController.getBookings.bind(bookingController));

// POST /api/v1/booking-requests — Public (students submit without account)
router.post('/', validate(bookingFormSchema), bookingController.createBooking.bind(bookingController));

// PATCH /api/v1/booking-requests/:id/status — Admin only
router.patch('/:id/status', ...requireAdmin, bookingController.updateStatus.bind(bookingController));

export default router;
