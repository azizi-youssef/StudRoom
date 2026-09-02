import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { validate } from '../middleware/validate.middleware';
import { contactFormSchema } from '../shared/schemas/contact.schema';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/contact — Admin only
router.get('/', ...requireAdmin, contactController.getContacts.bind(contactController));

// POST /api/v1/contact — Public
router.post('/', validate(contactFormSchema), contactController.submitContact.bind(contactController));

export default router;

