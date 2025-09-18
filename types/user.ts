// Base interfaces
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

export interface PaginatedApiResponse<T = any> extends StandardApiResponse<T> {
  totalCount: number;
  totalPages: number;
}

export interface SearchFilter {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

// Enums from API documentation
export enum UserType {
  Admin = "Admin",
  User = "User"
}

// Request/Response schemas exactly as defined in API documentation

// LoginRequestViewModel from API
export interface LoginRequestViewModel {
  username: string;
  password: string; // format: password
}

// RegistrationRequestViewModel from API
export interface RegistrationRequestViewModel {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  phoneNumber: string;
  userTypeId: UserType;
}

// UpdateUserRequestViewModel from API
export interface UpdateUserRequestViewModel {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  userTypeId: UserType;
}

// UserViewModel from API
export interface UserViewModel {
  id: number;
  dateCreated: string; // DateTime
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  isBanned: boolean;
  phoneNumber: string;
  userTypeId: UserType;
  loginFailedCount: number;
}

// BanUserViewModel from API
export interface BanUserViewModel {
  userId: number;
}

// ForgotPasswordRequest from API
export interface ForgotPasswordRequest {
  email: string; // format: email
}

// ResetPasswordRequest from API
export interface ResetPasswordRequest {
  token: string;
  newPassword: string; // format: password
  confirmPassword: string; // format: password
}

// ChangePasswordRequest from API
export interface ChangePasswordRequest {
  currentPassword: string; // format: password
  newPassword: string; // format: password
}

// Request types
export type LoginRequest = LoginRequestViewModel;
export type RegistrationRequest = RegistrationRequestViewModel;
export type UpdateUserRequest = UpdateUserRequestViewModel;
export type GetAllUsersRequest = SearchFilter;
export type BlockUserRequest = BanUserViewModel;
export type UnblockUserRequest = BanUserViewModel;

// Response types based on API documentation
export interface Int32Result extends StandardApiResponse<number> {}
export interface StringResult extends StandardApiResponse<string> {}
export interface UserViewModelResult extends StandardApiResponse<UserViewModel> {}
export interface UserViewModelListPaginationResult extends PaginatedApiResponse<UserViewModel[]> {}

// Login success payload per Swagger
export interface LoginSuccessData {
  userId: number;
  email: string;
  jwtToken: string;
  jwtTokenExpiry: string;
  permissions: string[];
}

// Response interfaces matching API exactly
export interface LoginResponse extends StandardApiResponse<LoginSuccessData> {}
export interface RegistrationResponse extends Int32Result {}
export interface UpdateUserResponse extends StringResult {}
export interface GetAllUsersResponse extends UserViewModelListPaginationResult {}
export interface GetUserByIdResponse extends UserViewModelResult {}
export interface BlockUserResponse extends UserViewModelResult {}
export interface UnblockUserResponse extends UserViewModelResult {}
export interface ForgotPasswordResponse extends StringResult {}
export interface ResetPasswordResponse extends StringResult {}
export interface ChangePasswordResponse extends StringResult {}