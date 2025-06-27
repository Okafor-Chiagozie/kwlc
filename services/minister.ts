import api from '@/lib/axios';
import {
  CreateOrUpdateMinisterRequest,
  CreateOrUpdateMinisterResponse,
  SearchMinistersRequest,
  SearchMinistersResponse,
  GetAllMinistersResponse,
  DeleteMinisterResponse,
  StandardApiResponse,
  Minister
} from '@/types/minister';

export const createOrUpdateMinister = async (
  minister: CreateOrUpdateMinisterRequest
): Promise<CreateOrUpdateMinisterResponse> => {
  const response = await api.post<CreateOrUpdateMinisterResponse>(
    '/api/v1/Minister/CreateOrUpdateMinster',
    minister
  );
  return response.data;
};

export const searchMinisters = async (
  payload: SearchMinistersRequest
): Promise<SearchMinistersResponse> => {
  const response = await api.post<SearchMinistersResponse>(
    '/api/v1/Minister/SearchMinisters',
    payload
  );
  return response.data;
};

export const getAllMinisters = async (): Promise<GetAllMinistersResponse> => {
  const response = await api.get<GetAllMinistersResponse>(
    '/api/v1/Minister/GetAllMinisters'
  );
  return response.data;
};

export const deleteMinister = async (
  id: number
): Promise<DeleteMinisterResponse> => {
  const response = await api.delete<DeleteMinisterResponse>(
    `/api/v1/Minister/DeleteMinister?id=${id}`
  );
  return response.data;
};