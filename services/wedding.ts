import api from '@/lib/axios';
import {
  CreateOrUpdateWeddingRequest,
  CreateOrUpdateWeddingResponse,
  GetAllWeddingsRequest,
  GetAllWeddingsResponse,
  GetWeddingResponse,
  DeleteWeddingResponse,
  CreateWeddingImageRequest,
  UpdateWeddingImageRequest,
  CreateWeddingImageResponse,
  UpdateWeddingImageResponse,
  GetWeddingImagesResponse,
  GetWeddingImageResponse,
  DeleteWeddingImageResponse
} from '@/types/wedding';

const BASE_URL = '/api/v1/Wedding';

// Wedding CRUD operations
export const createOrUpdateWedding = async (
  payload: CreateOrUpdateWeddingRequest
): Promise<CreateOrUpdateWeddingResponse> => {
  const response = await api.post<CreateOrUpdateWeddingResponse>(
    `${BASE_URL}/CreateOrUpdateWedding`,
    payload
  );
  return response.data;
};

export const getAllWeddings = async (
  payload: GetAllWeddingsRequest
): Promise<GetAllWeddingsResponse> => {
  const response = await api.post<GetAllWeddingsResponse>(
    `${BASE_URL}/GetAllWeddings`,
    payload
  );
  return response.data;
};

export const getWedding = async (
  id: number
): Promise<GetWeddingResponse> => {
  const response = await api.get<GetWeddingResponse>(
    `${BASE_URL}/GetWedding?id=${id}`
  );
  return response.data;
};

export const deleteWedding = async (
  id: number
): Promise<DeleteWeddingResponse> => {
  const response = await api.delete<DeleteWeddingResponse>(
    `${BASE_URL}/DeleteWedding?id=${id}`
  );
  return response.data;
};

// Wedding Image operations
export const createWeddingImage = async (
  payload: CreateWeddingImageRequest
): Promise<CreateWeddingImageResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  // Append files array
  payload.File.forEach((file) => {
    formData.append('File', file);
  });

  const response = await api.post<CreateWeddingImageResponse>(
    `${BASE_URL}/CreateWeddingImage?WeddingId=${payload.WeddingId}&ImageCategoryId=${payload.ImageCategoryId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateWeddingImage = async (
  payload: UpdateWeddingImageRequest
): Promise<UpdateWeddingImageResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await api.put<UpdateWeddingImageResponse>(
    `${BASE_URL}/UpdateWeddingImage?Id=${payload.Id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getWeddingImages = async (
  weddingId: number
): Promise<GetWeddingImagesResponse> => {
  const response = await api.get<GetWeddingImagesResponse>(
    `${BASE_URL}/GetWeddingImages?weddingId=${weddingId}`
  );
  return response.data;
};

export const getWeddingImage = async (
  weddingId: number,
  imageId: number
): Promise<GetWeddingImageResponse> => {
  const response = await api.get<GetWeddingImageResponse>(
    `${BASE_URL}/GetWeddingImage?weddingId=${weddingId}&imageId=${imageId}`
  );
  return response.data;
};

export const deleteWeddingImage = async (
  weddingId: number,
  imageId: number
): Promise<DeleteWeddingImageResponse> => {
  const response = await api.delete<DeleteWeddingImageResponse>(
    `${BASE_URL}/DeleteWeddingImage?weddingId=${weddingId}&imageId=${imageId}`
  );
  return response.data;
};