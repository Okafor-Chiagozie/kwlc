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
  
  // Create FormData for multipart/form-data as the API expects file upload
  const formData = new FormData();
  
  // Add all the form fields as individual form data entries
  if (payload.id !== null && payload.id !== undefined) {
    formData.append('id', payload.id.toString());
  }
  
  formData.append('email', payload.email || '');
  
  if (payload.branchId !== null && payload.branchId !== undefined) {
    formData.append('branchId', payload.branchId.toString());
  }
  
  formData.append('lastName', payload.lastName || '');
  formData.append('biography', payload.biography || '');
  formData.append('firstName', payload.firstName || '');
  formData.append('phoneNumber', payload.phoneNumber || '');
  formData.append('middleName', payload.middleName || '');
  formData.append('ministerRoleId', payload.ministerRoleId);
  
  // Add the image file if provided
  if (payload.imageFile) {
    formData.append('imageFile', payload.imageFile);
  }

  const response = await api.post<CreateOrUpdateMinisterResponse>(
    `${BASE_URL}/CreateOrUpdateMinster`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
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