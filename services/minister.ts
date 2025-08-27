import api from '@/lib/axios';
import {
  CreateOrUpdateMinisterRequest,
  CreateOrUpdateMinisterResponse,
  SearchMinistersRequest,
  SearchMinistersResponse,
  GetAllMinistersResponse,
  DeleteMinisterResponse,
  MinisterDetailsResult,
  MinisterViewModelListResult
} from '@/types/minister';

const BASE_URL = '/api/v1/Minister';

// Minister operations matching API documentation exactly
// Note: Several API endpoints have typos which we must accommodate

export const createOrUpdateMinister = async (
  payload: CreateOrUpdateMinisterRequest
): Promise<CreateOrUpdateMinisterResponse> => {
  // Note: API endpoint has typo - "CreateOrUpdateMinster" instead of "CreateOrUpdateMinister"
  
  // Create FormData for multipart/form-data as the API expects file upload
  // Note: API expects capitalized field names (Id, Email, etc.)
  const formData = new FormData();
  
  // Add all the form fields as individual form data entries with correct casing
  if (payload.id !== null && payload.id !== undefined) {
    formData.append('Id', payload.id.toString());
  }
  
  formData.append('Email', payload.email || '');
  
  if (payload.branchId !== null && payload.branchId !== undefined) {
    formData.append('BranchId', payload.branchId.toString());
  }
  
  formData.append('LastName', payload.lastName || '');
  if (payload.biography) {
    formData.append('Biography', payload.biography);
  }
  formData.append('FirstName', payload.firstName || '');
  formData.append('PhoneNumber', payload.phoneNumber || '');
  if (payload.middleName) {
    formData.append('MiddleName', payload.middleName);
  }
  formData.append('MinisterRoleId', payload.ministerRoleId);
  
  // Add the image file if provided
  if (payload.imageFile) {
    formData.append('ImageFile', payload.imageFile);
  }

  const response = await api.post<CreateOrUpdateMinisterResponse>(
    `${BASE_URL}/CreateOrUpdateMinster`, // API typo: missing 'i' in "Minister"
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// Note: No direct SearchMinisters endpoint exists - use GetMinsiters instead
export const searchMinisters = async (
  payload: SearchMinistersRequest
): Promise<SearchMinistersResponse> => {
  const response = await api.post<SearchMinistersResponse>(
    `${BASE_URL}/GetMinsiters`, // API typo: missing 'i' in "Ministers"
    payload
  );
  return response.data;
};

// Note: GetAllMinisters is actually a POST endpoint with SearchFilter, not GET
export const getAllMinisters = async (
  payload: SearchMinistersRequest
): Promise<GetAllMinistersResponse> => {
  const response = await api.post<GetAllMinistersResponse>(
    `${BASE_URL}/GetAllMinisters`,
    payload
  );
  return response.data;
};

export const getMinister = async (
  id: number
): Promise<MinisterDetailsResult> => {
  const response = await api.get<MinisterDetailsResult>(
    `${BASE_URL}/GetMinister?Id=${id}` // API expects capitalized 'Id'
  );
  return response.data;
};

// Duplicate function for getMinisters (same as searchMinisters)
export const getMinisters = async (
  payload: SearchMinistersRequest
): Promise<SearchMinistersResponse> => {
  const response = await api.post<SearchMinistersResponse>(
    `${BASE_URL}/GetMinsiters`, // API typo: missing 'i' in "Ministers"
    payload
  );
  return response.data;
};

export const getBranchMinisters = async (
  branchId: number,
  payload: SearchMinistersRequest
): Promise<MinisterViewModelListResult> => {
  const response = await api.post<MinisterViewModelListResult>(
    `${BASE_URL}/GetBranchMinsiters?branchId=${branchId}`, // API typo: missing 'i' in "Ministers"
    payload
  );
  return response.data;
};

export const deleteMinister = async (
  id: number
): Promise<DeleteMinisterResponse> => {
  const response = await api.delete<DeleteMinisterResponse>(
    `${BASE_URL}/DeleteMinister?id=${id}` // API uses lowercase 'id'
  );
  return response.data;
};
