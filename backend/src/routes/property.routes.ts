import { Router } from 'express';
import { propertyController } from '../controllers/property.controller';

const router = Router();

// GET /api/v1/properties
router.get('/', propertyController.getProperties.bind(propertyController));

// GET /api/v1/properties/featured
router.get('/featured', propertyController.getFeaturedProperties.bind(propertyController));

// GET /api/v1/properties/:slug
router.get('/:slug', propertyController.getPropertyBySlug.bind(propertyController));

export default router;
