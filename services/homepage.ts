import api from '@/lib/axios';
import {
  GetHomePageResponse,
  CreateOrUpdateChurchDetailsRequest,
  CreateOrUpdateChurchDetailsResponse,
  CreateOrUpdateServiceScheduleDetailsRequest,
  CreateOrUpdateServiceScheduleDetailsResponse,
  GetAllServiceSchedulesResponse,
  GetServiceScheduleResponse,
  DeleteServiceScheduleResponse,
  CreateOrUpdateChurchdayDetailsRequest,
  CreateOrUpdateChurchdayDetailsResponse,
  GetAllChurchdaysResponse,
  DeleteChurchDayResponse,
  CreateChurchImageRequest,
  UpdateChurchImageRequest,
  CreateChurchImageResponse,
  UpdateChurchImageResponse,
  GetChurchImagesResponse,
  GetChurchImageResponse,
  DeleteChurchImageResponse,
  ChurchImageCategory
} from '@/types/homepage';

const BASE_URL = '/api/v1/HomePage';

// HomePage operations
export const getHomePage = async (): Promise<GetHomePageResponse> => {
  const response = await api.get<GetHomePageResponse>(
    `${BASE_URL}/GetHomePage`
  );
  return response.data;
};

export const createOrUpdateChurchDetails = async (
  payload: CreateOrUpdateChurchDetailsRequest
): Promise<CreateOrUpdateChurchDetailsResponse> => {
  const response = await api.post<CreateOrUpdateChurchDetailsResponse>(
    `${BASE_URL}/CreateOrUpdateChurchDetails`,
    payload
  );
  return response.data;
};

// Service Schedule operations
export const createOrUpdateServiceScheduleDetails = async (
  payload: CreateOrUpdateServiceScheduleDetailsRequest
): Promise<CreateOrUpdateServiceScheduleDetailsResponse> => {
  const response = await api.post<CreateOrUpdateServiceScheduleDetailsResponse>(
    `${BASE_URL}/CreateOrUpdateServiceScheduleDetails`,
    payload
  );
  return response.data;
};

export const getAllServiceSchedules = async (): Promise<GetAllServiceSchedulesResponse> => {
  const response = await api.get<GetAllServiceSchedulesResponse>(
    `${BASE_URL}/GetAllServiceSchedules`
  );
  return response.data;
};

export const getServiceSchedule = async (
  id: number
): Promise<GetServiceScheduleResponse> => {
  const response = await api.get<GetServiceScheduleResponse>(
    `${BASE_URL}/GetServiceSchedule?id=${id}`
  );
  return response.data;
};

export const deleteServiceSchedule = async (
  id: number
): Promise<DeleteServiceScheduleResponse> => {
  const response = await api.delete<DeleteServiceScheduleResponse>(
    `${BASE_URL}/DeleteServiceSchedule?id=${id}`
  );
  return response.data;
};

// Church Day operations
export const createOrUpdateChurchdayDetails = async (
  payload: CreateOrUpdateChurchdayDetailsRequest
): Promise<CreateOrUpdateChurchdayDetailsResponse> => {
  const response = await api.post<CreateOrUpdateChurchdayDetailsResponse>(
    `${BASE_URL}/CreateOrUpdateChurchdayDetails`,
    payload
  );
  return response.data;
};

export const getAllChurchdays = async (): Promise<GetAllChurchdaysResponse> => {
  const response = await api.get<GetAllChurchdaysResponse>(
    `${BASE_URL}/GetAllChurchdays`
  );
  return response.data;
};

export const deleteChurchDay = async (
  id: number
): Promise<DeleteChurchDayResponse> => {
  const response = await api.delete<DeleteChurchDayResponse>(
    `${BASE_URL}/DeleteChurchDay?id=${id}`
  );
  return response.data;
};

// Church Image operations
export const createChurchImage = async (
  payload: CreateChurchImageRequest
): Promise<CreateChurchImageResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  // Append files array
  payload.File.forEach((file) => {
    formData.append('File', file);
  });
  // Append category as form field using enum name to match API curl example
  const categoryName = ChurchImageCategory[payload.ImageCategoryId] as string;
  formData.append('ImageCategoryId', categoryName ?? String(Number(payload.ImageCategoryId)));
  
  const response = await api.post<CreateChurchImageResponse>(
    `https://musharealestate-001-site4.jtempurl.com/api/v1/HomePage/CreateChurchImage`,
    formData
  );
  return response.data;
};

export const updateChurchImage = async (
  payload: UpdateChurchImageRequest
): Promise<UpdateChurchImageResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await api.put<UpdateChurchImageResponse>(
    `${BASE_URL}/UpdateChurchImage?Id=${payload.Id}`,
    formData
  );
  return response.data;
};

export const getChurchImages = async (): Promise<GetChurchImagesResponse> => {
  const response = await api.get<GetChurchImagesResponse>(
    `${BASE_URL}/GetChurchImages`
  );
  return response.data;
};

export const getChurchImage = async (
  imageId: number
): Promise<GetChurchImageResponse> => {
  const response = await api.get<GetChurchImageResponse>(
    `${BASE_URL}/GetChurchImage?imageId=${imageId}`
  );
  return response.data;
};

export const deleteChurchImage = async (
  imageId: number
): Promise<DeleteChurchImageResponse> => {
  const response = await api.delete<DeleteChurchImageResponse>(
    `${BASE_URL}/DeleteChurchImage?imageId=${imageId}`
  );
  return response.data;
};