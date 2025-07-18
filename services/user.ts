import api from '@/lib/axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterOrUpdateUserRequest,
  StandardApiResponse,
  GetAllUsersRequest,
  GetAllUsersResponse,
  GetUserByIdResponse,
  BlockUserRequest,
  UnblockUserRequest,
  BlockUserResponse,
  UnblockUserResponse
} from '@/types/user';

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    '/api/v1/User/login',
    credentials
  );
  return response.data;
};

export const registerOrUpdateUser = async (
  user: RegisterOrUpdateUserRequest
): Promise<StandardApiResponse<number>> => {
  const response = await api.post<StandardApiResponse<number>>(
    '/api/v1/User/registration',
    user
  );
  return response.data;
};

export const getAllUsers = async (
  payload: GetAllUsersRequest
): Promise<GetAllUsersResponse> => {
  const response = await api.post<GetAllUsersResponse>(
    '/api/v1/User/GetAllUsers',
    payload
  );
  return response.data;
};

export const getUserById = async (
  userId: number
): Promise<GetUserByIdResponse> => {
  const response = await api.get<GetUserByIdResponse>(
    `/api/v1/User/${userId}`
  );
  return response.data;
};

export const blockUser = async (
  payload: BlockUserRequest
): Promise<BlockUserResponse> => {
  const response = await api.post<BlockUserResponse>(
    '/api/v1/User/blockUser',
    payload
  );
  return response.data;
};

export const unblockUser = async (
  payload: UnblockUserRequest
): Promise<UnblockUserResponse> => {
  const response = await api.post<UnblockUserResponse>(
    '/api/v1/User/unblock',
    payload
  );
  return response.data;
};
