import { Router } from 'express';
import propertyRoutes from './property.routes';
import roomRoutes from './room.routes';
import bookingRoutes from './booking.routes';
import landlordRoutes from './landlord.routes';
import contactRoutes from './contact.routes';
import metaRoutes from './meta.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', version: 'v1', timestamp: new Date().toISOString() } });
});

// Auth & Domain routes
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/rooms', roomRoutes);
router.use('/booking-requests', bookingRoutes);
router.use('/landlord-properties', landlordRoutes);
router.use('/contact', contactRoutes);

// Protected Admin Back-Office routes (/api/v1/admin/*)
router.use('/admin', adminRoutes);

// Reference data routes (cities, universities, amenities)
router.use('/', metaRoutes);

export default router;
