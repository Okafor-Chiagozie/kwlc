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

export interface SearchFilter {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

// Actual Livestream response structure based on API testing
export interface LivestreamViewModel {
  isLive: boolean;
  title: string;
  streamId: string;
  entTime: string;
  viewCount: number;
  streamUrl: string;
  startTime: string;
  streamDate: string;
  duration: string;
  description: string;
  thumbnailUrl: string;
  currentViewers: number | null;
}

// Request types based on API documentation
export type GetLivestreamUrlRequest = void; // No parameters
export type GetCompletedStreamsRequest = SearchFilter;
export type GetUpcomingStreamsRequest = SearchFilter;
export type GetAllAvailableStreamsRequest = SearchFilter;
export type GetStreamDetailsByURLRequest = string; // URL string
export type GetStreamDetailsByIdRequest = string; // Video ID string
export type DeleteStreamRequest = number; // ID number
export type GetNormalUploadsRequest = SearchFilter; // Uploaded videos pagination

// Response types based on actual API testing
export interface LivestreamViewModelListResult extends StandardApiResponse<LivestreamViewModel[]> {}

// Response interfaces matching actual API structure
export interface GetLivestreamUrlResponse extends LivestreamViewModelListResult {}
export interface GetCompletedStreamsResponse extends LivestreamViewModelListResult {}
export interface GetUpcomingStreamsResponse extends LivestreamViewModelListResult {}
export interface GetAllAvailableStreamsResponse extends LivestreamViewModelListResult {}
export interface GetStreamDetailsByURLResponse extends LivestreamViewModelListResult {}
export interface GetStreamDetailsByIdResponse extends LivestreamViewModelListResult {}
export interface DeleteStreamResponse extends LivestreamViewModelListResult {}
export interface GetNormalUploadsResponse extends LivestreamViewModelListResult {}

// TODO: These custom types should be used once backend fixes the response types
// Currently commented out because API returns TicketViewModelListResult instead
/*
export interface LivestreamViewModel {
  id: string;
  title: string;
  description?: string;
  streamUrl: string;
  thumbnailUrl?: string;
  status: LivestreamStatus;
  startTime: string; // DateTime
  endTime?: string; // DateTime
  duration?: number; // in minutes
  viewerCount?: number;
  isLive: boolean;
  tags?: string[];
  createdAt: string; // DateTime
  updatedAt?: string; // DateTime
}

export enum LivestreamStatus {
  Scheduled = "Scheduled",
  Live = "Live",
  Ended = "Ended",
  Cancelled = "Cancelled",
  OnDemand = "OnDemand"
}
*/
