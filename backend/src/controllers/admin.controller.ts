import { Request, Response, NextFunction } from 'express';
import { propertyAdminService } from '../services/property.admin.service';
import { userAdminService } from '../services/user.admin.service';
import { landlordConversionService } from '../services/landlord.conversion.service';
import { bookingService } from '../services/booking.service';
import { bookingRepository } from '../repositories/booking.repository';
import { propertyRepository } from '../repositories/property.repository';
import { auditService } from '../services/audit.service';
import { successResponse } from '../lib/response';
import {
  adminCreatePropertySchema,
  adminUpdatePropertySchema,
  adminCreateRoomSchema,
  adminUpdateRoomSchema,
  adminUpdateRoomStatusSchema,
  adminUpdateUserStatusSchema,
  adminUpdateUserRoleSchema,
  adminScheduleVisitSchema,
  adminConvertSubmissionSchema,
} from '../shared/schemas/admin.schema';

export class AdminController {
  // ─── DASHBOARD OVERVIEW ─────────────────────────────────────────────────────

  async getDashboardOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [bookings, reservations, proposals, properties, auditLogs, contacts] = await Promise.all([
        bookingService.getAllBookings(),
        bookingService.getAllReservations(),
        bookingRepository.findAllLandlordSubmissions(),
        propertyAdminService.getAllProperties(),
        auditService.getLogs(15),
        bookingRepository.findAllContactRequests(),
      ]);

      const totalBookings = bookings.length;
      const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING').length;
      const contactedBookings = bookings.filter((b: any) => b.status === 'CONTACTED').length;
      const visitScheduledBookings = bookings.filter((b: any) => b.status === 'VISIT_SCHEDULED').length;
      const approvedBookings = bookings.filter((b: any) => b.status === 'APPROVED').length;

      let totalRooms = 0;
      let availableRooms = 0;
      let reservedRooms = 0;
      let occupiedRooms = 0;
      let maintenanceRooms = 0;

      properties.forEach((p: any) => {
        if (Array.isArray(p.rooms)) {
          p.rooms.forEach((r: any) => {
            totalRooms++;
            if (r.status === 'AVAILABLE') availableRooms++;
            else if (r.status === 'RESERVED') reservedRooms++;
            else if (r.status === 'OCCUPIED') occupiedRooms++;
            else if (r.status === 'MAINTENANCE') maintenanceRooms++;
          });
        }
      });

      const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;

      res.json(
        successResponse({
          metrics: {
            totalBookings,
            pendingBookings,
            contactedBookings,
            visitScheduledBookings,
            approvedBookings,
            totalProperties: properties.length,
            totalRooms,
            availableRooms,
            reservedRooms,
            occupiedRooms,
            maintenanceRooms,
            occupancyRate,
            totalProposals: proposals.length,
            newProposals: proposals.filter((p: any) => p.status === 'new').length,
            totalContacts: contacts.length,
            unresolvedContacts: contacts.filter((c: any) => c.status === 'new' || c.status === 'in_progress').length,
          },
          recentActivity: auditLogs,
        })
      );
    } catch (err) {
      next(err);
    }
  }

  // ─── PROPERTIES ─────────────────────────────────────────────────────────────

  async getProperties(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const properties = await propertyAdminService.getAllProperties();
      res.json(successResponse(properties));
    } catch (err) {
      next(err);
    }
  }

  async getPropertyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const property = await propertyAdminService.getPropertyById(req.params.id);
      res.json(successResponse(property));
    } catch (err) {
      next(err);
    }
  }

  async createProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = adminCreatePropertySchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const property = await propertyAdminService.createProperty(validated, actorUserId, req.ip);
      res.status(201).json(successResponse(property));
    } catch (err) {
      next(err);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = adminUpdatePropertySchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const property = await propertyAdminService.updateProperty(req.params.id, validated, actorUserId, req.ip);
      res.json(successResponse(property));
    } catch (err) {
      next(err);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = (req as any).user?.id;
      await propertyAdminService.deleteProperty(req.params.id, actorUserId, req.ip);
      res.json(successResponse({ success: true, message: 'Logement supprimé avec succès.' }));
    } catch (err) {
      next(err);
    }
  }

  // ─── ROOMS ──────────────────────────────────────────────────────────────────

  async createRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = adminCreateRoomSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const room = await propertyAdminService.createRoom(req.params.id, validated, actorUserId, req.ip);
      res.status(201).json(successResponse(room));
    } catch (err) {
      next(err);
    }
  }

  async updateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = adminUpdateRoomSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const room = await propertyAdminService.updateRoom(req.params.id, validated, actorUserId, req.ip);
      res.json(successResponse(room));
    } catch (err) {
      next(err);
    }
  }

  async updateRoomStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = adminUpdateRoomStatusSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const room = await propertyAdminService.updateRoomStatus(req.params.id, status, actorUserId, req.ip);
      res.json(successResponse(room));
    } catch (err) {
      next(err);
    }
  }

  async deleteRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = (req as any).user?.id;
      await propertyAdminService.deleteRoom(req.params.id, actorUserId, req.ip);
      res.json(successResponse({ success: true, message: 'Chambre supprimée avec succès.' }));
    } catch (err) {
      next(err);
    }
  }

  // ─── IMAGES ─────────────────────────────────────────────────────────────────

  async addImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { imageUrl, altText, isPrimary, displayOrder } = req.body;
      if (!imageUrl || typeof imageUrl !== 'string') {
        res.status(400).json({ success: false, error: 'URL de l image requise.' });
        return;
      }
      const actorUserId = (req as any).user?.id;
      const image = await propertyAdminService.addImage(
        req.params.id,
        imageUrl,
        altText || '',
        Boolean(isPrimary),
        displayOrder ? Number(displayOrder) : 0,
        actorUserId
      );
      res.status(201).json(successResponse(image));
    } catch (err) {
      next(err);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorUserId = (req as any).user?.id;
      await propertyAdminService.deleteImage(req.params.id, actorUserId);
      res.json(successResponse({ success: true, message: 'Image supprimée avec succès.' }));
    } catch (err) {
      next(err);
    }
  }

  async setPrimaryImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { propertyId } = req.body;
      const actorUserId = (req as any).user?.id;
      await propertyAdminService.setPrimaryImage(propertyId, req.params.id, actorUserId);
      res.json(successResponse({ success: true, message: 'Image principale définie avec succès.' }));
    } catch (err) {
      next(err);
    }
  }

  async reorderImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orders } = req.body;
      const actorUserId = (req as any).user?.id;
      await propertyAdminService.reorderImages(req.params.id, orders, actorUserId);
      res.json(successResponse({ success: true, message: 'Ordre des images mis à jour avec succès.' }));
    } catch (err) {
      next(err);
    }
  }

  // ─── CONVERT LANDLORD SUBMISSION ────────────────────────────────────────────

  async convertLandlordSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const overrides = adminConvertSubmissionSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const property = await landlordConversionService.convertSubmission(
        req.params.id,
        overrides,
        actorUserId,
        req.ip
      );
      res.status(201).json(successResponse(property));
    } catch (err) {
      next(err);
    }
  }

  // ─── USERS ──────────────────────────────────────────────────────────────────

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, status } = req.query;
      const users = await userAdminService.listUsers(role as string, status as string);
      res.json(successResponse(users));
    } catch (err) {
      next(err);
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = adminUpdateUserStatusSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const user = await userAdminService.changeStatus(req.params.id, status, actorUserId, req.ip);
      res.json(successResponse(user));
    } catch (err) {
      next(err);
    }
  }

  async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role } = adminUpdateUserRoleSchema.parse(req.body);
      const actorUserId = (req as any).user?.id;
      const user = await userAdminService.changeRole(req.params.id, role, actorUserId, req.ip);
      res.json(successResponse(user));
    } catch (err) {
      next(err);
    }
  }

  // ─── AUDIT LOGS ─────────────────────────────────────────────────────────────

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;
      const logs = await auditService.getLogs(limit, offset);
      res.json(successResponse(logs));
    } catch (err) {
      next(err);
    }
  }

  // ─── SCHEDULE VISIT ─────────────────────────────────────────────────────────

  async scheduleVisit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { visit_date, visit_notes } = adminScheduleVisitSchema.parse(req.body);
      const booking = await bookingRepository.updateBookingStatus(req.params.id, 'VISIT_SCHEDULED');

      const supabase = (await import('../config/supabase')).getSupabaseAdmin();
      if (supabase) {
        await supabase
          .from('booking_requests')
          .update({
            visit_date,
            visit_notes,
            status: 'VISIT_SCHEDULED',
            updated_at: new Date().toISOString(),
          })
          .eq('id', req.params.id);
      }

      await auditService.record({
        actorUserId: (req as any).user?.id,
        action: 'SCHEDULE_VISIT',
        entityType: 'booking_request',
        entityId: req.params.id,
        newValue: { visit_date, visit_notes, status: 'VISIT_SCHEDULED' },
        ipAddress: req.ip,
      });

      res.json(successResponse(booking));
    } catch (err) {
      next(err);
    }
  }

  // ─── LANDLORD SUBMISSIONS ───────────────────────────────────────────────────

  async getLandlordSubmissions(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const submissions = await bookingRepository.findAllLandlordSubmissions();
      res.json(successResponse(submissions));
    } catch (err) {
      next(err);
    }
  }

  async updateLandlordSubmissionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await bookingRepository.updateLandlordSubmissionStatus(req.params.id, status);

      await auditService.record({
        actorUserId: (req as any).user?.id,
        action: 'UPDATE_LANDLORD_SUBMISSION',
        entityType: 'landlord_submission',
        entityId: req.params.id,
        newValue: { status },
        ipAddress: req.ip,
      });

      res.json(successResponse(updated));
    } catch (err) {
      next(err);
    }
  }

  // ─── CONTACT REQUESTS ───────────────────────────────────────────────────────

  async getContactRequests(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contacts = await bookingRepository.findAllContactRequests();
      res.json(successResponse(contacts));
    } catch (err) {
      next(err);
    }
  }

  async updateContactRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await bookingRepository.updateContactRequestStatus(req.params.id, status);

      await auditService.record({
        actorUserId: (req as any).user?.id,
        action: 'UPDATE_CONTACT_STATUS',
        entityType: 'contact_request',
        entityId: req.params.id,
        newValue: { status },
        ipAddress: req.ip,
      });

      res.json(successResponse(updated));
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();

