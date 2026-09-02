import { ApiClient } from './api-client';
import { DbBookingRequest, BookingStatus } from '@/shared/types/database';
import { ApiResponse } from '@/shared/types/error';

export type BookingApiResponse = ApiResponse<{
  bookingId: string;
  message: string;
  data?: DbBookingRequest;
}>;

export type BookingListResponse = ApiResponse<DbBookingRequest[]>;

export class ClientBookingService {
  /** Submit a new booking request — public endpoint */
  async submitBooking(data: unknown): Promise<BookingApiResponse> {
    return ApiClient.post<BookingApiResponse>('/booking-requests', data);
  }

  /**
   * Get all bookings — admin only.
   * Automatically sends JWT token from localStorage.
   */
  async getAllBookings(): Promise<BookingListResponse> {
    return ApiClient.authGet<BookingListResponse>('/booking-requests');
  }

  /**
   * Update booking status — admin only.
   * Automatically sends JWT token from localStorage.
   */
  async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<ApiResponse<DbBookingRequest>> {
    return ApiClient.authPatch<ApiResponse<DbBookingRequest>>(
      `/booking-requests/${id}/status`,
      { status }
    );
  }
}

export const clientBookingService = new ClientBookingService();
