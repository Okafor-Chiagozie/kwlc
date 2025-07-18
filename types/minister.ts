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
export enum MinisterRole {
  GeneralOverseer = "GeneralOverseer",
  Lead = "Lead",
  Youth = "Youth",
  Associate = "Associate",
  Children = "Children",
  Missions = "Missions",
  Worship = "Worship"
}

// Request/Response schemas exactly as defined in API documentation

// AddMinisterViewModel from API
export interface AddMinisterViewModel {
  id?: number | null;
  email: string;
  branchId?: number | null;
  lastName: string;
  biography: string;
  firstName: string;
  phoneNumber: string;
  middleName: string;
  imageFile?: File | null;
  ministerRoleId: MinisterRole;
}

// EventViewModel from API (used in minister responses)
export interface EventViewModel {
  id: number;
  name: string;
  date: string;
  startTime: string;
  closeTime: string;
  branchId?: number | null;
  eventTypeId: number;
  fee?: number | null;
  maxAttendance?: number | null;
  description: string;
  location: string;
  address: string;
  venue: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted?: string;
}

// UserViewModel from API (used in some minister responses)
export interface UserViewModel {
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

// Request types
export type CreateOrUpdateMinisterRequest = AddMinisterViewModel;
export type SearchMinistersRequest = SearchFilter;

// Response types based on API documentation
export interface EventViewModelListPaginationResult extends PaginatedApiResponse<EventViewModel[]> {}
export interface EventViewModelListResult extends StandardApiResponse<EventViewModel[]> {}
export interface UserViewModelListResult extends StandardApiResponse<UserViewModel[]> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateMinisterResponse extends EventViewModel {}
export interface SearchMinistersResponse extends EventViewModelListPaginationResult {}
export interface GetAllMinistersResponse extends EventViewModelListResult {}
export interface DeleteMinisterResponse extends EventViewModelListResult {}