export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiError {
  field: string;
  description: string;
}

export interface StandardApiResponse<T = any> {
  data: T;
  isSuccessful: boolean;
  errors: ApiError[];
  responseMessage: string;
  responseCode: string;
}

export interface LoginResponse extends StandardApiResponse<number> {}

export interface RegisterOrUpdateUserRequest {
  userId: number | null;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  phoneNumber: string;
  imageFile: string;
  userTypeId: string;
}

export interface GetAllUsersRequest {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

export interface User {
  id: number;
  dateCreated: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isBanned: boolean;
  phoneNumber: string;
  userTypeId: string;
  loginFailedCount: number;
}

export interface GetAllUsersResponse extends StandardApiResponse<User[]> {
  totalCount: number;
  totalPages: number;
}

export interface GetUserByIdResponse extends StandardApiResponse<User> {}

export interface BlockUserRequest {
  userId: number;
}

export interface UnblockUserRequest {
  userId: number;
}

export interface BlockUserResponse extends StandardApiResponse<User> {}
export interface UnblockUserResponse extends StandardApiResponse<User> {}
