import api from '@/lib/axios';
import {
  CreateOrUpdateBranchRequest,
  CreateOrUpdateBranchResponse,
  GetAllBranchesRequest,
  GetAllBranchesResponse,
  GetBranchDetailsResponse,
  DeleteBranchResponse,
  CreateOrUpdateBranchImagesRequest,
  CreateOrUpdateBranchImagesResponse,
  GetBranchImagesResponse,
  GetBranchImageResponse,
  DeleteBranchImageResponse,
  CreateOrUpdateWeeklyActivityRequest,
  CreateOrUpdateWeeklyActivityResponse,
  GetWeeklyActivityResponse,
  DeleteWeeklyActivityResponse,
  GetWeeklyActivitiesResponse,
  CreateBranchReportRequest,
  UpdateBranchReportRequest,
  CreateBranchReportResponse,
  UpdateBranchReportResponse,
  GetBranchReportsRequest,
  GetBranchReportsResponse,
  GetBranchReportResponse,
  DeleteBranchReportResponse
} from '@/types/branch';

// Branch CRUD operations
export const createOrUpdateBranch = async (
  branch: CreateOrUpdateBranchRequest
): Promise<CreateOrUpdateBranchResponse> => {
  const response = await api.post<CreateOrUpdateBranchResponse>(
    '/api/v1/Branch/CreateOrUpdateBranch',
    branch
  );
  return response.data;
};

export const getAllBranches = async (
  payload: GetAllBranchesRequest
): Promise<GetAllBranchesResponse> => {
  const response = await api.post<GetAllBranchesResponse>(
    '/api/v1/Branch/GetAllBranches',
    payload
  );
  return response.data;
};

export const getBranchDetails = async (
  branchId: number
): Promise<GetBranchDetailsResponse> => {
  const response = await api.get<GetBranchDetailsResponse>(
    `/api/v1/Branch/GetBranchDetails?branchId=${branchId}`
  );
  return response.data;
};

export const deleteBranch = async (
  branchId: number
): Promise<DeleteBranchResponse> => {
  const response = await api.delete<DeleteBranchResponse>(
    `/api/v1/Branch/DeleteBranch?branchId=${branchId}`
  );
  return response.data;
};

// Branch Images operations
export const createOrUpdateBranchImages = async (
  payload: CreateOrUpdateBranchImagesRequest
): Promise<CreateOrUpdateBranchImagesResponse> => {
  const response = await api.post<CreateOrUpdateBranchImagesResponse>(
    '/api/v1/Branch/CreateOrUpdateBranchImages',
    payload
  );
  return response.data;
};

export const getBranchImages = async (
  branchId: number
): Promise<GetBranchImagesResponse> => {
  const response = await api.get<GetBranchImagesResponse>(
    `/api/v1/Branch/GetBranchImages?branchId=${branchId}`
  );
  return response.data;
};

export const getBranchImage = async (
  branchId: number,
  imageId: number
): Promise<GetBranchImageResponse> => {
  const response = await api.get<GetBranchImageResponse>(
    `/api/v1/Branch/GetBranchImage?branchId=${branchId}&imageId=${imageId}`
  );
  return response.data;
};

export const deleteBranchImage = async (
  branchId: number,
  imageId: number
): Promise<DeleteBranchImageResponse> => {
  const response = await api.delete<DeleteBranchImageResponse>(
    `/api/v1/Branch/DeleteBranchImage?branchId=${branchId}&imageId=${imageId}`
  );
  return response.data;
};

// Weekly Activity operations
export const createOrUpdateWeeklyActivity = async (
  payload: CreateOrUpdateWeeklyActivityRequest
): Promise<CreateOrUpdateWeeklyActivityResponse> => {
  const response = await api.post<CreateOrUpdateWeeklyActivityResponse>(
    '/api/v1/Branch/CreateOrUpdateWeeklyActivity',
    payload
  );
  return response.data;
};

export const getWeeklyActivity = async (
  branchId: number,
  activityId: number
): Promise<GetWeeklyActivityResponse> => {
  const response = await api.get<GetWeeklyActivityResponse>(
    `/api/v1/Branch/GetWeeklyActivity?branchId=${branchId}&activityId=${activityId}`
  );
  return response.data;
};

export const deleteWeeklyActivity = async (
  branchId: number,
  imageId: number // Note: API uses imageId parameter name, might be a typo in the API
): Promise<DeleteWeeklyActivityResponse> => {
  const response = await api.delete<DeleteWeeklyActivityResponse>(
    `/api/v1/Branch/DeleteWeeklyActivity?branchId=${branchId}&imageId=${imageId}`
  );
  return response.data;
};

export const getWeeklyActivities = async (
  branchId: number
): Promise<GetWeeklyActivitiesResponse> => {
  const response = await api.get<GetWeeklyActivitiesResponse>(
    `/api/v1/Branch/GetWeeklyActivities?branchId=${branchId}`
  );
  return response.data;
};

// Branch Report operations
export const createBranchReport = async (
  payload: CreateBranchReportRequest
): Promise<CreateBranchReportResponse> => {
  const response = await api.post<CreateBranchReportResponse>(
    '/api/v1/Branch/CreateBranchReport',
    payload
  );
  return response.data;
};

export const updateBranchReport = async (
  payload: UpdateBranchReportRequest
): Promise<UpdateBranchReportResponse> => {
  const response = await api.put<UpdateBranchReportResponse>(
    '/api/v1/Branch/UpdateBranchReport',
    payload
  );
  return response.data;
};

export const getBranchReports = async (
  branchId: number,
  payload: GetBranchReportsRequest
): Promise<GetBranchReportsResponse> => {
  const response = await api.get<GetBranchReportsResponse>(
    `/api/v1/Branch/GetBranchReports?branchId=${branchId}`,
    {
      data: payload // For GET request with body
    }
  );
  return response.data;
};

export const getBranchReport = async (
  branchId: number,
  reportId: number
): Promise<GetBranchReportResponse> => {
  const response = await api.get<GetBranchReportResponse>(
    `/api/v1/Branch/GetBranchReport?branchId=${branchId}&reportId=${reportId}`
  );
  return response.data;
};

export const deleteBranchReport = async (
  branchId: number,
  reportId: number
): Promise<DeleteBranchReportResponse> => {
  const response = await api.delete<DeleteBranchReportResponse>(
    `/api/v1/Branch/DeleteBranchReport?branchId=${branchId}&reportId=${reportId}`
  );
  return response.data;
};