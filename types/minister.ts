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

// Minister-specific data models
export interface MinisterViewModel {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  biography?: string;
  ministerRoleId: MinisterRole;
  ministerRole?: string; // Display name for the role
  branchId?: number;
  branchName?: string;
  imageUrl?: string;
  imageName?: string;
  dateCreated: string; // DateTime
  dateUpdated?: string; // DateTime
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface MinisterDetailsViewModel {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string; // Computed property
  email: string;
  phoneNumber: string;
  biography?: string;
  ministerRoleId: MinisterRole;
  ministerRole?: string;
  branchId?: number;
  branchName?: string;
  imageUrl?: string;
  imageName?: string;
  dateCreated: string;
  dateUpdated?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  // Additional details
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedIn?: string;
  };
  qualifications?: string[];
  specializations?: string[];
  yearsOfService?: number;
  achievements?: string[];
}

// Request/Response schemas exactly as defined in API documentation

// AddMinisterViewModel from API
export interface AddMinisterViewModel {
  id?: number | null;
  email: string;
  branchId?: number | null;
  lastName: string;
  biography?: string; // Made optional
  firstName: string;
  phoneNumber: string;
  middleName?: string; // Made optional
  imageFile?: File | null;
  ministerRoleId: MinisterRole;
}

// Request types
export type CreateOrUpdateMinisterRequest = AddMinisterViewModel;
export type SearchMinistersRequest = SearchFilter;

// Response types based on API documentation
export interface MinisterViewModelListResult extends StandardApiResponse<MinisterViewModel[]> {}
export interface MinisterViewModelPaginationResult extends PaginatedApiResponse<MinisterViewModel[]> {}
export interface MinisterDetailsResult extends StandardApiResponse<MinisterDetailsViewModel> {}
export interface Int32Result extends StandardApiResponse<number> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateMinisterResponse extends MinisterDetailsResult {}
export interface SearchMinistersResponse extends MinisterViewModelPaginationResult {}
export interface GetAllMinistersResponse extends MinisterViewModelListResult {}
export interface DeleteMinisterResponse extends Int32Result {}
