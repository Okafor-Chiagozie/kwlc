import api from '@/lib/axios';
import {
  CreateOrUpdateMinisterRequest,
  CreateOrUpdateMinisterResponse,
  SearchMinistersRequest,
  SearchMinistersResponse,
  GetAllMinistersResponse,
  DeleteMinisterResponse
} from '@/types/minister';

const BASE_URL = '/api/v1/Minister';

// Minister operations
export const createOrUpdateMinister = async (
  payload: CreateOrUpdateMinisterRequest
): Promise<CreateOrUpdateMinisterResponse> => {
  // Note: API endpoint has a typo - "CreateOrUpdateMinster" instead of "CreateOrUpdateMinister"
  const response = await api.post<CreateOrUpdateMinisterResponse>(
    `${BASE_URL}/CreateOrUpdateMinster`,
    payload
  );
  return response.data;
};

export const searchMinisters = async (
  payload: SearchMinistersRequest
): Promise<SearchMinistersResponse> => {
  const response = await api.post<SearchMinistersResponse>(
    `${BASE_URL}/SearchMinisters`,
    payload
  );
  return response.data;
};

export const getAllMinisters = async (): Promise<GetAllMinistersResponse> => {
  const response = await api.get<GetAllMinistersResponse>(
    `${BASE_URL}/GetAllMinisters`
  );
  return response.data;
};

export const deleteMinister = async (
  id: number
): Promise<DeleteMinisterResponse> => {
  const response = await api.delete<DeleteMinisterResponse>(
    `${BASE_URL}/DeleteMinister?id=${id}`
  );
  return response.data;
};