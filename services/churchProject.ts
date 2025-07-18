import api from '@/lib/axios';
import {
  CreateOrUpdateProjectRequest,
  CreateOrUpdateProjectResponse,
  GetProjectsResponse,
  SearchProjectsRequest,
  SearchProjectsResponse,
  GetProjectResponse,
  DeleteProjectResponse,
  CreateProjectImagesRequest,
  UpdateProjectImagesRequest,
  CreateProjectImagesResponse,
  UpdateProjectImagesResponse,
  GetProjectImagesResponse,
  GetProjectImageResponse,
  DeleteProjectImageResponse
} from '@/types/churchProject';

const BASE_URL = '/api/v1/ChurchProject';

// Church Project CRUD operations
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
  const response = await api.get<GetProjectsResponse>(
    `${BASE_URL}/GetProjects`
  );
  return response.data;
};

export const searchProjects = async (
  payload: SearchProjectsRequest
): Promise<SearchProjectsResponse> => {
  const response = await api.post<SearchProjectsResponse>(
    `${BASE_URL}/SearchProjects`,
    payload
  );
  return response.data;
};

export const getProject = async (
  projectId: number
): Promise<GetProjectResponse> => {
  const response = await api.get<GetProjectResponse>(
    `${BASE_URL}/GetProject?projectId=${projectId}`
  );
  return response.data;
};

export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const response = await api.delete<DeleteProjectResponse>(
    `${BASE_URL}/DeleteProject?projectId=${projectId}`
  );
  return response.data;
};

// Project Images operations
export const createProjectImages = async (
  payload: CreateProjectImagesRequest
): Promise<CreateProjectImagesResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  // Append files array
  payload.file.forEach((file) => {
    formData.append('File', file);
  });
  
  const response = await api.post<CreateProjectImagesResponse>(
    `${BASE_URL}/CreateProjectImages?imageTitle=${encodeURIComponent(payload.imageTitle)}&imageCategoryId=${payload.imageCategoryId}&projectId=${payload.projectId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateProjectImages = async (
  payload: UpdateProjectImagesRequest
): Promise<UpdateProjectImagesResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  formData.append('file', payload.file);
  
  const response = await api.put<UpdateProjectImagesResponse>(
    `${BASE_URL}/UpdateProjectImages?Id=${payload.id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getProjectImages = async (
  branchId: number
): Promise<GetProjectImagesResponse> => {
  const response = await api.get<GetProjectImagesResponse>(
    `${BASE_URL}/GetProjectImages?branchId=${branchId}`
  );
  return response.data;
};

export const getProjectImage = async (
  projectId: number,
  imageId: number
): Promise<GetProjectImageResponse> => {
  const response = await api.get<GetProjectImageResponse>(
    `${BASE_URL}/GetProjectImage?projectId=${projectId}&imageId=${imageId}`
  );
  return response.data;
};

export const deleteProjectImage = async (
  branchId: number,
  imageId: number
): Promise<DeleteProjectImageResponse> => {
  const response = await api.delete<DeleteProjectImageResponse>(
    `${BASE_URL}/DeleteProjectImage?branchId=${branchId}&imageId=${imageId}`
  );
  return response.data;
};