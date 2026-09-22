import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Apply requireAdmin to all routes in this sub-router
router.use(...requireAdmin);

// ─── DASHBOARD OVERVIEW ───────────────────────────────────────────────────────
router.get('/dashboard', adminController.getDashboardOverview.bind(adminController));

// ─── PROPERTIES (CRUD) ────────────────────────────────────────────────────────
router.get('/properties', adminController.getProperties.bind(adminController));
router.post('/properties', adminController.createProperty.bind(adminController));
router.get('/properties/:id', adminController.getPropertyById.bind(adminController));
router.patch('/properties/:id', adminController.updateProperty.bind(adminController));
router.delete('/properties/:id', adminController.deleteProperty.bind(adminController));

// ─── ROOMS (CRUD) ─────────────────────────────────────────────────────────────
router.post('/properties/:id/rooms', adminController.createRoom.bind(adminController));
router.patch('/rooms/:id', adminController.updateRoom.bind(adminController));
router.patch('/rooms/:id/status', adminController.updateRoomStatus.bind(adminController));
router.delete('/rooms/:id', adminController.deleteRoom.bind(adminController));

// ─── IMAGES ───────────────────────────────────────────────────────────────────
router.post('/properties/:id/images', adminController.addImage.bind(adminController));
router.delete('/images/:id', adminController.deleteImage.bind(adminController));
router.patch('/images/:id/primary', adminController.setPrimaryImage.bind(adminController));
router.patch('/properties/:id/images/order', adminController.reorderImages.bind(adminController));

// ─── LANDLORD SUBMISSIONS & CONVERSION ────────────────────────────────────────
router.get('/landlord-submissions', adminController.getLandlordSubmissions.bind(adminController));
router.patch('/landlord-submissions/:id/status', adminController.updateLandlordSubmissionStatus.bind(adminController));
router.post('/landlord-submissions/:id/convert', adminController.convertLandlordSubmission.bind(adminController));

// ─── CONTACT REQUESTS ─────────────────────────────────────────────────────────
router.get('/contact-requests', adminController.getContactRequests.bind(adminController));
router.patch('/contact-requests/:id/status', adminController.updateContactRequestStatus.bind(adminController));


// ─── USERS ────────────────────────────────────────────────────────────────────
router.get('/users', adminController.getUsers.bind(adminController));
router.patch('/users/:id/status', adminController.updateUserStatus.bind(adminController));
router.patch('/users/:id/role', adminController.updateUserRole.bind(adminController));

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
router.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

// ─── VISITS ───────────────────────────────────────────────────────────────────
router.patch('/booking-requests/:id/visit', adminController.scheduleVisit.bind(adminController));

export default router;
