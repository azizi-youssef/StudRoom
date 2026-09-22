import { propertyRepository } from '../repositories/property.repository';
import { auditService } from './audit.service';
import { PropertyDetail, RoomDetail } from '../shared/types';
import { DbPropertyImage, RoomStatus } from '../shared/types/database';
import {
  AdminCreatePropertyValues,
  AdminUpdatePropertyValues,
  AdminCreateRoomValues,
  AdminUpdateRoomValues,
} from '../shared/schemas/admin.schema';
import { AppError } from '../lib/response';

export class PropertyAdminService {
  async getAllProperties(): Promise<PropertyDetail[]> {
    return propertyRepository.findAllProperties(1, 200);
  }

  async getPropertyById(id: string): Promise<PropertyDetail> {
    const property = await propertyRepository.findPropertyById(id);
    if (!property) {
      throw new AppError(404, 'NOT_FOUND', `Logement avec l'ID ${id} introuvable.`);
    }
    return property;
  }

  async createProperty(
    data: AdminCreatePropertyValues,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<PropertyDetail> {
    const property = await propertyRepository.createProperty(data);

    await auditService.record({
      actorUserId,
      action: 'CREATE_PROPERTY',
      entityType: 'property',
      entityId: property.id,
      newValue: { title: property.title, slug: property.slug, city_id: property.city_id },
      ipAddress,
    });

    return property;
  }

  async updateProperty(
    id: string,
    data: AdminUpdatePropertyValues,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<PropertyDetail> {
    const existing = await propertyRepository.findPropertyById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Logement introuvable.`);
    }

    const updated = await propertyRepository.updateProperty(id, data);

    await auditService.record({
      actorUserId,
      action: 'UPDATE_PROPERTY',
      entityType: 'property',
      entityId: id,
      oldValue: { title: existing.title, status: existing.status, is_available: existing.is_available },
      newValue: { title: updated.title, status: updated.status, is_available: updated.is_available },
      ipAddress,
    });

    return updated;
  }

  async deleteProperty(
    id: string,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<boolean> {
    const existing = await propertyRepository.findPropertyById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Logement introuvable.`);
    }

    const deleted = await propertyRepository.deleteProperty(id);

    await auditService.record({
      actorUserId,
      action: 'DELETE_PROPERTY',
      entityType: 'property',
      entityId: id,
      oldValue: { title: existing.title, slug: existing.slug },
      ipAddress,
    });

    return deleted;
  }

  // ─── ROOMS ──────────────────────────────────────────────────────────────────

  async createRoom(
    propertyId: string,
    data: AdminCreateRoomValues,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<RoomDetail> {
    const property = await propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new AppError(404, 'NOT_FOUND', `Logement parent introuvable.`);
    }

    const room = await propertyRepository.createRoom(propertyId, data);

    await auditService.record({
      actorUserId,
      action: 'CREATE_ROOM',
      entityType: 'room',
      entityId: room.id,
      newValue: { property_id: propertyId, name: room.name, price_monthly: room.price_monthly, status: room.status },
      ipAddress,
    });

    return room;
  }

  async updateRoom(
    roomId: string,
    data: AdminUpdateRoomValues,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<RoomDetail> {
    const existing = await propertyRepository.findRoomById(roomId);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Chambre introuvable.`);
    }

    const updated = await propertyRepository.updateRoom(roomId, data);

    await auditService.record({
      actorUserId,
      action: 'UPDATE_ROOM',
      entityType: 'room',
      entityId: roomId,
      oldValue: { name: existing.name, price_monthly: existing.price_monthly, status: existing.status },
      newValue: { name: updated.name, price_monthly: updated.price_monthly, status: updated.status },
      ipAddress,
    });

    return updated;
  }

  async updateRoomStatus(
    roomId: string,
    status: RoomStatus,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<RoomDetail> {
    const existing = await propertyRepository.findRoomById(roomId);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Chambre introuvable.`);
    }

    await propertyRepository.updateRoomStatus(roomId, status);
    const updated = (await propertyRepository.findRoomById(roomId))!;

    await auditService.record({
      actorUserId,
      action: 'CHANGE_ROOM_STATUS',
      entityType: 'room',
      entityId: roomId,
      oldValue: { status: existing.status },
      newValue: { status: updated.status },
      ipAddress,
    });

    return updated;
  }

  async deleteRoom(
    roomId: string,
    actorUserId?: string,
    ipAddress?: string
  ): Promise<boolean> {
    const existing = await propertyRepository.findRoomById(roomId);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', `Chambre introuvable.`);
    }

    const deleted = await propertyRepository.deleteRoom(roomId);

    await auditService.record({
      actorUserId,
      action: 'DELETE_ROOM',
      entityType: 'room',
      entityId: roomId,
      oldValue: { name: existing.name, property_id: existing.property_id },
      ipAddress,
    });

    return deleted;
  }

  // ─── IMAGES ─────────────────────────────────────────────────────────────────

  async addImage(
    propertyId: string,
    imageUrl: string,
    altText = '',
    isPrimary = false,
    displayOrder = 0,
    actorUserId?: string
  ): Promise<DbPropertyImage> {
    const img = await propertyRepository.addPropertyImage(propertyId, imageUrl, altText, isPrimary, displayOrder);

    await auditService.record({
      actorUserId,
      action: 'ADD_PROPERTY_IMAGE',
      entityType: 'property_image',
      entityId: img.id,
      newValue: { property_id: propertyId, image_url: img.image_url, is_primary: img.is_primary },
    });

    return img;
  }

  async deleteImage(
    imageId: string,
    actorUserId?: string
  ): Promise<boolean> {
    const deleted = await propertyRepository.deletePropertyImage(imageId);

    await auditService.record({
      actorUserId,
      action: 'DELETE_PROPERTY_IMAGE',
      entityType: 'property_image',
      entityId: imageId,
    });

    return deleted;
  }

  async setPrimaryImage(
    propertyId: string,
    imageId: string,
    actorUserId?: string
  ): Promise<boolean> {
    const result = await propertyRepository.setImageAsPrimary(propertyId, imageId);

    await auditService.record({
      actorUserId,
      action: 'SET_PRIMARY_IMAGE',
      entityType: 'property_image',
      entityId: imageId,
      newValue: { property_id: propertyId, is_primary: true },
    });

    return result;
  }

  async reorderImages(
    propertyId: string,
    orders: { id: string; display_order: number }[],
    actorUserId?: string
  ): Promise<boolean> {
    const result = await propertyRepository.reorderPropertyImages(propertyId, orders);

    await auditService.record({
      actorUserId,
      action: 'REORDER_PROPERTY_IMAGES',
      entityType: 'property',
      entityId: propertyId,
      newValue: { orders },
    });

    return result;
  }
}

export const propertyAdminService = new PropertyAdminService();
