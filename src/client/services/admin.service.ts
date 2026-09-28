import { ApiClient } from './api-client';
import { ApiResponse } from '@/shared/types/error';
import { PropertyDetail, RoomDetail } from '@/shared/types';
import { DbUser, DbAuditLog, DbPropertyImage, RoomStatus, UserRole, UserStatus } from '@/shared/types/database';
import {
  AdminCreatePropertyValues,
  AdminUpdatePropertyValues,
  AdminCreateRoomValues,
  AdminUpdateRoomValues,
} from '@/shared/schemas/admin.schema';

export interface DashboardMetrics {
  totalBookings: number;
  pendingBookings: number;
  contactedBookings: number;
  visitScheduledBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  totalProperties: number;
  totalRooms: number;
  availableRooms: number;
  reservedRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  totalProposals: number;
  newProposals: number;
  totalContacts: number;
  unresolvedContacts: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: DbAuditLog[];
}

/** Submission d'un bailleur souhaitant proposer un logement */
export interface LandlordSubmission {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  phone: string;
  email: string;
  city: string;
  neighborhood: string;
  property_type: string;
  rooms_count: number;
  surface_sqm: number;
  expected_rent_dh: number;
  monthly_price_dh?: number;
  availability_date: string;
  message?: string;
  description?: string;
  status: 'new' | 'contacted' | 'visited' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

/** Message de contact / ticket support envoyé depuis le site public */
export interface ContactRequest {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at?: string;
  read_at?: string;
}

export class ClientAdminService {
  // ─── DASHBOARD OVERVIEW ─────────────────────────────────────────────────────

  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return ApiClient.authGet<ApiResponse<DashboardData>>('/admin/dashboard');
  }

  // ─── PROPERTIES (CRUD) ──────────────────────────────────────────────────────

  async getProperties(): Promise<ApiResponse<PropertyDetail[]>> {
    return ApiClient.authGet<ApiResponse<PropertyDetail[]>>('/admin/properties');
  }

  async getProperty(id: string): Promise<ApiResponse<PropertyDetail>> {
    return ApiClient.authGet<ApiResponse<PropertyDetail>>(`/admin/properties/${id}`);
  }

  async createProperty(data: AdminCreatePropertyValues): Promise<ApiResponse<PropertyDetail>> {
    return ApiClient.authPost<ApiResponse<PropertyDetail>>('/admin/properties', data);
  }

  async updateProperty(id: string, data: AdminUpdatePropertyValues): Promise<ApiResponse<PropertyDetail>> {
    return ApiClient.authPatch<ApiResponse<PropertyDetail>>(`/admin/properties/${id}`, data);
  }

  async deleteProperty(id: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return ApiClient.authDelete<ApiResponse<{ success: boolean; message: string }>>(`/admin/properties/${id}`);
  }

  // ─── ROOMS (CRUD) ───────────────────────────────────────────────────────────

  async createRoom(propertyId: string, data: AdminCreateRoomValues): Promise<ApiResponse<RoomDetail>> {
    return ApiClient.authPost<ApiResponse<RoomDetail>>(`/admin/properties/${propertyId}/rooms`, data);
  }

  async updateRoom(roomId: string, data: AdminUpdateRoomValues): Promise<ApiResponse<RoomDetail>> {
    return ApiClient.authPatch<ApiResponse<RoomDetail>>(`/admin/rooms/${roomId}`, data);
  }

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<ApiResponse<RoomDetail>> {
    return ApiClient.authPatch<ApiResponse<RoomDetail>>(`/admin/rooms/${roomId}/status`, { status });
  }

  async deleteRoom(roomId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return ApiClient.authDelete<ApiResponse<{ success: boolean; message: string }>>(`/admin/rooms/${roomId}`);
  }

  // ─── IMAGES ─────────────────────────────────────────────────────────────────

  async addImage(
    propertyId: string,
    imageUrl: string,
    altText = '',
    isPrimary = false,
    displayOrder = 0
  ): Promise<ApiResponse<DbPropertyImage>> {
    return ApiClient.authPost<ApiResponse<DbPropertyImage>>(`/admin/properties/${propertyId}/images`, {
      imageUrl,
      altText,
      isPrimary,
      displayOrder,
    });
  }

  async deleteImage(imageId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return ApiClient.authDelete<ApiResponse<{ success: boolean; message: string }>>(`/admin/images/${imageId}`);
  }

  async setPrimaryImage(propertyId: string, imageId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return ApiClient.authPatch<ApiResponse<{ success: boolean; message: string }>>(`/admin/images/${imageId}/primary`, {
      propertyId,
    });
  }

  async reorderImages(
    propertyId: string,
    orders: { id: string; display_order: number }[]
  ): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return ApiClient.authPatch<ApiResponse<{ success: boolean; message: string }>>(
      `/admin/properties/${propertyId}/images/order`,
      { orders }
    );
  }

  // ─── LANDLORD CONVERSION ────────────────────────────────────────────────────

  async convertLandlordSubmission(
    submissionId: string,
    overrides?: {
      title?: string;
      city_id?: string;
      rooms_count?: number;
      monthly_price_dh?: number;
      surface_sqm?: number;
    }
  ): Promise<ApiResponse<PropertyDetail>> {
    return ApiClient.authPost<ApiResponse<PropertyDetail>>(
      `/admin/landlord-submissions/${submissionId}/convert`,
      overrides ?? {}
    );
  }

  // ─── USERS ──────────────────────────────────────────────────────────────────

  async getUsers(role?: string, status?: string): Promise<ApiResponse<DbUser[]>> {
    return ApiClient.authGet<ApiResponse<DbUser[]>>('/admin/users', { role, status });
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<ApiResponse<DbUser>> {
    return ApiClient.authPatch<ApiResponse<DbUser>>(`/admin/users/${userId}/status`, { status });
  }

  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<DbUser>> {
    return ApiClient.authPatch<ApiResponse<DbUser>>(`/admin/users/${userId}/role`, { role });
  }

  // ─── AUDIT LOGS ─────────────────────────────────────────────────────────────

  async getAuditLogs(limit = 50, offset = 0): Promise<ApiResponse<DbAuditLog[]>> {
    return ApiClient.authGet<ApiResponse<DbAuditLog[]>>('/admin/audit-logs', { limit, offset });
  }

  // ─── LANDLORD SUBMISSIONS ───────────────────────────────────────────────────

  async getLandlordSubmissions(): Promise<ApiResponse<LandlordSubmission[]>> {
    return ApiClient.authGet<ApiResponse<LandlordSubmission[]>>('/admin/landlord-submissions');
  }

  async updateLandlordSubmissionStatus(id: string, status: LandlordSubmission['status'] | string): Promise<ApiResponse<LandlordSubmission>> {
    return ApiClient.authPatch<ApiResponse<LandlordSubmission>>(`/admin/landlord-submissions/${id}/status`, { status });
  }

  // ─── CONTACT REQUESTS ───────────────────────────────────────────────────────

  async getContactRequests(): Promise<ApiResponse<ContactRequest[]>> {
    return ApiClient.authGet<ApiResponse<ContactRequest[]>>('/admin/contact-requests');
  }

  async updateContactRequestStatus(id: string, status: ContactRequest['status'] | string): Promise<ApiResponse<ContactRequest>> {
    return ApiClient.authPatch<ApiResponse<ContactRequest>>(`/admin/contact-requests/${id}/status`, { status });
  }

  // ─── SCHEDULE VISIT ─────────────────────────────────────────────────────────

  async scheduleVisit(
    bookingId: string,
    visit_date: string,
    visit_notes?: string
  ): Promise<ApiResponse<any>> {
    return ApiClient.authPatch<ApiResponse<any>>(`/admin/booking-requests/${bookingId}/visit`, {
      visit_date,
      visit_notes,
    });
  }

  // ─── REFERENTIAL SETTINGS ───────────────────────────────────────────────────

  async getCities(): Promise<ApiResponse<any[]>> {
    return ApiClient.get<ApiResponse<any[]>>('/cities');
  }

  async getUniversities(): Promise<ApiResponse<any[]>> {
    return ApiClient.get<ApiResponse<any[]>>('/universities');
  }

  async getAmenities(): Promise<ApiResponse<any[]>> {
    return ApiClient.get<ApiResponse<any[]>>('/amenities');
  }
}

export const clientAdminService = new ClientAdminService();

