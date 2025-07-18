import api from '@/lib/axios';
import {
  InitiateDonationRequest,
  InitiateDonationResponse,
  VerifyDonationRequest,
  VerifyDonationResponse,
  GetChurchProjectDonationsRequest,
  GetChurchProjectDonationsResponse,
  GetCommunityDonationsRequest,
  GetCommunityDonationsResponse,
  GetDonationResponse,
  DeleteDonationResponse
} from '@/types/donation';

const BASE_URL = '/api/v1/Donation';

// Donation operations
export const initiateDonation = async (
  payload: InitiateDonationRequest
): Promise<InitiateDonationResponse> => {
  const response = await api.post<InitiateDonationResponse>(
    `${BASE_URL}/InitiateDonation`,
    payload
  );
  return response.data;
};

export const verifyDonation = async (
  reference: VerifyDonationRequest
): Promise<VerifyDonationResponse> => {
  const response = await api.post<VerifyDonationResponse>(
    `${BASE_URL}/VerifyDonation`,
    reference, // Send as string in request body
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const getChurchProjectDonations = async (
  churchProjectId: number,
  searchFilter: GetChurchProjectDonationsRequest['searchFilter']
): Promise<GetChurchProjectDonationsResponse> => {
  const response = await api.post<GetChurchProjectDonationsResponse>(
    `${BASE_URL}/GetChurchProjectDonations?churchProjectId=${churchProjectId}`,
    searchFilter
  );
  return response.data;
};

export const getCommunityDonations = async (
  payload: GetCommunityDonationsRequest
): Promise<GetCommunityDonationsResponse> => {
  const response = await api.post<GetCommunityDonationsResponse>(
    `${BASE_URL}/GetCommunityDonations`,
    payload
  );
  return response.data;
};

export const getDonation = async (
  donationId: number
): Promise<GetDonationResponse> => {
  const response = await api.get<GetDonationResponse>(
    `${BASE_URL}/GetDonation?donation=${donationId}`
  );
  return response.data;
};

export const deleteDonation = async (
  donationId: number
): Promise<DeleteDonationResponse> => {
  const response = await api.delete<DeleteDonationResponse>(
    `${BASE_URL}/DeleteDonation?donation=${donationId}`
  );
  return response.data;
};