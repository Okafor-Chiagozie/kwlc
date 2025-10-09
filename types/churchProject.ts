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

// Enums
export enum ImageCategory {
  CarouselImage = "CarouselImage",
  GalleryImages = "GalleryImages", 
  PreviewImage = "PreviewImage",
  ThumbnailImage = "ThumbnailImage",
  Headshots = "Headshots",
  TicketImage = "TicketImage"
}

// Request/Response schemas exactly as defined in API documentation

// AddChurchProjectViewModel from API
export interface AddChurchProjectViewModel {
  id?: number | null;
  name: string;
  location: string;
  targetAmount: number;
  description: string;
}

// ChurchProjectPageViewModel from API
export interface ChurchProjectPageViewModel {
  id: number;
  name: string;
  location: string;
  targetAmount: number;
  description: string;
  imageUrl: string;
  amountRaised: number;
  isDeleted: boolean;
  dateDeleted?: string;
  carouselImages: string[];
}

// ChurchProjectViewModel from API  
export interface ChurchProjectViewModel {
  id?: number | null;
  name: string;
  location: string;
  targetAmount: number;
  description: string;
  isDeleted: boolean;
  imageUrl: string;
  amountRaised: number;
  dateDeleted?: string;
  carouselImages: string[];
  previewImages: string[];
  galleryImages: string[];
}

// GetProjects data shape from live API (note: 'porjects' key as returned)
export interface ChurchProjectGetProjectsData {
  carouselImages: string[];
  porjects: ChurchProjectPageViewModel[];
}

// AddProjectImageViewModel from API
export interface AddProjectImageViewModel {
  imageTitle: string;
  file: File[];
  imageCategoryId: ImageCategory;
  projectId: number;
}

// UpdateImageRequest from API
export interface UpdateImageRequest {
  id: number;
  file: File;
}

// ProjectImageViewModel from API
export interface ProjectImageViewModel {
  id: number;
  imageUrl: string;
  imageTitle: string;
  imageName: string;
  imageCategoryId: ImageCategory;
  projectId: number;
}

// Request types
export type CreateOrUpdateProjectRequest = AddChurchProjectViewModel;
export type SearchProjectsRequest = SearchFilter;
export type CreateProjectImagesRequest = AddProjectImageViewModel;
export type UpdateProjectImagesRequest = UpdateImageRequest;

// Response types based on API documentation
export interface Int32ListResult extends StandardApiResponse<number[]> {}
export interface Int32Result extends StandardApiResponse<number> {}
export interface ChurchProjectPageViewModelListResult extends StandardApiResponse<ChurchProjectPageViewModel[]> {}
export interface ChurchProjectViewModelResult extends StandardApiResponse<ChurchProjectViewModel> {}
export interface ProjectImageViewModelListResult extends StandardApiResponse<ProjectImageViewModel[]> {}
export interface ProjectImageViewModelResult extends StandardApiResponse<ProjectImageViewModel> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateProjectResponse extends Int32ListResult {}
export interface GetProjectsResponse extends StandardApiResponse<ChurchProjectGetProjectsData> {}
export interface SearchProjectsResponse extends PaginatedApiResponse<ChurchProjectGetProjectsData> {}
export interface GetProjectResponse extends ChurchProjectViewModelResult {}
export interface DeleteProjectResponse extends Int32Result {}

export interface CreateProjectImagesResponse extends Int32Result {}
export interface UpdateProjectImagesResponse extends Int32Result {}
export interface GetProjectImagesResponse extends ProjectImageViewModelListResult {}
export interface GetProjectImageResponse extends ProjectImageViewModelResult {}
export interface DeleteProjectImageResponse extends Int32Result {}