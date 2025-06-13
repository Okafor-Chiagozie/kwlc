import api from '@/lib/axios';
import {
  CreateOrUpdateProjectRequest,
  CreateOrUpdateProjectResponse,
  DeleteProjectResponse,
  GetProjectResponse,
  GetProjectsResponse,
  SearchProjectsRequest,
  CreateOrUpdateProjectImagesRequest,
  CreateOrUpdateProjectImagesResponse,
  GetProjectImagesResponse,
  GetProjectImageResponse,
  DeleteProjectImageResponse
} from '@/types/churchProject';

const BASE_URL = '/api/v1/ChurchProject';

export const createOrUpdateProject = async (
  payload: CreateOrUpdateProjectRequest
): Promise<CreateOrUpdateProjectResponse> => {
  const response = await api.post<CreateOrUpdateProjectResponse>(
    `${BASE_URL}/CreateOrUpdateProject`,
    payload
  );
  return response.data;
};

export const getProjects = async (): Promise<GetProjectsResponse> => {
  const response = await api.get<GetProjectsResponse>(`${BASE_URL}/GetProjects`);
  return response.data;
};

export const getProject = async (
  projectId: number
): Promise<GetProjectResponse> => {
  const response = await api.get<GetProjectResponse>(`${BASE_URL}/GetProject`, {
    params: { projectId }
  });
  return response.data;
};

export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const response = await api.delete<DeleteProjectResponse>(`${BASE_URL}/DeleteProject`, {
    params: { projectId }
  });
  return response.data;
};

export const searchProjects = async (
  payload: SearchProjectsRequest
): Promise<GetProjectsResponse> => {
  const response = await api.post<GetProjectsResponse>(`${BASE_URL}/SearchProjects`, payload);
  return response.data;
};

export const createOrUpdateProjectImages = async (
  payload: CreateOrUpdateProjectImagesRequest
): Promise<CreateOrUpdateProjectImagesResponse> => {
  const response = await api.post<CreateOrUpdateProjectImagesResponse>(
    `${BASE_URL}/CreateOrUpdateProjectImages`,
    payload
  );
  return response.data;
};

export const getProjectImages = async (
  branchId: number
): Promise<GetProjectImagesResponse> => {
  const response = await api.get<GetProjectImagesResponse>(
    `${BASE_URL}/GetProjectImages`,
    { params: { branchId } }
  );
  return response.data;
};

export const getProjectImage = async (
  projectId: number,
  imageId: number
): Promise<GetProjectImageResponse> => {
  const response = await api.get<GetProjectImageResponse>(
    `${BASE_URL}/GetProjectImage`,
    { params: { projectId, imageId } }
  );
  return response.data;
};

export const deleteProjectImage = async (
  branchId: number,
  imageId: number
): Promise<DeleteProjectImageResponse> => {
  const response = await api.delete<DeleteProjectImageResponse>(
    `${BASE_URL}/DeleteProjectImage`,
    { params: { branchId, imageId } }
  );
  return response.data;
};
