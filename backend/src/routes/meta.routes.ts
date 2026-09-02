import { Router } from 'express';
import { metaController } from '../controllers/meta.controller';

const router = Router();

// GET /api/v1/cities
router.get('/cities', metaController.getCities.bind(metaController));

// GET /api/v1/universities
router.get('/universities', metaController.getUniversities.bind(metaController));

// GET /api/v1/amenities
router.get('/amenities', metaController.getAmenities.bind(metaController));

export default router;
