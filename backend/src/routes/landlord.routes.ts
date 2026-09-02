import { Router } from 'express';
import { landlordController } from '../controllers/landlord.controller';
import { validate } from '../middleware/validate.middleware';
import { landlordFormSchema } from '../shared/schemas/landlord.schema';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/landlord-properties — Admin only
router.get('/', ...requireAdmin, landlordController.getSubmissions.bind(landlordController));

// POST /api/v1/landlord-properties — Public (landlords submit without account)
router.post('/', validate(landlordFormSchema), landlordController.submitProperty.bind(landlordController));

// PATCH /api/v1/landlord-properties/:id/status — Admin only
router.patch('/:id/status', ...requireAdmin, landlordController.updateStatus.bind(landlordController));

export default router;

