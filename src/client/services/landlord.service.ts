import { ApiClient } from './api-client';
import { DbLandlordSubmission } from '@/shared/types/database';
import { ApiResponse } from '@/shared/types/error';

export type LandlordApiResponse = ApiResponse<{
  proposalId: string;
  message: string;
}>;

export type LandlordListResponse = ApiResponse<DbLandlordSubmission[]>;

export class ClientLandlordService {
  /** Submit a property proposal — public endpoint */
  async submitPropertyProposal(data: unknown): Promise<LandlordApiResponse> {
    return ApiClient.post<LandlordApiResponse>('/landlord-properties', data);
  }

  /**
   * Get all landlord proposals — admin only.
   * Automatically sends JWT token from localStorage.
   */
  async getAllProposals(): Promise<LandlordListResponse> {
    return ApiClient.authGet<LandlordListResponse>('/landlord-properties');
  }

  /**
   * Update proposal status — admin only.
   * Automatically sends JWT token from localStorage.
   */
  async updateProposalStatus(
    id: string,
    status: DbLandlordSubmission['status']
  ): Promise<ApiResponse<DbLandlordSubmission>> {
    return ApiClient.authPatch<ApiResponse<DbLandlordSubmission>>(
      `/landlord-properties/${id}/status`,
      { status }
    );
  }
}

export const clientLandlordService = new ClientLandlordService();
