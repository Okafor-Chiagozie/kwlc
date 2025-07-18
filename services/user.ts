import api from '@/lib/axios';
import {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  BlockUserRequest,
  UnblockUserRequest,
  BlockUserResponse,
  UnblockUserResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse
} from '@/types/user';

const BASE_URL = '/api/v1/User';

// Authentication operations
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    `${BASE_URL}/login`,
    credentials
  );
  return response.data;
};

export const registration = async (
  userData: RegistrationRequest
): Promise<RegistrationResponse> => {
  const response = await api.post<RegistrationResponse>(
    `${BASE_URL}/registration`,
    userData
  );
  return response.data;
};

export const updateUser = async (
  userData: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await api.put<UpdateUserResponse>(
    `${BASE_URL}/updateUser`,
    userData
  );
  return response.data;
};

// User management operations
export const getAllUsers = async (
  payload: GetAllUsersRequest
): Promise<GetAllUsersResponse> => {
  const response = await api.post<GetAllUsersResponse>(
    `${BASE_URL}/GetAllUsers`,
    payload
  );
  return response.data;
};

export const getUserById = async (
  userId: number
): Promise<GetUserByIdResponse> => {
  const response = await api.get<GetUserByIdResponse>(
    `${BASE_URL}/${userId}`
  );
  return response.data;
};

// User blocking operations
export const blockUser = async (
  payload: BlockUserRequest
): Promise<BlockUserResponse> => {
  const response = await api.post<BlockUserResponse>(
    `${BASE_URL}/blockUser`,
    payload
  );
  return response.data;
};

export const unblockUser = async (
  payload: UnblockUserRequest
): Promise<UnblockUserResponse> => {
  const response = await api.post<UnblockUserResponse>(
    `${BASE_URL}/unblock`,
    payload
  );
  return response.data;
};

// Password management operations
export const forgotPassword = async (
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    `${BASE_URL}/ForgotPassword`,
    payload
  );
  return response.data;
};

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await api.post<ResetPasswordResponse>(
    `${BASE_URL}/ResetPassword`,
    payload
  );
  return response.data;
};

export const changePassword = async (
  payload: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await api.post<ChangePasswordResponse>(
    `${BASE_URL}/ChangePassword`,
    payload
  );
  return response.data;
};