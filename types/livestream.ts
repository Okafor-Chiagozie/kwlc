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

// Import TicketViewModel from ticket types since API returns TicketViewModelListResult
// Note: This appears to be an API design issue where Livestream endpoints incorrectly return Ticket types
export interface TicketViewModel {
  id?: number | null;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file?: File | null;
  ticketNumber: string;
  seatNumber?: number | null;
  price: number;
  paymentStatus: boolean;
  imageUrl: string;
  eventName: string;
}

// Request types based on API documentation
export type GetLivestreamUrlRequest = void; // No parameters
export type GetCompletedStreamsRequest = SearchFilter;
export type GetUpcomingStreamsRequest = SearchFilter;
export type GetAllAvailableStreamsRequest = SearchFilter;
export type GetStreamDetailsByURLRequest = string; // URL string
export type GetStreamDetailsByIdRequest = string; // Video ID string
export type DeleteStreamRequest = number; // ID number

// Response types based on actual API documentation
// NOTE: API incorrectly returns TicketViewModelListResult for all Livestream endpoints
// This appears to be a backend API design issue
export interface TicketViewModelListResult extends StandardApiResponse<TicketViewModel[]> {}

// Response interfaces matching API exactly
export interface GetLivestreamUrlResponse extends TicketViewModelListResult {}
export interface GetCompletedStreamsResponse extends TicketViewModelListResult {}
export interface GetUpcomingStreamsResponse extends TicketViewModelListResult {}
export interface GetAllAvailableStreamsResponse extends TicketViewModelListResult {}
export interface GetStreamDetailsByURLResponse extends TicketViewModelListResult {}
export interface GetStreamDetailsByIdResponse extends TicketViewModelListResult {}
export interface DeleteStreamResponse extends TicketViewModelListResult {}

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
