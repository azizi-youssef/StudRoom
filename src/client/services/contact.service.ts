import { ApiClient } from './api-client';
import { DbContactRequest } from '@/shared/types/database';
import { ApiResponse } from '@/shared/types/error';

export type ContactApiResponse = ApiResponse<{
  ticketId: string;
  message: string;
}>;

export type ContactListResponse = ApiResponse<DbContactRequest[]>;

export class ClientContactService {
  /** Submit a contact/support request — public endpoint */
  async submitContactTicket(data: unknown): Promise<ContactApiResponse> {
    return ApiClient.post<ContactApiResponse>('/contact', data);
  }

  /**
   * Get all contact tickets — admin only.
   * Automatically sends JWT token from localStorage.
   */
  async getAllTickets(): Promise<ContactListResponse> {
    return ApiClient.authGet<ContactListResponse>('/contact');
  }
}

export const clientContactService = new ClientContactService();
