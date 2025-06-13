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

export interface ChurchProject {
  id: number;
  name: string;
  location: string;
  targetAmount: number;
  description: string;
  imageUrl?: string;
  amountRaised?: number;
  isDeleted?: boolean;
  dateDeleted?: string;
  carouselImages?: string[];
  previewImages?: string[];
  galleryImages?: string[];
}

export interface ChurchProjectImage {
  id: number;
  imageUrl: string;
  imageTitle: string;
  imageName: string;
  imageCategoryId: 'CarouselImage' | 'PreviewImage' | 'GalleryImage';
  projectId: number;
}

export interface CreateOrUpdateProjectRequest {
  id: number | null;
  name: string;
  location: string;
  targetAmount: number;
  description: string;
}

export interface CreateOrUpdateProjectImagesRequest {
  imageTitle: string;
  file: string[];
  imageCategoryId: 'CarouselImage' | 'PreviewImage' | 'GalleryImage';
  projectId: number | null;
}

export interface SearchProjectsRequest {
  pageSize: number;
  pageNumber: number;
  searchParams: Record<string, string>;
}

export interface GetProjectsResponse extends StandardApiResponse<ChurchProject[]> {}
export interface GetProjectResponse extends StandardApiResponse<ChurchProject> {}
export interface CreateOrUpdateProjectResponse extends StandardApiResponse<number> {}
export interface DeleteProjectResponse extends StandardApiResponse<number> {}

export interface GetProjectImagesResponse extends StandardApiResponse<ChurchProjectImage[]> {}
export interface GetProjectImageResponse extends StandardApiResponse<ChurchProjectImage> {}
export interface CreateOrUpdateProjectImagesResponse extends StandardApiResponse<number> {}
export interface DeleteProjectImageResponse extends StandardApiResponse<number> {}
