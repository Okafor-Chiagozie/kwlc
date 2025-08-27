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
export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday", 
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday"
}

export enum ImageCategory {
  CarouselImage = "CarouselImage",
  GalleryImages = "GalleryImages",
  PreviewImage = "PreviewImage",
  ThumbnailImage = "ThumbnailImage",
  Headshots = "Headshots",
  TicketImage = "TicketImage"
}

// Date and Time interfaces from API
export interface DateOnly {
  year: number;
  month: number;
  day: number;
  dayOfWeek: DayOfWeek;
  dayOfYear: number;
  dayNumber: number;
}

export interface TimeOnly {
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
  ticks?: number;
}

// Request/Response schemas exactly as defined in API documentation

// AddWeddingViewModel from API
export interface AddWeddingViewModel {
  id?: number | null;
  bride: string;
  groom: string;
  branchId?: number | null;
  address: string;
  venue: string;
  description: string;
  date: DateOnly;
  startTime: TimeOnly;
  closeTime: TimeOnly;
}

// WeddingResponseViewModel from API
export interface WeddingResponseViewModel {
  id?: number | null;
  bride: string;
  groom: string;
  branchId?: number | null;
  address: string;
  branchName: string;
  venue: string;
  description: string;
  date: string;
  startTime: string;
  closeTime: string;
  galleryImages: string[];
  previewImages: string[];
  thumbnailImageUrl: string;
}

// WeddingImageViewModel from API
export interface WeddingImageViewModel {
  id: number;
  weddingId: number;
  imageUrl: string;
  imageName: string;
  imageTitle: string;
  imageCategoryId: ImageCategory;
}

// Request types
export type CreateOrUpdateWeddingRequest = AddWeddingViewModel;
export type GetAllWeddingsRequest = SearchFilter;
export type CreateWeddingImageRequest = {
  weddingId: number; // Fixed: consistent camelCase
  imageCategoryId: ImageCategory;
  File: File[];
};
export type UpdateWeddingImageRequest = {
  id: number; // Fixed: consistent camelCase
  file: File;
};

// Response types based on API documentation
export interface Int32Result extends StandardApiResponse<number> {}
export interface WeddingResponseViewModelListResult extends StandardApiResponse<WeddingResponseViewModel[]> {}
export interface WeddingResponseViewModelPaginationResult extends PaginatedApiResponse<WeddingResponseViewModel[]> {}
export interface WeddingImageViewModelResult extends StandardApiResponse<WeddingImageViewModel> {}
export interface WeddingImageViewModelListResult extends StandardApiResponse<WeddingImageViewModel[]> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateWeddingResponse extends WeddingResponseViewModelListResult {}
export interface GetAllWeddingsResponse extends WeddingResponseViewModelPaginationResult {}
export interface GetWeddingResponse extends WeddingResponseViewModelListResult {}
export interface DeleteWeddingResponse extends Int32Result {}
export interface CreateWeddingImageResponse extends WeddingImageViewModelResult {}
export interface UpdateWeddingImageResponse extends WeddingImageViewModelResult {}
export interface GetWeddingImagesResponse extends WeddingImageViewModelListResult {}
export interface GetWeddingImageResponse extends WeddingImageViewModelResult {}
export interface DeleteWeddingImageResponse extends Int32Result {}

// Additional response types for missing endpoints
export interface GetBranchWeddingsRequest extends SearchFilter {
  branchId: number;
}
export interface GetBranchWeddingsResponse extends WeddingResponseViewModelPaginationResult {}
export interface GetUpcomingWeddingsRequest extends SearchFilter {}
export interface GetUpcomingWeddingsResponse extends WeddingResponseViewModelPaginationResult {}
